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
            
            # Consistency: fraction of responses matching the most common response
            max_count = max(count_0, count_2)
            consistency = max_count / len(scenario_values)
            
            # Agreement: alignment with self-rating
            delta = abs(base - verification_value)
            agreement = 1 - delta / 2.0
            
            # Situationality: same as consistency (with only 2 choices)
            situationality = consistency
            
            pattern = '-'.join(['A' if v == 0 else 'B' for v in scenario_values])
            
            results[trait] = {
                'score': base,
                'consistency': consistency,
                'agreement': agreement,
                'situationality': situationality,
                'pattern': pattern,
                'verification': verification_value,
                'scenario_count': len(scenario_values),
                'consistency_count': max_count,
                'agreement_delta': delta,
                'response_distribution': {'0': count_0, '2': count_2}
            }
            
            print(f"\n{trait}:")
            print(f"  Score: {base:.2f}")
            print(f"  Pattern: {pattern}")
            print(f"  Consistency: {max_count}/{len(scenario_values)}")
            print(f"  Self-Awareness: {agreement:.2f}")
            print(f"  Adaptability: {max_count}/{len(scenario_values)}")
        
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
Metrics: Consistency={result['consistency_count']}/{result['scenario_count']} | Self-Awareness={result['agreement']:.2f} | Adaptability={result['consistency_count']}/{result['scenario_count']}

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
            'awareness_adaptability': f'Your self-awareness level is high and you show strong adaptability.',
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
- Consistency: {result['consistency_count']}/{result['scenario_count']}
- Self-Awareness (Agreement): {result['agreement']:.2f}
- Adaptability: {result['consistency_count']}/{result['scenario_count']}
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
                'self_awareness': f'Your self-perception alignment shows room for development.',
                'adaptability': f'You demonstrate contextual flexibility in your responses.',
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

def format_fraction(numerator, denominator):
    """Format as fraction without percentage"""
    return f"{numerator}/{denominator}"

def generate_html_structure(selected_traits, results, answers, trait_data, overall_assessment):
    """Generate the complete HTML structure with placeholders for GPT content"""
    
    # Calculate aggregate metrics
    total_scenarios = sum(results[t]['scenario_count'] for t in selected_traits)
    total_consistent = sum(results[t]['consistency_count'] for t in selected_traits)
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
    html += '<th class="has-tooltip">Consistency<span class="tooltip">Number of responses matching your most common answer. Higher = more predictable behavior</span></th>'
    html += '<th class="has-tooltip">Self-Match<span class="tooltip">How close your self-rating is to your scenario average (0=perfect match, 2=maximum difference)</span></th>'
    html += '<th class="has-tooltip">Adaptability<span class="tooltip">Same as consistency - shows if you maintain a consistent approach or vary by context</span></th>'
    html += '</tr></thead><tbody>'
    
    for trait in selected_traits:
        result = results[trait]
        interp = trait_data[trait]['interpretation']
        orientation, orientation_class = get_trait_orientation(result['score'])
        
        # Determine badge classes
        consistency_class = 'badge-high' if result['consistency'] > 0.7 else ('badge-medium' if result['consistency'] > 0.4 else 'badge-low')
        agreement_class = 'badge-high' if result['agreement_delta'] < 0.5 else ('badge-medium' if result['agreement_delta'] < 1.0 else 'badge-low')
        situationality_class = 'badge-high' if result['situationality'] > 0.7 else ('badge-medium' if result['situationality'] > 0.4 else 'badge-low')
        
        consistency_display = format_fraction(result['consistency_count'], result['scenario_count'])
        agreement_display = f"Δ {result['agreement_delta']:.1f}"
        situationality_display = format_fraction(result['consistency_count'], result['scenario_count'])
        
        html += '<tr>'
        html += f'<td class="trait-name-cell"><strong>{interp["name"]}</strong><br><span class="trait-range">{interp["lowEnd"]} ↔ {interp["highEnd"]}</span></td>'
        html += f'<td><span class="badge badge-{orientation_class}">{orientation}</span></td>'
        html += f'<td class="score-cell">{result["score"]:.2f}</td>'
        html += f'<td class="pattern-cell"><code>{result["pattern"]}</code></td>'
        html += f'<td><span class="badge {consistency_class}">{consistency_display}</span></td>'
        html += f'<td><span class="badge {agreement_class}">{agreement_display}</span></td>'
        html += f'<td><span class="badge {situationality_class}">{situationality_display}</span></td>'
        html += '</tr>'
    
    # Add summary row
    html += '<tr class="summary-row">'
    html += '<td colspan="4"><strong>Average Across All Traits</strong></td>'
    avg_consistency_class = 'badge-high' if avg_consistency > 0.7 else ('badge-medium' if avg_consistency > 0.4 else 'badge-low')
    avg_agreement_class = 'badge-high' if avg_agreement > 0.7 else ('badge-medium' if avg_agreement > 0.4 else 'badge-low')
    avg_situationality_class = 'badge-high' if avg_situationality > 0.7 else ('badge-medium' if avg_situationality > 0.4 else 'badge-low')
    
    avg_consistency_display = format_fraction(total_consistent, total_scenarios)
    avg_agreement_display = f"{avg_agreement:.2f}"
    avg_situationality_display = format_fraction(total_consistent, total_scenarios)
    
    html += f'<td><span class="badge {avg_consistency_class}">{avg_consistency_display}</span></td>'
    html += f'<td><span class="badge {avg_agreement_class}">{avg_agreement_display}</span></td>'
    html += f'<td><span class="badge {avg_situationality_class}">{avg_situationality_display}</span></td>'
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
    html += f'<div class="metric-card has-tooltip"><div class="metric-label">Avg Consistency</div><div class="metric-value">{avg_consistency_display}</div><span class="tooltip">How predictable your behavior is across different scenarios</span></div>'
    html += f'<div class="metric-card has-tooltip"><div class="metric-label">Self-Awareness</div><div class="metric-value">{avg_agreement_display}</div><span class="tooltip">How well your self-perception matches your actual behavioral choices (0-2 scale, lower is better)</span></div>'
    html += f'<div class="metric-card has-tooltip"><div class="metric-label">Adaptability</div><div class="metric-value">{avg_situationality_display}</div><span class="tooltip">Your tendency to maintain consistent behavior across contexts</span></div>'
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
    """Generate comprehensive PDF report with AI analysis"""
    try:
        data = request.json or {}
        selected_traits = data.get('selectedTraits', [])
        answers = data.get('answers', {})
        results = data.get('results', {})
        overall_assessment = data.get('overallAssessment', {})
        trait_analyses = data.get('traitAnalyses', {})
        trait_data = data.get('traitData', {})
        
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
            spaceAfter=10,
            spaceBefore=15
        )
        
        subheading_style = ParagraphStyle(
            'CustomSubheading',
            parent=styles['Heading3'],
            fontSize=13,
            textColor='#3a7f6a',
            spaceAfter=8,
            spaceBefore=10
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            leading=14
        )
        
        # Title Page
        story.append(Paragraph("Personality Assessment Report", title_style))
        story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Spacer(1, 0.5*inch))
        
        # Overall Assessment
        if overall_assessment:
            story.append(Paragraph("Overall Personality Assessment", heading_style))
            
            # Personality Type Title
            personality_title = overall_assessment.get('personality_type_title', 'Multifaceted Professional')
            story.append(Paragraph(f"<b>Your Personality Type: {personality_title}</b>", body_style))
            story.append(Spacer(1, 0.2*inch))
            
            # Profile Summary
            story.append(Paragraph("<b>Personality Profile</b>", subheading_style))
            story.append(Paragraph(overall_assessment.get('profile_summary', ''), body_style))
            story.append(Spacer(1, 0.1*inch))
            
            # Decision-Making Style
            story.append(Paragraph("<b>Decision-Making Style</b>", subheading_style))
            story.append(Paragraph(overall_assessment.get('decision_style', ''), body_style))
            story.append(Spacer(1, 0.1*inch))
            
            # Self-Awareness & Adaptability
            story.append(Paragraph("<b>Self-Awareness &amp; Adaptability</b>", subheading_style))
            story.append(Paragraph(overall_assessment.get('awareness_adaptability', ''), body_style))
            story.append(Spacer(1, 0.1*inch))
            
            # Behavioral Patterns
            story.append(Paragraph("<b>Behavioral Patterns &amp; Themes</b>", subheading_style))
            story.append(Paragraph(overall_assessment.get('patterns_themes', ''), body_style))
            story.append(Spacer(1, 0.1*inch))
            
            # Professional Implications
            story.append(Paragraph("<b>Professional Implications</b>", subheading_style))
            story.append(Paragraph(overall_assessment.get('professional_implications', ''), body_style))
            story.append(Spacer(1, 0.1*inch))
            
            # Development Insights
            story.append(Paragraph("<b>Development Insights</b>", subheading_style))
            story.append(Paragraph(overall_assessment.get('development_insights', ''), body_style))
            
            story.append(PageBreak())
        
        # Detailed Trait Analysis
        for trait in selected_traits:
            result = results.get(trait, {})
            trait_info = trait_data.get(trait, {})
            interp = trait_info.get('interpretation', {})
            trait_analysis = trait_analyses.get(trait, {})
            
            story.append(Paragraph(f"{interp.get('name', trait)}", heading_style))
            story.append(Paragraph(f"<i>{interp.get('lowEnd', '')} ↔ {interp.get('highEnd', '')}</i>", body_style))
            story.append(Spacer(1, 0.1*inch))
            
            # Metrics
            story.append(Paragraph(f"<b>Score:</b> {result.get('score', 0):.2f} | <b>Pattern:</b> {result.get('pattern', 'N/A')} | <b>Consistency:</b> {int(result.get('consistency', 0)*100)}% | <b>Self-Awareness:</b> {int(result.get('agreement', 0)*100)}%", body_style))
            story.append(Spacer(1, 0.15*inch))
            
            # AI Analysis
            if trait_analysis:
                story.append(Paragraph("<b>Behavioral Profile</b>", subheading_style))
                story.append(Paragraph(trait_analysis.get('behavioral_profile', ''), body_style))
                story.append(Spacer(1, 0.1*inch))
                
                story.append(Paragraph("<b>Self-Awareness Analysis</b>", subheading_style))
                story.append(Paragraph(trait_analysis.get('self_awareness', ''), body_style))
                story.append(Spacer(1, 0.1*inch))
                
                story.append(Paragraph("<b>Adaptability</b>", subheading_style))
                story.append(Paragraph(trait_analysis.get('adaptability', ''), body_style))
                story.append(Spacer(1, 0.1*inch))
                
                story.append(Paragraph("<b>Pattern Summary</b>", subheading_style))
                story.append(Paragraph(trait_analysis.get('pattern_summary', ''), body_style))
            
            # Questions and Answers
            story.append(Spacer(1, 0.2*inch))
            story.append(Paragraph("<b>Your Responses</b>", subheading_style))
            
            trait_questions = trait_info.get('questions', [])
            trait_answers = answers.get(trait, {})
            
            for q in trait_questions:
                q_id = q.get('id', '')
                q_text = q.get('text', '')
                user_answer = trait_answers.get(q_id)
                
                # Find selected option
                selected_option = None
                for opt in q.get('options', []):
                    if opt.get('value') == user_answer:
                        selected_option = opt
                        break
                
                if selected_option:
                    story.append(Paragraph(f"<b>Q{q_id}:</b> {q_text}", body_style))
                    story.append(Paragraph(f"<i>Your choice:</i> {selected_option.get('label', '')} (Score: {selected_option.get('value', 0)})", body_style))
                    story.append(Paragraph(f"<i>Reveals:</i> {selected_option.get('decoding', 'N/A')}", body_style))
                    story.append(Spacer(1, 0.1*inch))
            
            story.append(PageBreak())
        
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









#!/usr/bin/env python3
# ADD THIS ROUTE TO YOUR EXISTING app.py FILE

@app.route('/match')
def match_page():
    """Serve the job matching page"""
    return send_from_directory('public', 'match.html')

#!/usr/bin/env python3
# REPLACE THE PREVIOUS /api/match-candidate ROUTE WITH THIS VERSION
@app.route('/api/match-candidate', methods=['POST'])
def match_candidate():
    """Compare candidate report against selected job trait requirements using AI"""
    try:
        # Check if candidate report was uploaded
        if 'candidate_report' not in request.files:
            return jsonify({'error': 'Candidate report PDF is required'}), 400
        
        candidate_file = request.files['candidate_report']
        
        # Get job requirements (now as JSON from form data)
        job_requirements_json = request.form.get('job_requirements')
        if not job_requirements_json:
            return jsonify({'error': 'Job requirements are required'}), 400
        
        # Validate file type
        if not candidate_file.filename.endswith('.pdf'):
            return jsonify({'error': 'Candidate report must be PDF format'}), 400
        
        print("\n" + "="*80)
        print("JOB MATCHING REQUEST RECEIVED - TRAIT SELECTION MODE")
        print("="*80)
        print(f"Candidate Report: {candidate_file.filename}")
        
        # Parse job requirements
        job_requirements = json.loads(job_requirements_json)
        print(f"\nJob Requirements ({len(job_requirements)} traits selected):")
        for trait_name, trait_data in job_requirements.items():
            print(f"  - {trait_name}: {trait_data['level'].upper()}")
        
        # Extract text from candidate PDF
        candidate_text = extract_text_from_pdf(candidate_file)
        
        if not candidate_text:
            return jsonify({'error': 'Could not extract text from candidate PDF'}), 400
        
        print(f"\nExtracted candidate text: {len(candidate_text)} characters")
        
        # Extract which traits were actually assessed in the candidate's report
        assessed_traits = extract_assessed_traits(candidate_text)
        print(f"\nTraits found in candidate's report: {assessed_traits}")
        print("-"*80 + "\n")
        
        # Generate AI matching analysis with awareness of what was actually tested
        matching_analysis = generate_matching_analysis_from_traits(
            candidate_text, 
            job_requirements, 
            assessed_traits
        )
        
        print("\nMATCHING ANALYSIS COMPLETE")
        print("="*80 + "\n")
        
        return jsonify(matching_analysis)
        
    except Exception as e:
        print(f"Error in match-candidate: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def extract_assessed_traits(candidate_text):
    """Extract list of traits that were actually assessed in the candidate's report"""
    
    # All possible trait names from your assessment tool
    all_trait_names = [
        'Analytical Thinking', 'Intuitive Thinking', 'Risk-Taking', 'Risk Aversion',
        'Collaboration', 'Independent Work', 'Detail Orientation', 'Big Picture Thinking',
        'Adaptability', 'Consistency', 'Proactivity', 'Reactivity',
        'Empathy', 'Task Focus', 'Innovation', 'Process Adherence',
        'Decisiveness', 'Deliberation', 'Assertiveness', 'Diplomacy',
        'Optimism', 'Realism', 'Structured', 'Flexible',
        'Results-Oriented', 'Process-Oriented', 'Competitive', 'Cooperative',
        'Confidence', 'Humility'
    ]
    
    assessed_traits = []
    
    # Look for traits mentioned in section headers or trait analysis sections
    for trait in all_trait_names:
        # Check if trait appears as a header or in "Trait:" format
        if trait in candidate_text:
            # Additional verification: check if it appears in a substantial way
            # (not just mentioned in passing)
            trait_lower = trait.lower()
            text_lower = candidate_text.lower()
            
            # Look for patterns like "Trait: X" or substantial discussion
            patterns = [
                f"trait: {trait_lower}",
                f"{trait_lower}\n",
                f"behavioral profile",
                f"pattern analysis"
            ]
            
            # If trait appears near these patterns, it was likely assessed
            for pattern in patterns:
                if pattern in text_lower and trait_lower in text_lower[max(0, text_lower.find(pattern)-200):text_lower.find(pattern)+500]:
                    if trait not in assessed_traits:
                        assessed_traits.append(trait)
                    break
    
    return assessed_traits

def extract_text_from_pdf(pdf_file):
    """Extract text content from PDF file"""
    try:
        from PyPDF2 import PdfReader
        import io
        
        # Read PDF from file object
        pdf_bytes = pdf_file.read()
        pdf_stream = io.BytesIO(pdf_bytes)
        
        reader = PdfReader(pdf_stream)
        text = ""
        
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
        
    except Exception as e:
        print(f"Error extracting PDF text: {str(e)}")
        return None



def generate_matching_analysis_from_traits(candidate_text, job_requirements, assessed_traits):
    """Use GPT to analyze candidate-job fit based on specific trait requirements"""
    
    # Build requirements summary
    requirements_summary = "REQUIRED TRAIT PROFILE FOR THE ROLE:\n"
    requirements_summary += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    
    # Categorize required traits into assessed and not assessed
    directly_assessed = []
    not_assessed = []
    
    for trait_name, trait_data in job_requirements.items():
        level = trait_data['level'].upper()
        description = trait_data['description']
        
        is_assessed = trait_name in assessed_traits
        
        if is_assessed:
            directly_assessed.append(trait_name)
            requirements_summary += f"**{trait_name}** (Required Level: {level}) ✓ DIRECTLY ASSESSED\n"
        else:
            not_assessed.append(trait_name)
            requirements_summary += f"**{trait_name}** (Required Level: {level}) ⚠ NOT DIRECTLY ASSESSED\n"
        
        requirements_summary += f"   Description: {description}\n\n"
    
    # Build comprehensive prompt
    prompt = f"""You are an expert HR analyst and organizational psychologist. Your task is to analyze how well a candidate's personality assessment matches specific trait requirements for a job role.

CANDIDATE'S PERSONALITY ASSESSMENT REPORT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{candidate_text[:8000]}  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{requirements_summary}

IMPORTANT CONTEXT:
The candidate was DIRECTLY ASSESSED on these {len(directly_assessed)} traits: {', '.join(directly_assessed) if directly_assessed else 'NONE'}

The candidate was NOT directly assessed on these {len(not_assessed)} traits: {', '.join(not_assessed) if not_assessed else 'NONE'}

ANALYSIS TASK:

You must analyze the candidate against EACH of the {len(job_requirements)} required traits individually.

FOR DIRECTLY ASSESSED TRAITS (✓):
- Base your analysis SOLELY on the specific trait assessment from the report
- Use the candidate's actual scores, patterns, and behavioral examples for that trait
- Provide evidence-based scoring (1-5 Likert scale)

FOR NON-ASSESSED TRAITS (⚠):
- Clearly state "NOT DIRECTLY ASSESSED" at the start of the analysis
- Make reasonable inferences from OTHER traits and behaviors in the report
- Provide a SECONDARY INFERENCE section explaining what evidence you're using
- Be more conservative in scoring (default to 3 unless strong evidence suggests otherwise)
- Example format: "NOT DIRECTLY ASSESSED. However, based on their [specific trait X] showing [specific behavior], we can infer..."

SCORING SCALE (1-5 Likert):
1 = Major mismatch (candidate shows opposite tendency)
2 = Below requirements (candidate is deficient in this trait)
3 = Meets minimum requirements (acceptable but not ideal) - USE FOR NON-ASSESSED IF UNCLEAR
4 = Exceeds requirements (strong match)
5 = Exceptional match (perfect alignment)

ANALYSIS SECTIONS REQUIRED:

1. TRAIT-BY-TRAIT ANALYSIS - For EACH required trait provide:
   - Fit score (1-5)
   - Whether it was directly assessed (true/false)
   - Primary analysis (2-3 sentences with specific evidence)
   - If NOT assessed: secondary_inference field (2-3 sentences explaining what OTHER evidence you're using)

2. OVERALL FIT SCORE (1-5): Weighted average, but weight directly assessed traits more heavily

3. DETAILED SECTIONS:
   - KEY STRENGTHS (3-5 items): Focus on directly assessed strengths
   - POTENTIAL CONCERNS (2-4 items): Note which concerns are based on inference vs direct assessment
   - DEVELOPMENT NEEDS (3-5 items)
   - SPECIFIC EVIDENCE (4-6 direct quotes/references from report)
   - ASSESSMENT COVERAGE NOTE: Explain which traits were assessed vs inferred
   - RISK ASSESSMENT (2-3 paragraphs): Include discussion of assessment gaps
   - HIRING RECOMMENDATION (Clear decision with rationale)
   - ONBOARDING RECOMMENDATIONS (3-5 items)
   - EXECUTIVE SUMMARY (3-4 paragraphs)

CRITICAL REQUIREMENTS:
- NEVER claim direct assessment evidence for non-assessed traits
- Always distinguish between direct assessment and inference
- Be transparent about assessment gaps
- Use specific quotes and examples for directly assessed traits
- For inferred traits, explain the logical basis clearly

Format as JSON:
{{
  "overall_fit_score": <1-5>,
  "overall_fit_label": "<Poor Fit|Below Average|Adequate|Good Fit|Excellent Fit>",
  "trait_scores": {{
    "<trait_name>": {{
      "score": <1-5>,
      "required_level": "<low|medium|high>",
      "directly_assessed": <true|false>,
      "analysis": "2-3 sentence analysis with specific evidence",
      "secondary_inference": "If not directly assessed: explain what OTHER evidence supports this score"
    }}
  }},
  "key_strengths": ["strength 1", "strength 2", ...],
  "potential_concerns": ["concern 1", "concern 2", ...],
  "development_needs": ["need 1", "need 2", ...],
  "specific_evidence": ["evidence 1 with quote", "evidence 2", ...],
  "assessment_coverage": "Paragraph explaining which traits were directly assessed vs inferred",
  "risk_assessment": "2-3 paragraphs including discussion of assessment gaps",
  "hiring_recommendation": "Clear recommendation with rationale",
  "onboarding_recommendations": ["rec 1", "rec 2", ...],
  "executive_summary": "3-4 paragraphs"
}}

Required traits to analyze: {', '.join(job_requirements.keys())}"""

    print("\nGPT PROMPT FOR JOB MATCHING (WITH ASSESSMENT AWARENESS):")
    print("-"*80)
    print(prompt[:800] + "..." if len(prompt) > 800 else prompt)
    print("-"*80 + "\n")
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert HR analyst. Distinguish clearly between directly assessed traits and inferred traits. Be transparent about assessment gaps. Use specific evidence from the report. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4500
        )
        
        content = response.choices[0].message.content or "{}"
        
        print("GPT RESPONSE FOR JOB MATCHING:")
        print("-"*80)
        print(content[:500] + "..." if len(content) > 500 else content)
        print("-"*80 + "\n")
        
        # Clean up markdown if present
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].split('```')[0].strip()
        
        analysis = json.loads(content)
        
        # Ensure all required traits have scores and proper structure
        if 'trait_scores' not in analysis:
            analysis['trait_scores'] = {}
        
        for trait_name, trait_data in job_requirements.items():
            if trait_name not in analysis['trait_scores']:
                is_assessed = trait_name in assessed_traits
                analysis['trait_scores'][trait_name] = {
                    'score': 3,
                    'required_level': trait_data['level'],
                    'directly_assessed': is_assessed,
                    'analysis': 'Insufficient information to assess this trait.',
                    'secondary_inference': '' if is_assessed else 'This trait was not directly assessed in the candidate report.'
                }
            else:
                # Ensure directly_assessed field exists
                if 'directly_assessed' not in analysis['trait_scores'][trait_name]:
                    analysis['trait_scores'][trait_name]['directly_assessed'] = trait_name in assessed_traits
                
                # Ensure secondary_inference field exists for non-assessed traits
                if not analysis['trait_scores'][trait_name]['directly_assessed'] and 'secondary_inference' not in analysis['trait_scores'][trait_name]:
                    analysis['trait_scores'][trait_name]['secondary_inference'] = 'Inferred from other behavioral indicators.'
        
        # Add assessment coverage if missing
        if 'assessment_coverage' not in analysis:
            analysis['assessment_coverage'] = f"The candidate was directly assessed on {len(directly_assessed)} of the {len(job_requirements)} required traits. Remaining traits were inferred from related behavioral patterns."
        
        return analysis
        
    except Exception as e:
        print(f"GPT Error for job matching: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Fallback response
        fallback_trait_scores = {}
        for trait_name, trait_data in job_requirements.items():
            is_assessed = trait_name in assessed_traits
            fallback_trait_scores[trait_name] = {
                'score': 3,
                'required_level': trait_data['level'],
                'directly_assessed': is_assessed,
                'analysis': 'Analysis could not be completed due to a technical error.',
                'secondary_inference': '' if is_assessed else 'This trait was not directly assessed.'
            }
        
        return {
            'error': 'Partial analysis - GPT error occurred',
            'overall_fit_score': 3,
            'overall_fit_label': 'Unable to fully analyze',
            'trait_scores': fallback_trait_scores,
            'key_strengths': ['Analysis incomplete'],
            'potential_concerns': ['Technical error prevented full analysis'],
            'development_needs': ['Unable to assess'],
            'specific_evidence': ['Error occurred during analysis'],
            'assessment_coverage': f'{len(directly_assessed)} traits were directly assessed, {len(not_assessed)} were not.',
            'risk_assessment': 'Analysis could not be completed due to a technical error.',
            'hiring_recommendation': 'Unable to provide recommendation - please retry analysis',
            'onboarding_recommendations': ['Retry analysis for recommendations'],
            'executive_summary': 'Analysis could not be completed due to a technical error. Please try again.'
        }

#!/usr/bin/env python3
# ADD THIS NEW ROUTE TO YOUR app.py FILE (after the existing /api/download route)

@app.route('/api/download-match-report', methods=['POST'])
def download_match_report():
    """Generate PDF report for candidate-job matching analysis"""
    try:
        data = request.json or {}
        matching_analysis = data.get('matchingAnalysis', {})
        job_requirements = data.get('jobRequirements', {})
        candidate_name = data.get('candidateName', 'Candidate')
        job_title = data.get('jobTitle', 'Position')
        
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
            spaceAfter=10,
            spaceBefore=15
        )
        
        subheading_style = ParagraphStyle(
            'CustomSubheading',
            parent=styles['Heading3'],
            fontSize=13,
            textColor='#3a7f6a',
            spaceAfter=8,
            spaceBefore=10
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            leading=14
        )
        
        # Title Page
        story.append(Paragraph("Candidate-Job Matching Report", title_style))
        story.append(Paragraph(f"Candidate: {candidate_name}", styles['Normal']))
        story.append(Paragraph(f"Position: {job_title}", styles['Normal']))
        story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Spacer(1, 0.5*inch))
        
        # Overall Fit Score
        overall_fit = matching_analysis.get('overall_fit_score', 3)
        fit_label = matching_analysis.get('overall_fit_label', 'Adequate Fit')
        
        story.append(Paragraph("Overall Candidate Fit", heading_style))
        story.append(Paragraph(f"<b>Fit Score:</b> {overall_fit:.1f}/5.0 - {fit_label}", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Hiring Recommendation
        story.append(Paragraph("Hiring Recommendation", heading_style))
        story.append(Paragraph(matching_analysis.get('hiring_recommendation', 'No recommendation available'), body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", heading_style))
        exec_summary = matching_analysis.get('executive_summary', 'No summary available')
        for para in exec_summary.split('\n\n'):
            if para.strip():
                story.append(Paragraph(para.strip(), body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Trait-by-Trait Analysis
        story.append(PageBreak())
        story.append(Paragraph("Trait-by-Trait Fit Analysis", heading_style))
        
        trait_scores = matching_analysis.get('trait_scores', {})
        for trait_name, trait_data in trait_scores.items():
            score = trait_data.get('score', 3)
            required_level = trait_data.get('required_level', 'N/A')
            analysis = trait_data.get('analysis', '')
            
            story.append(Paragraph(f"<b>{trait_name}</b>", subheading_style))
            story.append(Paragraph(f"Score: {score:.1f}/5.0 | Required Level: {required_level.upper()}", body_style))
            story.append(Paragraph(analysis, body_style))
            story.append(Spacer(1, 0.15*inch))
        
        # Key Strengths
        story.append(PageBreak())
        story.append(Paragraph("Key Strengths", heading_style))
        strengths = matching_analysis.get('key_strengths', [])
        for strength in strengths:
            story.append(Paragraph(f"• {strength}", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Potential Concerns
        story.append(Paragraph("Potential Concerns", heading_style))
        concerns = matching_analysis.get('potential_concerns', [])
        for concern in concerns:
            story.append(Paragraph(f"• {concern}", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Specific Evidence
        story.append(Paragraph("Specific Evidence from Report", heading_style))
        evidence = matching_analysis.get('specific_evidence', [])
        for item in evidence:
            story.append(Paragraph(f"• {item}", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Risk Assessment
        story.append(PageBreak())
        story.append(Paragraph("Risk Assessment", heading_style))
        risk = matching_analysis.get('risk_assessment', 'No risk assessment available')
        for para in risk.split('\n\n'):
            if para.strip():
                story.append(Paragraph(para.strip(), body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Development Needs
        story.append(Paragraph("Development Needs", heading_style))
        dev_needs = matching_analysis.get('development_needs', [])
        for need in dev_needs:
            story.append(Paragraph(f"• {need}", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Onboarding Recommendations
        story.append(Paragraph("Onboarding Recommendations", heading_style))
        onboarding = matching_analysis.get('onboarding_recommendations', [])
        for rec in onboarding:
            story.append(Paragraph(f"• {rec}", body_style))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'candidate-job-match-{datetime.now().strftime("%Y-%m-%d")}.pdf'
        )
        
    except Exception as e:
        print(f"Error generating match report PDF: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
