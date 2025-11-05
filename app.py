#!/usr/bin/env python3
from flask import Flask, request, jsonify, send_file, send_from_directory
import openai
import os
import json
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import io

# ADD THESE TWO LINES AT THE TOP (after imports)
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='public', static_url_path='')

# Configure OpenAI (explicit, fail-fast)
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable is not set. Set it before running.")

# create the client instance (use the same API used elsewhere in your code)
openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze personality assessment using GPT"""
    try:
        data = request.json or {}
        selected_traits = data.get('selectedTraits', [])
        answers = data.get('answers', {})
        trait_data = data.get('traitData', {})
        
        # Log received data
        print("\n" + "="*80)
        print("API REQUEST RECEIVED - /api/analyze")
        print("="*80)
        print(f"Selected Traits: {selected_traits}")
        print(f"\nAnswers submitted:")
        for trait, trait_answers in answers.items():
            print(f"  {trait}:")
            for q_id, value in trait_answers.items():
                print(f"    {q_id}: {value}")
        print("="*80 + "\n")
        
        # Calculate basic metrics for each trait
        results = {}
        print("\nCALCULATED METRICS:")
        print("-"*80)
        for trait in selected_traits:
            trait_questions = trait_data[trait]['questions']
            trait_answers = answers[trait]
            
            # Separate scenario and verification questions
            scenario_qs = [q for q in trait_questions if not q['id'].startswith('V')]
            verification_q = next(q for q in trait_questions if q['id'].startswith('V'))
            
            # Calculate metrics
            scenario_values = [trait_answers[q['id']] for q in scenario_qs]
            verification_value = trait_answers[verification_q['id']]
            
            base = sum(scenario_values) / len(scenario_values)
            count_0 = sum(1 for v in scenario_values if v == 0)
            count_2 = sum(1 for v in scenario_values if v == 2)
            maj_frac = max(count_0, count_2) / len(scenario_values)
            
            delta = abs(base - verification_value)
            agreement = 1 - delta / 2.0
            
            variance = sum((v - base) ** 2 for v in scenario_values) / len(scenario_values)
            consistency = 1 - variance / 0.889
            
            situationality = 1 - maj_frac
            
            pattern = '-'.join(['A' if v == 0 else 'B' for v in scenario_values])
            
            results[trait] = {
                'score': base,
                'consistency': consistency,
                'agreement': agreement,
                'situationality': situationality,
                'pattern': pattern,
                'verification': verification_value
            }
            
            print(f"\n{trait}:")
            print(f"  Score: {base:.2f}")
            print(f"  Pattern: {pattern}")
            print(f"  Consistency: {consistency:.2f}")
            print(f"  Self-Awareness: {agreement:.2f}")
            print(f"  Adaptability: {situationality:.2f}")
        
        print("-"*80 + "\n")
        
        # Generate overall assessment first
        overall_assessment = generate_overall_assessment(selected_traits, results, trait_data, answers)
        
        # Generate GPT-powered analysis for individual traits
        html_output, trait_analyses = generate_gpt_analysis(selected_traits, results, answers, trait_data, overall_assessment)
        
        print("\nANALYSIS COMPLETE - Returning results")
        print("="*80 + "\n")
        
        return jsonify({
            'html': html_output,
            'results': results,
            'overallAssessment': overall_assessment,
            'traitAnalyses': trait_analyses
        })
        
    except Exception as e:
        print(f"Error in analyze: {str(e)}")
        return jsonify({'error': str(e)}), 500

def generate_overall_assessment(selected_traits, results, trait_data, answers):
    """Generate comprehensive overall personality assessment using GPT"""
    
    # Calculate aggregate metrics
    avg_consistency = sum(results[t]['consistency'] for t in selected_traits) / len(selected_traits)
    avg_agreement = sum(results[t]['agreement'] for t in selected_traits) / len(selected_traits)
    avg_situationality = sum(results[t]['situationality'] for t in selected_traits) / len(selected_traits)
    
    # Build GPT prompt with actual questions and answers
    prompt = f"""You are an expert organizational psychologist. Analyze this complete personality assessment based on the actual scenarios and choices made by the respondent.

ASSESSMENT PROFILE:
Number of traits assessed: {len(selected_traits)}

DETAILED RESPONSES BY TRAIT:
"""
    
    for trait in selected_traits:
        result = results[trait]
        interp = trait_data[trait]['interpretation']
        pattern_info = trait_data[trait]['patterns'].get(result['pattern'], {})
        
        prompt += f"""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRAIT: {interp['name']}
Interpretation: Low end = {interp['lowEnd']}, High end = {interp['highEnd']}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pattern: {result['pattern']} - {pattern_info.get('label', '')}
Metrics: Consistency={result['consistency']:.2f} | Self-Awareness={result['agreement']:.2f} | Adaptability={result['situationality']:.2f}

SCENARIO QUESTIONS & RESPONDENT'S CHOICES:
"""
        
        trait_questions = trait_data[trait]['questions']
        trait_answers = answers[trait]
        
        for q in trait_questions:
            q_id = q['id']
            q_text = q['text']
            user_answer = trait_answers.get(q_id)
            
            # Find the selected option
            selected_option = None
            for opt in q['options']:
                if opt['value'] == user_answer:
                    selected_option = opt
                    break
            
            if selected_option:
                prompt += f"""
Question {q_id}: {q_text}

CHOSEN OPTION: {selected_option['label']}
Psychological Meaning: {selected_option.get('decoding', 'N/A')}
"""
    
    prompt += f"""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGGREGATE METRICS ACROSS ALL TRAITS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Average Consistency: {avg_consistency:.2f}
- Average Self-Awareness: {avg_agreement:.2f}
- Average Adaptability: {avg_situationality:.2f}

ANALYSIS TASK:
Based on the ACTUAL SCENARIOS and SPECIFIC CHOICES this person made (not just the numeric scores), write a comprehensive personality assessment.

FIRST, create a concise personality type title (2-5 words) that captures their core behavioral signature. Examples: "Strategic Consensus Builder", "Adaptive Pragmatist", "Principled Independent", "Collaborative Innovator". This should be memorable and specific to their choices.

THEN write 6 analysis sections (4-6 paragraphs, 3-4 sentences each):

1. PERSONALITY PROFILE SUMMARY: What do their specific choices across different professional scenarios reveal about their core behavioral style? Reference actual scenarios they faced and the reasoning patterns visible in their choices. How do these traits interact?

2. DECISION-MAKING STYLE: Based on HOW they chose to handle the specific dilemmas (conflicting stakeholders, resource constraints, unexpected changes), what does this reveal about their decision-making approach? What are their cognitive preferences when under pressure?

3. SELF-AWARENESS & ADAPTABILITY: How well do their scenario-based choices align with their self-perception? Do they adapt their approach based on context, or maintain consistency? Reference specific patterns you observe.

4. BEHAVIORAL PATTERNS & THEMES: What recurring themes emerge from their actual choices? Are there consistent behavioral signatures in how they handle authority conflicts, resource allocation, risk, or uncertainty?

5. PROFESSIONAL IMPLICATIONS: Based on their SPECIFIC CHOICES (not generic trait descriptions), what are their likely strengths? What blind spots might they have? What work environments would suit them best?

6. DEVELOPMENT INSIGHTS: What specific development recommendations emerge from analyzing their actual decision patterns?

CRITICAL: Base your analysis on the SPECIFIC SCENARIOS and CHOICES described above. Reference actual situations they faced and decisions they made. Avoid generic trait descriptions. Be concrete and specific.

Format as JSON with keys: {{"personality_type_title": "title", "profile_summary": "text", "decision_style": "text", "awareness_adaptability": "text", "patterns_themes": "text", "professional_implications": "text", "development_insights": "text"}}"""
    
    print("\nGPT PROMPT FOR OVERALL ASSESSMENT:")
    print("-"*80)
    print(prompt)
    print("-"*80 + "\n")
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert organizational psychologist. Analyze the actual scenarios and choices made by the respondent. Be specific and concrete, referencing their actual decisions. Create a memorable personality type title. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2500
        )
        
        content = response.choices[0].message.content or "{}"
        
        print("GPT RESPONSE FOR OVERALL ASSESSMENT:")
        print("-"*80)
        print(content)
        print("-"*80 + "\n")
        
        # Clean up markdown if present
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].split('```')[0].strip()
        
        return json.loads(content)
        
    except Exception as e:
        print(f"GPT Error for overall assessment: {str(e)}")
        return {
            'personality_type_title': 'Multifaceted Professional',
            'profile_summary': f'Your assessment covered {len(selected_traits)} personality dimensions, revealing distinct behavioral patterns.',
            'decision_style': 'Your responses demonstrate a characteristic approach to professional decision-making.',
            'awareness_adaptability': f'Your self-awareness level is at {int(avg_agreement*100)}% and adaptability at {int(avg_situationality*100)}%.',
            'patterns_themes': 'Multiple behavioral patterns emerge from your responses.',
            'professional_implications': 'These traits have specific implications for your professional effectiveness.',
            'development_insights': 'Consider focusing on areas where your scores show opportunities for growth.'
        }

def generate_gpt_analysis(selected_traits, results, answers, trait_data, overall_assessment):
    """Use GPT to generate comprehensive personality analysis"""
    
    # First, generate the HTML structure with overall assessment
    html = generate_html_structure(selected_traits, results, answers, trait_data, overall_assessment)
    
    # Store trait analyses for PDF generation
    trait_analyses = {}
    
    # Then, for each trait, get GPT to write the analysis content
    for trait in selected_traits:
        result = results[trait]
        interp = trait_data[trait]['interpretation']
        pattern_info = trait_data[trait]['patterns'].get(result['pattern'], {})
        trait_questions = trait_data[trait]['questions']
        trait_answers = answers[trait]
        
        # Build prompt with actual questions and answers
        prompt = f"""You are an expert organizational psychologist. Analyze this personality trait based on the ACTUAL SCENARIOS and CHOICES made by the respondent.

TRAIT: {interp['name']}
TRAIT INTERPRETATION:
- Low End ({interp['lowEnd']}): {interp.get('lowDescription', '')}
- High End ({interp['highEnd']}): {interp.get('highDescription', '')}
- Mixed: {interp.get('mixedDescription', '')}

PATTERN IDENTIFIED: {result['pattern']} - {pattern_info.get('label', '')}
Pattern Logic: {pattern_info.get('logic', '')}

METRICS:
- Score: {result['score']:.2f} (0=low end, 2=high end)
- Consistency: {result['consistency']:.2f}
- Self-Awareness (Agreement): {result['agreement']:.2f}
- Adaptability (Situationality): {result['situationality']:.2f}
- Self-rating: {result['verification']}

ACTUAL SCENARIOS & RESPONDENT'S CHOICES:
"""
        
        for q in trait_questions:
            q_id = q['id']
            q_text = q['text']
            user_answer = trait_answers.get(q_id)
            
            # Find the selected option
            selected_option = None
            for opt in q['options']:
                if opt['value'] == user_answer:
                    selected_option = opt
                    break
            
            if selected_option:
                prompt += f"""

Question {q_id}: {q_text}

CHOSEN: {selected_option['label']}
What this reveals: {selected_option.get('decoding', 'N/A')}
"""
        
        prompt += f"""

ANALYSIS TASK:
Generate 4 analysis paragraphs (2-3 sentences each) based on their SPECIFIC CHOICES in the scenarios above:

1. BEHAVIORAL_PROFILE: What do their specific choices reveal about how they actually behave in professional contexts? Reference the actual scenarios and decisions.

2. SELF_AWARENESS: Analyze the gap/alignment between their self-rating ({result['verification']}) and their actual scenario choices (average: {result['score']:.2f}). What does this specific discrepancy or alignment tell us?

3. ADAPTABILITY: Based on their actual pattern of choices ({result['pattern']}), what does this reveal about their contextual flexibility? Reference specific scenarios where they adapted or stayed consistent.

4. PATTERN_SUMMARY: Integrate the pattern interpretation with their actual choices. What practical implications emerge from how they specifically handled these situations?

CRITICAL: Reference the ACTUAL SCENARIOS and SPECIFIC CHOICES they made. Be concrete, not generic.

Format as JSON: {{"behavioral_profile": "text", "self_awareness": "text", "adaptability": "text", "pattern_summary": "text"}}"""
        
        print(f"\nGPT PROMPT FOR TRAIT: {trait}")
        print("-"*80)
        print(prompt[:500] + "..." if len(prompt) > 500 else prompt)
        print("-"*80 + "\n")
        
        try:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert organizational psychologist. Analyze based on actual scenarios and specific choices. Be concrete and reference actual decisions made. Respond only with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1200
            )
            
            content = response.choices[0].message.content or "{}"
            
            print(f"GPT RESPONSE FOR TRAIT {trait}:")
            print("-"*80)
            print(content)
            print("-"*80 + "\n")
            
            # Clean up markdown if present
            if '```json' in content:
                content = content.split('```json')[1].split('```')[0].strip()
            elif '```' in content:
                content = content.split('```')[1].split('```')[0].strip()
            
            analysis = json.loads(content)
            
            # Store for PDF generation
            trait_analyses[trait] = analysis
            
            # Replace placeholders in HTML with GPT analysis
            html = html.replace(f'{{BEHAVIORAL_PROFILE_{trait}}}', analysis.get('behavioral_profile', 'Analysis unavailable'))
            html = html.replace(f'{{SELF_AWARENESS_{trait}}}', analysis.get('self_awareness', 'Analysis unavailable'))
            html = html.replace(f'{{ADAPTABILITY_{trait}}}', analysis.get('adaptability', 'Analysis unavailable'))
            html = html.replace(f'{{PATTERN_SUMMARY_{trait}}}', analysis.get('pattern_summary', 'Analysis unavailable'))
            
        except Exception as e:
            print(f"GPT Error for {trait}: {str(e)}")
            # Use fallback text
            fallback_analysis = {
                'behavioral_profile': f'Based on your responses, you show a tendency toward {interp["lowEnd"] if result["score"] < 1.0 else interp["highEnd"]}.',
                'self_awareness': f'Your self-perception alignment is {int(result["agreement"]*100)}%.',
                'adaptability': f'You demonstrate {int(result["situationality"]*100)}% adaptability across contexts.',
                'pattern_summary': pattern_info.get('label', 'Pattern analysis unavailable')
            }
            trait_analyses[trait] = fallback_analysis
            
            html = html.replace(f'{{BEHAVIORAL_PROFILE_{trait}}}', fallback_analysis['behavioral_profile'])
            html = html.replace(f'{{SELF_AWARENESS_{trait}}}', fallback_analysis['self_awareness'])
            html = html.replace(f'{{ADAPTABILITY_{trait}}}', fallback_analysis['adaptability'])
            html = html.replace(f'{{PATTERN_SUMMARY_{trait}}}', fallback_analysis['pattern_summary'])
    
    return html, trait_analyses

def get_trait_orientation(score):
    """Determine trait orientation based on score"""
    if score < 0.7:
        return ("Low", "low")
    elif score > 1.3:
        return ("High", "high")
    else:
        return ("Moderate", "moderate")

def generate_html_structure(selected_traits, results, answers, trait_data, overall_assessment):
    """Generate the complete HTML structure with placeholders for GPT content"""
    
    # Calculate aggregate metrics
    avg_consistency = sum(results[t]['consistency'] for t in selected_traits) / len(selected_traits)
    avg_agreement = sum(results[t]['agreement'] for t in selected_traits) / len(selected_traits)
    avg_situationality = sum(results[t]['situationality'] for t in selected_traits) / len(selected_traits)
    
    # Start with detailed metrics table
    html = '<div class="card metrics-table-card">'
    html += '<h2>Assessment Metrics Summary</h2>'
    html += '<p class="help-text" style="margin-bottom: 20px;">This table shows your scores across all assessed traits. Hover over any metric for an explanation.</p>'
    
    html += '<div class="metrics-table-wrapper">'
    html += '<table class="metrics-table">'
    html += '<thead><tr>'
    html += '<th class="has-tooltip">Trait<span class="tooltip">The personality dimension being measured</span></th>'
    html += '<th class="has-tooltip">Orientation<span class="tooltip">Your tendency on this trait: Low (0-0.6), Moderate (0.7-1.3), or High (1.4-2.0)</span></th>'
    html += '<th class="has-tooltip">Score<span class="tooltip">Average of your scenario-based responses (0-2 scale)</span></th>'
    html += '<th class="has-tooltip">Pattern<span class="tooltip">Your response pattern across scenarios: A=Low-end choice, B=High-end choice</span></th>'
    html += '<th class="has-tooltip">Consistency<span class="tooltip">How similar your responses were across different scenarios (0-100%). High = predictable, Low = context-dependent</span></th>'
    html += '<th class="has-tooltip">Self-Match<span class="tooltip">Alignment between your self-rating and scenario-based behavior (0-100%). High = good self-awareness</span></th>'
    html += '<th class="has-tooltip">Adaptability<span class="tooltip">Degree of contextual flexibility (0-100%). High = adapts to situations, Low = consistent approach</span></th>'
    html += '</tr></thead><tbody>'
    
    for trait in selected_traits:
        result = results[trait]
        interp = trait_data[trait]['interpretation']
        orientation, orientation_class = get_trait_orientation(result['score'])
        
        # Determine badge classes
        consistency_class = 'badge-high' if result['consistency'] > 0.7 else ('badge-medium' if result['consistency'] > 0.4 else 'badge-low')
        agreement_class = 'badge-high' if result['agreement'] > 0.7 else ('badge-medium' if result['agreement'] > 0.4 else 'badge-low')
        situationality_class = 'badge-high' if result['situationality'] > 0.6 else ('badge-medium' if result['situationality'] > 0.3 else 'badge-low')
        
        html += '<tr>'
        html += f'<td class="trait-name-cell"><strong>{interp["name"]}</strong><br><span class="trait-range">{interp["lowEnd"]} ↔ {interp["highEnd"]}</span></td>'
        html += f'<td><span class="badge badge-{orientation_class}">{orientation}</span></td>'
        html += f'<td class="score-cell">{result["score"]:.2f}</td>'
        html += f'<td class="pattern-cell"><code>{result["pattern"]}</code></td>'
        html += f'<td><span class="badge {consistency_class}">{int(result["consistency"]*100)}%</span></td>'
        html += f'<td><span class="badge {agreement_class}">{int(result["agreement"]*100)}%</span></td>'
        html += f'<td><span class="badge {situationality_class}">{int(result["situationality"]*100)}%</span></td>'
        html += '</tr>'
    
    # Add summary row
    html += '<tr class="summary-row">'
    html += '<td colspan="4"><strong>Average Across All Traits</strong></td>'
    avg_consistency_class = 'badge-high' if avg_consistency > 0.7 else ('badge-medium' if avg_consistency > 0.4 else 'badge-low')
    avg_agreement_class = 'badge-high' if avg_agreement > 0.7 else ('badge-medium' if avg_agreement > 0.4 else 'badge-low')
    avg_situationality_class = 'badge-high' if avg_situationality > 0.6 else ('badge-medium' if avg_situationality > 0.3 else 'badge-low')
    html += f'<td><span class="badge {avg_consistency_class}">{int(avg_consistency*100)}%</span></td>'
    html += f'<td><span class="badge {avg_agreement_class}">{int(avg_agreement*100)}%</span></td>'
    html += f'<td><span class="badge {avg_situationality_class}">{int(avg_situationality*100)}%</span></td>'
    html += '</tr>'
    
    html += '</tbody></table></div></div>'
    
    # Overall assessment with personality type title
    html += '<div class="card overall-assessment">'
    html += '<h2>Overall Personality Assessment</h2>'
    
    # Add personality type title
    personality_title = overall_assessment.get('personality_type_title', 'Multifaceted Professional')
    html += f'<div class="personality-type-banner">'
    html += f'<div class="personality-type-label">Your Personality Type</div>'
    html += f'<div class="personality-type-title">{personality_title}</div>'
    html += '<p class="help-text">This title captures your core behavioral signature based on your specific choices across all scenarios.</p>'
    html += '</div>'
    
    # Quick metrics overview
    html += '<div class="metric-grid" style="margin: 20px 0;">'
    html += f'<div class="metric-card has-tooltip"><div class="metric-label">Traits Assessed</div><div class="metric-value">{len(selected_traits)}</div><span class="tooltip">Number of personality dimensions evaluated in your assessment</span></div>'
    html += f'<div class="metric-card has-tooltip"><div class="metric-label">Avg Consistency</div><div class="metric-value">{int(avg_consistency*100)}%</div><span class="tooltip">How predictable your behavior is across different scenarios (higher = more consistent)</span></div>'
    html += f'<div class="metric-card has-tooltip"><div class="metric-label">Self-Awareness</div><div class="metric-value">{int(avg_agreement*100)}%</div><span class="tooltip">How well your self-perception matches your actual behavioral choices (higher = better self-knowledge)</span></div>'
    html += f'<div class="metric-card has-tooltip"><div class="metric-label">Adaptability</div><div class="metric-value">{int(avg_situationality*100)}%</div><span class="tooltip">Your tendency to adjust behavior based on context (higher = more flexible)</span></div>'
    html += '</div>'
    
    # Add GPT-generated overall assessment sections
    html += '<div style="margin-top: 30px;">'
    html += '<h3 style="color: hsl(var(--primary)); font-size: 20px; margin-bottom: 15px;">Personality Profile</h3>'
    html += f'<p style="line-height: 1.8; margin-bottom: 20px;">{overall_assessment.get("profile_summary", "")}</p>'
    
    html += '<h3 style="color: hsl(var(--primary)); font-size: 20px; margin-bottom: 15px;">Decision-Making Style <span class="help-icon has-tooltip">?<span class="tooltip">How you approach decisions and solve problems in professional contexts</span></span></h3>'
    html += f'<p style="line-height: 1.8; margin-bottom: 20px;">{overall_assessment.get("decision_style", "")}</p>'
    
    html += '<h3 style="color: hsl(var(--primary)); font-size: 20px; margin-bottom: 15px;">Self-Awareness & Adaptability <span class="help-icon has-tooltip">?<span class="tooltip">How well you understand yourself and adjust to different situations</span></span></h3>'
    html += f'<p style="line-height: 1.8; margin-bottom: 20px;">{overall_assessment.get("awareness_adaptability", "")}</p>'
    
    html += '<h3 style="color: hsl(var(--primary)); font-size: 20px; margin-bottom: 15px;">Behavioral Patterns & Themes <span class="help-icon has-tooltip">?<span class="tooltip">Recurring patterns in how you handle professional challenges</span></span></h3>'
    html += f'<p style="line-height: 1.8; margin-bottom: 20px;">{overall_assessment.get("patterns_themes", "")}</p>'
    
    html += '<h3 style="color: hsl(var(--primary)); font-size: 20px; margin-bottom: 15px;">Professional Implications <span class="help-icon has-tooltip">?<span class="tooltip">How your personality affects your work performance and career fit</span></span></h3>'
    html += f'<p style="line-height: 1.8; margin-bottom: 20px;">{overall_assessment.get("professional_implications", "")}</p>'
    
    html += '<h3 style="color: hsl(var(--primary)); font-size: 20px; margin-bottom: 15px;">Development Insights <span class="help-icon has-tooltip">?<span class="tooltip">Recommendations for personal and professional growth</span></span></h3>'
    html += f'<p style="line-height: 1.8; margin-bottom: 20px;">{overall_assessment.get("development_insights", "")}</p>'
    html += '</div>'
    
    html += '</div>'
    
    # Detailed trait analysis
    for trait in selected_traits:
        interp = trait_data[trait]['interpretation']
        result = results[trait]
        pattern_info = trait_data[trait]['patterns'].get(result['pattern'], {})
        
        html += '<div class="result-card">'
        html += f'<div class="result-header"><h3>{interp["name"]}</h3><span class="toggle-icon">▼</span></div>'
        html += '<div class="result-content">'
        
        # Metrics
        html += '<div class="metric-grid">'
        consistency_class = 'badge-high' if result['consistency'] > 0.7 else ('badge-medium' if result['consistency'] > 0.4 else 'badge-low')
        agreement_class = 'badge-high' if result['agreement'] > 0.7 else ('badge-medium' if result['agreement'] > 0.4 else 'badge-low')
        situationality_class = 'badge-high' if result['situationality'] > 0.6 else ('badge-medium' if result['situationality'] > 0.3 else 'badge-low')
        
        html += f'<div class="metric-card has-tooltip"><div class="metric-label">Consistency</div><div class="metric-value badge {consistency_class}">{int(result["consistency"]*100)}%</div><span class="tooltip">How similar your responses were across scenarios for this trait</span></div>'
        html += f'<div class="metric-card has-tooltip"><div class="metric-label">Self-Awareness</div><div class="metric-value badge {agreement_class}">{int(result["agreement"]*100)}%</div><span class="tooltip">Match between self-rating and scenario-based behavior</span></div>'
        html += f'<div class="metric-card has-tooltip"><div class="metric-label">Adaptability</div><div class="metric-value badge {situationality_class}">{int(result["situationality"]*100)}%</div><span class="tooltip">Degree of contextual flexibility in your responses</span></div>'
        html += '</div>'
        
        # Behavioral Profile
        html += '<div class="analysis-section">'
        html += '<h4>Behavioral Profile <span class="help-icon has-tooltip">?<span class="tooltip">How you actually behave in professional situations based on your scenario choices</span></span> <span class="toggle-icon">▼</span></h4>'
        html += '<div class="analysis-content">'
        
        if result['score'] < 0.7:
            tendency = interp['lowEnd']
        elif result['score'] > 1.3:
            tendency = interp['highEnd']
        else:
            tendency = 'Balanced'
        
        html += f'<p><strong>Primary Orientation:</strong> {tendency}</p>'
        html += f'<p>{{BEHAVIORAL_PROFILE_{trait}}}</p>'
        html += f'<p><strong>Response Pattern:</strong> {result["pattern"]}</p>'
        html += '</div></div>'
        
        # Self-Awareness Analysis
        html += '<div class="analysis-section">'
        html += '<h4>Self-Awareness Analysis <span class="help-icon has-tooltip">?<span class="tooltip">Comparison between how you see yourself and how you actually behave</span></span> <span class="toggle-icon">▼</span></h4>'
        html += '<div class="analysis-content">'
        html += f'<p>{{SELF_AWARENESS_{trait}}}</p>'
        html += f'<p><strong>Agreement Score:</strong> {int(result["agreement"]*100)}% (Self-rating: {result["verification"]}, Scenario average: {result["score"]:.2f})</p>'
        html += '</div></div>'
        
        # Adaptability
        html += '<div class="analysis-section">'
        html += '<h4>Contextual Adaptability <span class="help-icon has-tooltip">?<span class="tooltip">Your tendency to adjust behavior based on different situations</span></span> <span class="toggle-icon">▼</span></h4>'
        html += '<div class="analysis-content">'
        html += f'<p>{{ADAPTABILITY_{trait}}}</p>'
        html += f'<p><strong>Consistency Score:</strong> {int(result["consistency"]*100)}%</p>'
        html += '</div></div>'
        
        # Pattern Analysis
        html += '<div class="analysis-section">'
        html += '<h4>Pattern Analysis <span class="help-icon has-tooltip">?<span class="tooltip">Interpretation of your specific response pattern across scenarios</span></span> <span class="toggle-icon">▼</span></h4>'
        html += '<div class="analysis-content">'
        html += f'<p><strong>{pattern_info.get("label", "Pattern Identified")}</strong></p>'
        html += f'<p>{{PATTERN_SUMMARY_{trait}}}</p>'
        html += f'<p><strong>Decision Logic:</strong> {pattern_info.get("logic", "N/A")}</p>'
        html += f'<p><strong>Observable Cues:</strong> {pattern_info.get("cues", "N/A")}</p>'
        html += f'<p><strong>Organizational Impact:</strong> {pattern_info.get("impact", "N/A")}</p>'
        html += f'<p><strong>Risk Profile:</strong> {pattern_info.get("risk", "N/A")}</p>'
        html += f'<p><strong>Development Recommendations:</strong> {pattern_info.get("development", "N/A")}</p>'
        html += '</div></div>'
        
        # Your Responses section
        html += '<div class="analysis-section">'
        html += '<h4>Your Responses & Score Breakdown <span class="help-icon has-tooltip">?<span class="tooltip">Detailed view of each question and your specific choice</span></span> <span class="toggle-icon">▼</span></h4>'
        html += '<div class="analysis-content">'
        
        trait_questions = trait_data[trait]['questions']
        trait_answers = answers[trait]
        
        for q in trait_questions:
            q_id = q['id']
            q_text = q['text']
            user_answer = trait_answers.get(q_id)
            
            # Find the selected option
            selected_option = None
            for opt in q['options']:
                if opt['value'] == user_answer:
                    selected_option = opt
                    break
            
            if selected_option:
                html += '<div style="margin-bottom: 20px; padding: 15px; background: hsl(var(--card-bg)); border-left: 3px solid hsl(var(--primary));">'
                html += f'<p><strong>Question {q_id}:</strong> {q_text}</p>'
                html += f'<p><strong>Your Choice:</strong> {selected_option["label"]}</p>'
                html += f'<p><strong>Score:</strong> {selected_option["value"]} | <strong>What this reveals:</strong> {selected_option.get("decoding", "N/A")}</p>'
                html += '</div>'
        
        html += '</div></div>'
        
        html += '</div></div>'
    
    return html

@app.route('/api/download', methods=['POST'])
def download_report():
    """Generate PDF report"""
    try:
        data = request.json or {}
        selected_traits = data.get('selectedTraits', [])
        answers = data.get('answers', {})
        
        # Create PDF in memory
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.75*inch, bottomMargin=0.75*inch)
        story = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#5a9f8a',
            spaceAfter=12,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor='#4a8f7a',
            spaceAfter=8
        )
        
        # Title
        story.append(Paragraph("Personality Assessment Report", title_style))
        story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Summary
        story.append(Paragraph("Assessment Summary", heading_style))
        story.append(Paragraph(f"This report contains results for {len(selected_traits)} personality trait dimension(s).", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Traits assessed
        story.append(Paragraph("Traits Assessed:", heading_style))
        for trait in selected_traits:
            story.append(Paragraph(f"• {trait}", styles['Normal']))
        
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("Note: Detailed analysis is available in the web interface. This PDF provides a summary of your assessment responses.", styles['Normal']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'personality-assessment-{datetime.now().strftime("%Y-%m-%d")}.pdf'
        )
        
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)