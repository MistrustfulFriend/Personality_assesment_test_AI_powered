/**
 * PERSONALITY ASSESSMENT TRAIT DATA
 * 
 * HOW TO ADD A NEW TRAIT:
 * 
 * 1. Add a new entry to the 'traits' object with a unique key (e.g., "Trait1-Trait2")
 * 2. Create 3 scenario questions and 1 verification question (must start with "V_")
 * 3. Each question needs:
 *    - id: Unique identifier (e.g., "AB1", "AB2", "AB3", "V_AB")
 *    - text: The scenario description
 *    - options: Array with 2 options (value: 0 for low end, value: 2 for high end)
 *    - Each option needs: value, label, and decoding
 * 
 * 4. Add interpretation rules to 'traitInterpretations'
 * 5. Add pattern interpretations to 'patternInterpretations' (all 8 patterns: A-A-A through B-B-B)
 * 
 * EXAMPLE STRUCTURE:
 * "NewTrait-AnotherTrait": [
 *   {id:"NT1", text:"Scenario...", options:[
 *     {value:0, label:"Option A", decoding:"What this reveals..."},
 *     {value:2, label:"Option B", decoding:"What this reveals..."}
 *   ]},
 *   ...3 more scenario questions...
 *   {id:"V_NT", text:"Self-perception question", options:[...]}
 * ]
 */

const traits = {
  "Structure-Flexibility": [
    {
      id: "SF1",
      text: "Two senior stakeholders give contradictory instructions about priority tasks. Deadline cannot move. Both instructions have merit; following one fully will partially violate the other.",
      options: [
        {
          value: 0,
          label: "Choose the instruction set that aligns most with pre-defined standards and documented protocols",
          decoding: "Selecting Structure shows a decision rule that privileges institutional correctness, traceability and defensibility over short-term expediency. Places value on rule-based decision making that can be justified under audit, contractual or governance scrutiny. Treats process as a risk-mitigation mechanism."
        },
        {
          value: 2,
          label: "Reorganize tasks dynamically, balancing both directives to optimize overall outcome",
          decoding: "Selecting Flexibility signals outcome orientation and tolerance for pragmatic rule-bending when needed to meet objectives. Prioritizes the end result, negotiates trade-offs quickly, reallocates resources, and accepts controlled deviations when the expected benefit outweighs procedural risk."
        }
      ]
    },
    {
      id: "SF2",
      text: "You inherit a project mid-way with unclear documentation. Some critical dependencies are undocumented, and a critical client meeting is in 48 hours.",
      options: [
        {
          value: 0,
          label: "Reconstruct a full project plan before taking action, ensuring every step is clearly defined",
          decoding: "This choice indicates a planning-first cognitive style: the person reduces uncertainty through mapping dependencies and clarifying responsibilities. They accept short-term delay to avoid higher costs of rework or reputational damage later."
        },
        {
          value: 2,
          label: "Begin immediate work based on the available information, adjusting dynamically as missing details emerge",
          decoding: "This choice shows an action-first bias: the person triages, produces an initial deliverable, and uses iterative feedback to reduce uncertainty. They value momentum and learning by doing, accepting rework as the cost of fast delivery."
        }
      ]
    },
    {
      id: "SF3",
      text: "A key team member resigns unexpectedly, jeopardizing a crucial milestone. The original workflow assumed full participation.",
      options: [
        {
          value: 0,
          label: "Stick to the original workflow, reallocating tasks only within existing roles",
          decoding: "This choice values role integrity and minimal short-term disruption. The person prefers clear accountability and will ask teammates to absorb workload within defined role boundaries, relying on overtime, reprioritisation or escalation rather than reassigning responsibilities."
        },
        {
          value: 2,
          label: "Restructure the workflow to leverage remaining team strengths, introducing new roles or temporary overlaps as needed",
          decoding: "This choice prioritizes outcome by reorganizing roles, blurring boundaries temporarily, and reallocating responsibilities dynamically. The person prefers resilience through reconfiguration rather than through relying solely on existing role capacity."
        }
      ]
    },
    {
      id: "V_SF",
      text: "Self-perception: Which best describes your natural work approach?",
      options: [
        { value: 0, label: "I prefer clear plans and rules" },
        { value: 2, label: "I adapt dynamically to achieve results" }
      ]
    }
  ],
  
  "Risk-Caution": [
    {
      id: "RC1",
      text: "You can allocate a meaningful portion of budget to a high-reward but uncertain investment (new vendor, startup partnership, experimental product line). The upside is large but probability of failure is significant.",
      options: [
        {
          value: 0,
          label: "Decline or delay the investment until stronger evidence or safeguards are in place (pilot, vendor due diligence, staged funding)",
          decoding: "Choosing Caution shows a preference for downside protection and loss-avoidance. The decision rule is to prioritize preservation of capital and avoid exposure to large negative outcomes. Favors structured validation, formal risk assessments, and staged commitments. Mental model treats the environment as asymmetric: losses hurt more than equivalent gains help."
        },
        {
          value: 2,
          label: "Commit to the investment now to capture upside, using active oversight and contingency monitoring",
          decoding: "Choosing Risk signals tolerance for loss in service of potential high reward. The decision rule accepts uncertainty as the engine of opportunity. Prefers to secure position early and shape the outcome through involvement, believing that value capture often depends on being invested and engaged rather than waiting for perfect certainty."
        }
      ]
    },
    {
      id: "RC2",
      text: "An opportunity arises to volunteer for a high-visibility project with uncertain outcomes (media attention, experimental program). Participation could produce significant learning and reputation gains but also public failure risk.",
      options: [
        {
          value: 0,
          label: "Decline participation or recommend a low-exposure supporting role until the project proves viable",
          decoding: "Selecting Caution here means protecting reputation and minimizing exposure to public failure. The person judges visibility risk as material: reputational losses have long tails. They prefer incremental involvement that controls optics and exposure."
        },
        {
          value: 2,
          label: "Volunteer to lead or visibly participate to capture learning, network effects, and reputational upside",
          decoding: "Choosing Risk indicates a readiness to accept reputational variance for the sake of learning, influence, and being seen as an actor. The person values the upside of being visible and the doors that public leadership can open. They treat potential public failure as an acceptable tradeoff for potential accelerated gains."
        }
      ]
    },
    {
      id: "RC3",
      text: "There is an opportunity to adopt an untested technology or experimental tooling that could improve efficiency but has integration risk and potential service instability.",
      options: [
        {
          value: 0,
          label: "Delay adoption until the technology is validated, or run it in an isolated sandbox environment with no customer-facing exposure",
          decoding: "Choosing Caution shows prioritization of system stability and predictable operations. The person prefers to avoid introducing unknown failure modes into production. Their mental model values reliability and prefers incremental uplift via vetted changes."
        },
        {
          value: 2,
          label: "Pilot the tool in production for selected use cases to accelerate value realization, with live monitoring and fast rollback capability",
          decoding: "Choosing Risk indicates a bias toward early adoption and iterative tuning in real environments. The person prioritizes rapid learning from real workload and believes the speed of adaptation offsets the interim instability risk."
        }
      ]
    },
    {
      id: "V_RC",
      text: "Self-perception: How would you describe your risk preference?",
      options: [
        { value: 0, label: "I prefer caution" },
        { value: 2, label: "I embrace risk" }
      ]
    }
  ],

    "Analytical-Intuitive": [
    {
      id: "AI1",
      text: "You must recommend a course of action based on a dataset that is incomplete, noisy, and has conflicting signals. Leadership requests a single, defensible recommendation within 48 hours.",
      options: [
        {
          value: 0,
          label: "Prioritize structured analysis: document assumptions, run sensitivity checks, and present a data-driven recommendation.",
          decoding: "Chooses analysis-first: privileges evidence, reproducibility, and defensibility. Sees uncertainty as resolvable through methodical inquiry."
        },
        {
          value: 2,
          label: "Prioritize synthesis and judgment: integrate pattern recognition and domain intuition to give a timely recommendation.",
          decoding: "Chooses intuition-first: privileges fast sensemaking and applied experience. Sees incomplete data as sufficient when paired with informed judgment."
        }
      ]
    },
    {
      id: "AI2",
      text: "A novel problem surfaces outside documented precedent. You have a small team and limited time to act.",
      options: [
        {
          value: 0,
          label: "Break the problem into testable hypotheses and assign analytical experiments before scaling any solution.",
          decoding: "Methodical hypothesis-led approach; favors experiments that isolate variables and reduce ambiguity via measurement."
        },
        {
          value: 2,
          label: "Use heuristics and prior patterns to craft a pragmatic prototype and iterate rapidly based on outcomes.",
          decoding: "Pattern-driven approach; favors early prototypes and iterative refinement guided by judgment rather than full upfront analysis."
        }
      ]
    },
    {
      id: "AI3",
      text: "A trusted colleague proposes a counterintuitive solution that lacks formal analysis but resonates with past tacit knowledge.",
      options: [
        {
          value: 0,
          label: "Request analytic validation before endorsement; document metrics required to accept the idea.",
          decoding: "Seeks measurable support; prioritizes replicable evidence before commit or advocacy."
        },
        {
          value: 2,
          label: "Back the idea provisionally and allocate small resources to test it quickly in the field.",
          decoding: "Acts on tacit trust and practical validation; prefers learning-in-context and accepts short-term risk for discovery."
        }
      ]
    },
    {
      id: "V_AI",
      text: "Self-perception: Which statement best fits your decision style?",
      options: [
        { value: 0, label: "I rely on structured evidence and analysis" },
        { value: 2, label: "I rely on judgement and pattern intuition" }
      ]
    }
  ],

  "Strategic-Tactical": [
    {
      id: "ST1",
      text: "You inherit a unit with steady short-term delivery but unclear long-term direction. You must allocate scarce budget for the next fiscal year.",
      options: [
        {
          value: 0,
          label: "Prioritize long-term investments and capability building even if near-term output slows.",
          decoding: "Prefers strategic horizon: invests in leverage, capability, and optionality over immediate throughput."
        },
        {
          value: 2,
          label: "Prioritize tactical delivery to maintain current performance and stakeholder confidence.",
          decoding: "Prefers tactical horizon: secures short-term outcomes, operational reliability, and existing stakeholder expectations."
        }
      ]
    },
    {
      id: "ST2",
      text: "A disruptive competitor requires an organizational response. You can either redesign the product roadmap or accelerate delivery of current priorities.",
      options: [
        {
          value: 0,
          label: "Redesign roadmap to reposition for new market dynamics, reallocating resources toward new strategic bets.",
          decoding: "Chooses repositioning: accepts short-term churn for long-term competitiveness and directional clarity."
        },
        {
          value: 2,
          label: "Double down on tactical execution to defend current strengths and buy time to assess the competitor's trajectory.",
          decoding: "Chooses defense: preserves operational momentum and defends current value proposition while observing competitor outcomes."
        }
      ]
    },
    {
      id: "ST3",
      text: "You must decide whether to set an ambitious, multi-year objective that changes how the organization measures success, or optimize current KPIs to drive immediate growth.",
      options: [
        {
          value: 0,
          label: "Set a bold multi-year objective and shift metrics to align the organization with that direction.",
          decoding: "Strategy-first: reorients incentives and measurement toward long-run transformation; values alignment and directional coherence."
        },
        {
          value: 2,
          label: "Optimize current KPIs to maximize immediate performance and stakeholder returns.",
          decoding: "Tactics-first: focuses on measurable, short-cycle improvements with immediate stakeholder impact."
        }
      ]
    },
    {
      id: "V_ST",
      text: "Self-perception: Which describes your operational preference?",
      options: [
        { value: 0, label: "I prioritize long-term strategy and direction" },
        { value: 2, label: "I prioritize immediate, measurable execution" }
      ]
    }
  ],

  "Conceptual-Concrete": [
    {
      id: "CC1",
      text: "You're drafting an initiative to change how the organization thinks about customer value. You can define a high-level principle or a step-by-step program.",
      options: [
        {
          value: 0,
          label: "Define a high-level conceptual framework that reorients thinking and sets a north star.",
          decoding: "Conceptual orientation: values abstraction, model-building, and systemic reframing over immediate operational steps."
        },
        {
          value: 2,
          label: "Design a step-by-step program with clear tasks, roles, and KPIs for immediate rollout.",
          decoding: "Concrete orientation: values executable plans, clarity of tasks, and pragmatic mobilization over abstraction."
        }
      ]
    },
    {
      id: "CC2",
      text: "A complex cross-functional issue needs resolution. You can propose a novel organizing principle or a binding checklist to coordinate teams.",
      options: [
        {
          value: 0,
          label: "Propose a new organizing principle that changes how teams perceive the problem.",
          decoding: "Builds new mental models and reframes context to create leverage across teams."
        },
        {
          value: 2,
          label: "Create a binding operational checklist assigning clear responsibilities and timelines.",
          decoding: "Creates operational clarity and reduces ambiguity with concrete steps and ownership."
        }
      ]
    },
    {
      id: "CC3",
      text: "When mentoring a junior leader, you must choose between teaching them a unifying principle or giving them a template for execution.",
      options: [
        {
          value: 0,
          label: "Teach the principle and encourage them to reason to solutions in varied contexts.",
          decoding: "Prioritizes transferable conceptual tools and mental models that scale across contexts."
        },
        {
          value: 2,
          label: "Provide a practical template they can apply immediately to ensure consistent outcomes.",
          decoding: "Prioritizes immediate competence and replicable practice through concrete artifacts."
        }
      ]
    },
    {
      id: "V_CC",
      text: "Self-perception: Which best reflects how you approach problems?",
      options: [
        { value: 0, label: "I prefer conceptual frameworks and models" },
        { value: 2, label: "I prefer concrete steps and clear procedures" }
      ]
    }
  ],

    "Process-Outcome": [
    {
      id: "PO1",
      text: "You must design an operational protocol for a new service. Stakeholders ask for both clear controls and fast time-to-market.",
      options: [
        {
          value: 0,
          label: "Design rigorous process controls, audits, and checkpoints before launch.",
          decoding: "Prioritizes process fidelity and compliance; values repeatability and risk-reduction through well-defined steps."
        },
        {
          value: 2,
          label: "Design a minimal viable process that enables fast launch and iterates controls post-launch.",
          decoding: "Prioritizes outcome delivery and time-to-value; accepts initial process looseness to capture early feedback."
        }
      ]
    },
    {
      id: "PO2",
      text: "A unit is behind on KPIs. You can either standardize workflow across teams or push a focused initiative to hit the target quickly.",
      options: [
        {
          value: 0,
          label: "Standardize workflows and train teams to reduce variance before pushing KPIs.",
          decoding: "Process-first: believes systemic fixes create sustainable improvements over tactical fixes."
        },
        {
          value: 2,
          label: "Run a short, high-impact initiative targeting the KPI to regain momentum.",
          decoding: "Outcome-first: delivers focused actions to restore performance and morale quickly."
        }
      ]
    },
    {
      id: "PO3",
      text: "When quality issues arise, you can tighten procedures across the board or apply corrective actions to the failing components only.",
      options: [
        {
          value: 0,
          label: "Tighten procedures globally to prevent recurrence and ensure consistent quality.",
          decoding: "Systemic approach to quality; prefers structural prevention over localized fixes."
        },
        {
          value: 2,
          label: "Fix the offending components and monitor; escalate systemic changes only if problems repeat.",
          decoding: "Targeted remediation with pragmatic monitoring; favors resource-efficient fixes tied to outcomes."
        }
      ]
    },
    {
      id: "V_PO",
      text: "Self-perception: Which best reflects your operational preference?",
      options: [
        { value: 0, label: "I prefer robust processes and controls" },
        { value: 2, label: "I prefer direct action to deliver outcomes" }
      ]
    }
  ],

  "Proactive-Reactive": [
    {
      id: "PR1",
      text: "You notice an emerging trend that may impact your product in 6–12 months. Resources are limited today.",
      options: [
        {
          value: 0,
          label: "Start exploratory work now to build capability before the trend matures.",
          decoding: "Proactive: invests early in optionality and preparedness, even at near-term opportunity cost."
        },
        {
          value: 2,
          label: "Monitor the trend and mobilize only if clear signals emerge.",
          decoding: "Reactive: prefers resource efficiency and acts on observable confirmation rather than anticipation."
        }
      ]
    },
    {
      id: "PR2",
      text: "A potential compliance change may affect operations next year. Leadership asks whether to prepare immediate changes.",
      options: [
        {
          value: 0,
          label: "Begin adaptation planning and pilot necessary changes now to avoid late scramble.",
          decoding: "Proactive adaptation reduces future disruption; accepts early effort to secure future advantage."
        },
        {
          value: 2,
          label: "Wait for final regulation text before committing resources to change.",
          decoding: "Reactive compliance approach to avoid premature investments and wasted effort."
        }
      ]
    },
    {
      id: "PR3",
      text: "You can either run scheduled maintenance during low-traffic windows or adopt on-demand fixes when failures appear.",
      options: [
        {
          value: 0,
          label: "Schedule proactive maintenance to minimize incident probability.",
          decoding: "Proactive reliability: values prevention and planned upkeep."
        },
        {
          value: 2,
          label: "Fix issues when they occur to reduce maintenance overhead while tolerating rare outages.",
          decoding: "Reactive efficiency: accepts occasional disruption to optimize current resource use."
        }
      ]
    },
    {
      id: "V_PR",
      text: "Self-perception: How do you usually operate?",
      options: [
        { value: 0, label: "I plan ahead and act early" },
        { value: 2, label: "I respond when evidence requires action" }
      ]
    }
  ],

  "Detail-BigPicture": [
    {
      id: "DB1",
      text: "You must prepare a proposal for executive review. Do you prepare fine-grained implementation steps or a high-level strategic rationale?",
      options: [
        {
          value: 0,
          label: "Provide detailed implementation steps, timelines, and resource breakdowns.",
          decoding: "Detail orientation: values operational clarity and eliminates ambiguity for deliverers."
        },
        {
          value: 2,
          label: "Provide a strategic rationale and expected impact to get alignment on direction.",
          decoding: "Big-picture orientation: focuses stakeholders on outcomes and intent rather than execution minutiae."
        }
      ]
    },
    {
      id: "DB2",
      text: "When diagnosing poor performance in a team, do you audit specific processes or re-examine the overarching goals and incentives?",
      options: [
        {
          value: 0,
          label: "Audit processes and identify tactical fixes to improve execution.",
          decoding: "Seeks root-cause at the operational level; prefers actionable fixes."
        },
        {
          value: 2,
          label: "Re-examine goals and incentive structures to ensure alignment at higher level.",
          decoding: "Seeks systemic misalignment; favors shifting direction to resolve repeated issues."
        }
      ]
    },
    {
      id: "DB3",
      text: "A program needs redesign. Do you refine existing components or rethink the program architecture?",
      options: [
        {
          value: 0,
          label: "Refine components to improve performance without changing the overall architecture.",
          decoding: "Optimizes existing mechanisms; favors incremental improvement and stability."
        },
        {
          value: 2,
          label: "Rethink architecture to address root structural issues and future scalability.",
          decoding: "Designs for scale and systemic change; favors structural redesign when warranted."
        }
      ]
    },
    {
      id: "V_DB",
      text: "Self-perception: Which captures your focus?",
      options: [
        { value: 0, label: "I focus on details and execution" },
        { value: 2, label: "I focus on high-level direction and systems" }
      ]
    }
  ],

  "Individual-Collaborative": [
    {
      id: "IC1",
      text: "A project requires rapid decisions. You can make calls independently or convene a quick team sync to decide collectively.",
      options: [
        {
          value: 0,
          label: "Decide independently and push execution forward.",
          decoding: "Individualistic: values autonomy, speed, and clear personal accountability."
        },
        {
          value: 2,
          label: "Convene the team quickly and decide together to share ownership.",
          decoding: "Collaborative: values shared understanding and co-ownership of decisions."
        }
      ]
    },
    {
      id: "IC2",
      text: "A colleague's work overlaps with yours. Do you reassign tasks to keep distinct ownership or collaboratively renegotiate responsibilities?",
      options: [
        {
          value: 0,
          label: "Keep clear ownership boundaries and reassign tasks to respect roles.",
          decoding: "Prefers clear individual accountability and minimized dependency overhead."
        },
        {
          value: 2,
          label: "Negotiate shared responsibilities to optimize team throughput.",
          decoding: "Prefers joint responsibility and leverages collaborative capacity to achieve goals."
        }
      ]
    },
    {
      id: "IC3",
      text: "During planning, would you rather own and deliver a complete module alone or lead a cross-functional working group?",
      options: [
        {
          value: 0,
          label: "Own and deliver the module independently to ensure clarity of outcome.",
          decoding: "Individual delivery preference: values personal control and clear success ownership."
        },
        {
          value: 2,
          label: "Lead the cross-functional group to coordinate and integrate multiple perspectives.",
          decoding: "Collaborative leadership preference: values integration and shared success."
        }
      ]
    },
    {
      id: "V_IC",
      text: "Self-perception: Which best describes you?",
      options: [
        { value: 0, label: "I prefer individual ownership and autonomy" },
        { value: 2, label: "I prefer shared ownership and teamwork" }
      ]
    }
  ],

  "Assertive-Accommodating": [
    {
      id: "AA1",
      text: "In a stakeholder meeting, you must push for a resource you need but others resist. Do you press strongly for your view or seek consensus?",
      options: [
        {
          value: 0,
          label: "Press strongly for the necessary resources and make a firm case.",
          decoding: "Assertive: prioritizes conviction and clarity of position; willing to create tension to secure outcomes."
        },
        {
          value: 2,
          label: "Seek to build consensus and adapt your ask to address stakeholder concerns.",
          decoding: "Accommodating: prioritizes relationships and compromise to preserve cohesion."
        }
      ]
    },
    {
      id: "AA2",
      text: "A peer under-delivers on a joint commitment. Do you confront the issue directly to fix it or adjust expectations to maintain rapport?",
      options: [
        {
          value: 0,
          label: "Confront directly and set corrective expectations for future work.",
          decoding: "Assertive conflict management: seeks accountability through direct feedback."
        },
        {
          value: 2,
          label: "Adjust expectations and support the peer to avoid friction.",
          decoding: "Accommodating conflict management: prioritizes relational harmony and coaching over confrontation."
        }
      ]
    },
    {
      id: "AA3",
      text: "You must negotiate scope with a demanding client. Do you hold firm on realistic commitments or yield to their requests to preserve the relationship?",
      options: [
        {
          value: 0,
          label: "Hold firm on commitments to protect delivery quality and team capacity.",
          decoding: "Assertive negotiation preserves sustainable delivery and sets clear boundaries."
        },
        {
          value: 2,
          label: "Yield on some requests to maintain client trust and adapt delivery subsequently.",
          decoding: "Accommodating negotiation values client relationship and immediate goodwill."
        }
      ]
    },
    {
      id: "V_AA",
      text: "Self-perception: Which captures your interpersonal stance?",
      options: [
        { value: 0, label: "I am direct and defend necessary boundaries" },
        { value: 2, label: "I adapt to preserve relationships and find compromise" }
      ]
    }
  ],

    "Competitive-Cooperative": [
    {
      id: "CC1",
      text: "Two peer teams are assigned to deliver parallel proposals. You discover both use overlapping data sources and similar insights.",
      options: [
        {
          value: 0,
          label: "Refine your proposal to outperform theirs and secure leadership recognition",
          decoding: "Choosing Competitive signals drive for distinction, achievement through outperforming peers, and reliance on comparative success metrics."
        },
        {
          value: 2,
          label: "Coordinate with the other team to align insights and strengthen the joint result",
          decoding: "Choosing Cooperative signals preference for collective success, synergy, and shared achievement over individual spotlight."
        }
      ]
    },
    {
      id: "CC2",
      text: "A shared bonus pool depends on total team performance. Your own segment is already exceeding expectations.",
      options: [
        {
          value: 0,
          label: "Focus on maintaining your own high performance even if others underperform",
          decoding: "Competitive choice reflects self-responsibility and belief that individual excellence should drive reward fairness."
        },
        {
          value: 2,
          label: "Offer to mentor underperforming colleagues to lift total results",
          decoding: "Cooperative mindset emphasizes collective outcome and shared accountability, valuing team strength over individual gain."
        }
      ]
    },
    {
      id: "CC3",
      text: "An external award recognizes a single project lead. The project succeeded through team-wide effort.",
      options: [
        {
          value: 0,
          label: "Accept the nomination individually to highlight leadership contribution",
          decoding: "Competitive orientation views leadership recognition as deserved signal of performance and credibility."
        },
        {
          value: 2,
          label: "Request the award be attributed to the entire team",
          decoding: "Cooperative view attributes success to collective effort, preferring shared recognition to personal elevation."
        }
      ]
    },
    {
      id: "V_CC",
      text: "Self-perception: How do you prefer to achieve success?",
      options: [
        { value: 0, label: "By outperforming peers" },
        { value: 2, label: "By achieving together" }
      ]
    }
  ],

  // 12. Empathetic-Objective
  "Empathetic-Objective": [
    {
      id: "EO1",
      text: "A team member’s performance is declining due to personal difficulties unrelated to work output targets.",
      options: [
        {
          value: 0,
          label: "Provide supportive flexibility and emotional space before performance interventions",
          decoding: "Empathetic response prioritizes compassion and morale preservation over strict output control."
        },
        {
          value: 2,
          label: "Address performance metrics directly and uphold standards while offering optional support",
          decoding: "Objective stance separates personal context from performance requirements, focusing on fairness and delivery."
        }
      ]
    },
    {
      id: "EO2",
      text: "A conflict arises between two colleagues—one is visibly distressed, the other argues rationally.",
      options: [
        {
          value: 0,
          label: "Mediate by acknowledging emotional impact first to restore trust",
          decoding: "Empathetic style seeks relational repair through emotional validation and understanding of perspectives."
        },
        {
          value: 2,
          label: "Focus on clarifying the facts and decisions without engaging emotional narratives",
          decoding: "Objective approach de-escalates through logic and neutrality, reinforcing procedural fairness."
        }
      ]
    },
    {
      id: "EO3",
      text: "You must give critical feedback to a long-term colleague you personally like.",
      options: [
        {
          value: 0,
          label: "Soften the message to preserve relationship quality",
          decoding: "Empathetic choice indicates prioritization of emotional continuity and trust over blunt clarity."
        },
        {
          value: 2,
          label: "Deliver feedback directly and factually regardless of personal feelings",
          decoding: "Objective choice emphasizes transparency and standards over interpersonal comfort."
        }
      ]
    },
    {
      id: "V_EO",
      text: "Self-perception: What drives your interpersonal approach?",
      options: [
        { value: 0, label: "Empathy and understanding" },
        { value: 2, label: "Fairness and logic" }
      ]
    }
  ],

  // 13. Innovative-Traditional
  "Innovative-Traditional": [
    {
      id: "IT1",
      text: "Your company is launching a new process that challenges long-established methods.",
      options: [
        {
          value: 0,
          label: "Experiment with the new approach, even if it disrupts current practices",
          decoding: "Innovative choice values novelty, creative exploration, and potential breakthroughs over legacy systems."
        },
        {
          value: 2,
          label: "Adopt the process only after it’s proven effective and integrated smoothly",
          decoding: "Traditional preference prioritizes continuity, tested reliability, and respect for established efficiency."
        }
      ]
    },
    {
      id: "IT2",
      text: "You notice an inefficient but accepted workflow in your department.",
      options: [
        {
          value: 0,
          label: "Propose a radical redesign to eliminate redundancy",
          decoding: "Innovative response indicates desire to improve systems through bold rethinking and risk acceptance."
        },
        {
          value: 2,
          label: "Gradually refine the workflow to maintain team familiarity and stability",
          decoding: "Traditional approach safeguards cultural comfort and minimizes transition costs."
        }
      ]
    },
    {
      id: "IT3",
      text: "A client asks for unconventional solutions outside standard offerings.",
      options: [
        {
          value: 0,
          label: "Design a unique approach specifically for their case",
          decoding: "Innovative orientation treats customization as opportunity for creative expansion."
        },
        {
          value: 2,
          label: "Adapt existing solutions to fit within current frameworks",
          decoding: "Traditional response optimizes efficiency through existing assets and proven reliability."
        }
      ]
    },
    {
      id: "V_IT",
      text: "Self-perception: What describes your work mindset?",
      options: [
        { value: 0, label: "I seek new ways" },
        { value: 2, label: "I trust proven ways" }
      ]
    }
  ],

  // 14. Achievement-driven-Stability-driven
  "AchievementStability": [
    {
      id: "AS1",
      text: "You are offered a promotion that doubles responsibility and risk but promises accelerated advancement.",
      options: [
        {
          value: 0,
          label: "Accept immediately to stretch capabilities and grow rapidly",
          decoding: "Achievement-driven choice signals ambition, hunger for challenge, and tolerance for intensity."
        },
        {
          value: 2,
          label: "Decline to maintain current balance and steady performance quality",
          decoding: "Stability-driven choice values sustainability, predictability, and equilibrium over fast growth."
        }
      ]
    },
    {
      id: "AS2",
      text: "Your department is stable but routine; opportunities for innovation are limited.",
      options: [
        {
          value: 0,
          label: "Initiate a bold project even if it introduces workload and stress",
          decoding: "Achievement-focused response seeks stimulation through expansion and self-testing."
        },
        {
          value: 2,
          label: "Maintain current workflow efficiency and avoid unnecessary volatility",
          decoding: "Stability orientation favors continuity and manageable workload as productivity enablers."
        }
      ]
    },
    {
      id: "AS3",
      text: "A long-term client asks for additional services outside scope but with long-term potential.",
      options: [
        {
          value: 0,
          label: "Take on the challenge to build long-term value and visibility",
          decoding: "Achievement-driven mindset equates growth with opportunity to build reputation."
        },
        {
          value: 2,
          label: "Respect scope to protect delivery consistency and quality",
          decoding: "Stability-driven stance defends predictability, minimizing scope creep and burnout."
        }
      ]
    },
    {
      id: "V_AS",
      text: "Self-perception: What motivates your work decisions?",
      options: [
        { value: 0, label: "Growth and progress" },
        { value: 2, label: "Balance and security" }
      ]
    }
  ],

  // 15. Change-tolerant-Change-resistant
  "ChangeTolerance": [
    {
      id: "CT1",
      text: "A major reorganization alters reporting lines and priorities mid-project.",
      options: [
        {
          value: 0,
          label: "Adapt quickly to the new structure and refocus objectives accordingly",
          decoding: "Change-tolerant approach views disruption as opportunity for realignment and renewed momentum."
        },
        {
          value: 2,
          label: "Seek to maintain prior structure and stability until changes are fully clarified",
          decoding: "Change-resistant approach prioritizes continuity, clarity, and reduced confusion during transition."
        }
      ]
    },
    {
      id: "CT2",
      text: "Your workflow tools are replaced by an untested digital platform.",
      options: [
        {
          value: 0,
          label: "Dive into the new tool immediately to explore its potential",
          decoding: "Change-tolerant attitude embraces experimentation and self-learning under uncertainty."
        },
        {
          value: 2,
          label: "Delay transition until all functionality is confirmed and training completed",
          decoding: "Change-resistant preference minimizes friction and loss through controlled rollout."
        }
      ]
    },
    {
      id: "CT3",
      text: "Market shifts require the team to pivot its core offering within a month.",
      options: [
        {
          value: 0,
          label: "Reimagine strategy quickly, even if execution details are unclear",
          decoding: "Change-tolerant personality thrives in volatility, deriving energy from reinvention."
        },
        {
          value: 2,
          label: "Preserve as much of the current offering as possible to ease the transition",
          decoding: "Change-resistant mindset reduces cognitive load and operational chaos by limiting overhaul scope."
        }
      ]
    },
    {
      id: "V_CT",
      text: "Self-perception: How do you respond to change?",
      options: [
        { value: 0, label: "I adapt fast and embrace it" },
        { value: 2, label: "I prefer predictability" }
      ]
    }
  ],
  
  "Ethical-Pragmatic": [
    {
      id: "EP1",
      text: "You discover a minor contractual ambiguity that, if interpreted one way, would materially benefit your unit but create downstream unfairness for a partner.",
      options: [
        {
          value: 0,
          label: "Seek a resolution that preserves fairness, even if it reduces near-term advantage",
          decoding: "Ethical choice prioritizes principle and reputational integrity over opportunistic gain."
        },
        {
          value: 2,
          label: "Exploit the ambiguity now and manage partner relations pragmatically afterward",
          decoding: "Pragmatic choice prioritizes outcomes and optionality, accepting reputational trade-offs as manageable."
        }
      ]
    },
    {
      id: "EP2",
      text: "Leadership requests a report that could be framed in two ways: one that is fully transparent but risks stakeholder alarm, another that emphasizes positives with limited critique.",
      options: [
        {
          value: 0,
          label: "Report transparently, including uncomfortable facts and clear risks",
          decoding: "Ethical stance favors candor and stakeholder trust even if it causes short-term friction."
        },
        {
          value: 2,
          label: "Frame the report to maintain stakeholder confidence while addressing key issues privately",
          decoding: "Pragmatic stance values managed communication and staged escalation to protect operational stability."
        }
      ]
    },
    {
      id: "EP3",
      text: "A vendor offers an informal benefit that slightly exceeds policy but would speed delivery.",
      options: [
        {
          value: 0,
          label: "Decline and follow procurement policy, even if timelines extend",
          decoding: "Ethical choice prioritizes rule compliance and equitable procurement practices."
        },
        {
          value: 2,
          label: "Accept the benefit and document it afterward to keep momentum",
          decoding: "Pragmatic choice prioritizes delivery and treats process exceptions as acceptable tactical compromises."
        }
      ]
    },
    {
      id: "V_EP",
      text: "Self-perception: Which captures your guiding principle?",
      options: [
        { value: 0, label: "I prioritize principle, transparency and fairness" },
        { value: 2, label: "I prioritize practical outcomes and timely delivery" }
      ]
    }
  ],

  "Independent-Guided": [
    {
      id: "IG1",
      text: "A critical decision requires rapid action; you can decide autonomously or wait to consult a supervisor with structured guidance.",
      options: [
        {
          value: 0,
          label: "Decide and act autonomously to maintain speed and ownership",
          decoding: "Independent choice favors agency, ownership, and situational judgment without supervisory input."
        },
        {
          value: 2,
          label: "Consult supervisor for alignment and approval before acting",
          decoding: "Guided choice values alignment, oversight, and clarity of mandate before execution."
        }
      ]
    },
    {
      id: "IG2",
      text: "You are offered a role with ambiguous reporting lines but high autonomy.",
      options: [
        {
          value: 0,
          label: "Accept to leverage autonomy and set your own direction",
          decoding: "Independent orientation thrives under freedom and self-direction."
        },
        {
          value: 2,
          label: "Prefer clear reporting and guidance to ensure alignment",
          decoding: "Guided orientation prefers structured support, clarity, and managerial scaffolding."
        }
      ]
    },
    {
      id: "IG3",
      text: "A project involves unfamiliar decisions; do you establish your own approach or follow a provided template closely?",
      options: [
        {
          value: 0,
          label: "Develop your own approach using judgement and local context",
          decoding: "Independent preference uses situational intelligence to craft bespoke solutions."
        },
        {
          value: 2,
          label: "Follow the provided template to ensure consistency and oversight",
          decoding: "Guided preference values conformity to tested templates and centralized standards."
        }
      ]
    },
    {
      id: "V_IG",
      text: "Self-perception: How do you prefer to operate?",
      options: [
        { value: 0, label: "I work best with autonomy and ownership" },
        { value: 2, label: "I work best with guidance and clear structure" }
      ]
    }
  ],

  "Curious-Proficient": [
    {
      id: "CP1",
      text: "You encounter a new domain that overlaps your work. Do you invest time exploring unfamiliar approaches or apply your known best-practice toolkit?",
      options: [
        {
          value: 0,
          label: "Explore and learn new methods to expand capability",
          decoding: "Curious choice values exploration, learning, and experimenting with unknowns."
        },
        {
          value: 2,
          label: "Apply proven practices to deliver reliably and efficiently",
          decoding: "Proficient choice values mastery, efficiency, and applying known high-quality solutions."
        }
      ]
    },
    {
      id: "CP2",
      text: "A novel idea is proposed by a junior colleague. Do you allocate time to investigate its potential or refine your established approach?",
      options: [
        {
          value: 0,
          label: "Investigate the idea and provide mentorship to test it",
          decoding: "Curiosity-driven mentoring prioritizes discovery and capability growth."
        },
        {
          value: 2,
          label: "Refine the existing approach to reduce risk and maintain standards",
          decoding: "Proficiency-driven response emphasizes stability and predictable quality."
        }
      ]
    },
    {
      id: "CP3",
      text: "Your role requires both deep skill and occasional domain exploration. Which do you emphasize?",
      options: [
        {
          value: 0,
          label: "Allocate time for exploration to broaden long-term impact",
          decoding: "Curiosity emphasis builds long-term adaptability through diverse exposure."
        },
        {
          value: 2,
          label: "Deepen specialization to raise immediate reliability and craft",
          decoding: "Proficiency emphasis optimizes current performance through focused skill development."
        }
      ]
    },
    {
      id: "V_CP",
      text: "Self-perception: Which describes your growth approach?",
      options: [
        { value: 0, label: "I prioritize exploration and learning" },
        { value: 2, label: "I prioritize deep expertise and consistent quality" }
      ]
    }
  ],

  "Composed-Expressive": [
    {
      id: "CE1",
      text: "Under sudden public scrutiny for an operational error, you must address stakeholders immediately.",
      options: [
        {
          value: 0,
          label: "Speak calmly, stick to facts, and show controlled leadership",
          decoding: "Composed choice prioritizes steady leadership, measured tone, and emotional regulation."
        },
        {
          value: 2,
          label: "Acknowledge feelings passionately and use expressive storytelling to connect",
          decoding: "Expressive choice prioritizes emotional engagement and dynamic communication to mobilize trust."
        }
      ]
    },
    {
      id: "CE2",
      text: "During team retros, do you air frustrations openly to clear the air or maintain a restrained tone to keep focus on solutions?",
      options: [
        {
          value: 0,
          label: "Maintain restraint, focus on structured problem-solving",
          decoding: "Composed preference favors procedural resolution and guarded emotional exposure."
        },
        {
          value: 2,
          label: "Be candid and expressive to surface real issues and drive catharsis",
          decoding: "Expressive preference uses emotional clarity to accelerate relational repair and insight."
        }
      ]
    },
    {
      id: "CE3",
      text: "When inspiring a team for a difficult stretch, do you use controlled messaging or a vivid, energetic appeal?",
      options: [
        {
          value: 0,
          label: "Deliver a clear, steady message focused on plan and expectations",
          decoding: "Composed leadership uses calm clarity to align and steady effort."
        },
        {
          value: 2,
          label: "Use vivid storytelling and passionate appeal to energize the team",
          decoding: "Expressive leadership uses emotion and narrative to generate momentum."
        }
      ]
    },
    {
      id: "V_CE",
      text: "Self-perception: Which best describes your emotional style?",
      options: [
        { value: 0, label: "I stay calm, measured and steady" },
        { value: 2, label: "I show energy, passion and expressive clarity" }
      ]
    }
  ],

  "ShortTerm-LongTermFocused": [
    {
      id: "SL1",
      text: "You control budget allocation and must choose between programs that give immediate ROI vs. foundational capabilities that mature over years.",
      options: [
        {
          value: 0,
          label: "Allocate to long-term capabilities that build sustainable advantage",
          decoding: "Long-term focus invests in capability and optionality; values strategic durability over immediate returns."
        },
        {
          value: 2,
          label: "Allocate to near-term ROI programs that satisfy current performance targets",
          decoding: "Short-term focus prioritizes immediate impact and stakeholder satisfaction for current cycles."
        }
      ]
    },
    {
      id: "SL2",
      text: "A feature can be shipped quickly with limited polish or delayed for a refined, scalable design.",
      options: [
        {
          value: 0,
          label: "Delay and refine for a scalable, enduring design",
          decoding: "Long-term orientation favors robust foundations and future-proofing."
        },
        {
          value: 2,
          label: "Ship quickly to learn from market feedback and iterate",
          decoding: "Short-term orientation uses speed as discovery and prioritizes immediate market signals."
        }
      ]
    },
    {
      id: "SL3",
      text: "Your performance review rewards short-term metrics this cycle; you can either optimize for them now or prioritize initiatives that will pay off later.",
      options: [
        {
          value: 0,
          label: "Prioritize initiatives that compound value over time, accepting current review trade-offs",
          decoding: "Long-term mindset accepts short-term cost for future payoff and legacy building."
        },
        {
          value: 2,
          label: "Optimize current metrics to secure performance recognition and resources",
          decoding: "Short-term mindset secures present credibility and resources through immediate gains."
        }
      ]
    },
    {
      id: "V_SL",
      text: "Self-perception: Which best captures your planning horizon?",
      options: [
        { value: 0, label: "I plan for durable, long-term impact" },
        { value: 2, label: "I optimize for immediate results and responsiveness" }
      ]
    }
  ]
  // TO ADD A NEW TRAIT: Copy the structure above and modify
  // Don't forget to add interpretations below!
};

const traitInterpretations = {
  "Structure-Flexibility": {
    name: "Structure vs. Flexibility",
    lowEnd: "Structure-Oriented",
    highEnd: "Flexibility-Oriented",
    lowDescription: "prefers clear plans, established protocols, and systematic approaches. Manifests as preference for well-defined processes, adherence to standards, and methodical problem-solving.",
    highDescription: "adapts dynamically to changing circumstances, balances multiple priorities, and adjusts strategies as situations evolve. Manifests as comfort with ambiguity, quick pivoting, and creative problem-solving.",
    mixedDescription: "demonstrates situational adaptability, choosing between structure and flexibility based on context. Suggests pragmatic approach recognizing when to follow procedures and when to adapt."
  },
  "Risk-Caution": {
    name: "Risk Tolerance vs. Caution",
    lowEnd: "Cautious",
    highEnd: "Risk-Taking",
    lowDescription: "prioritizes safety, stability, and proven approaches. Manifests as careful evaluation, preference for tested solutions, and risk mitigation strategies.",
    highDescription: "embraces calculated risks for potential rewards, volunteers for challenging opportunities, and experiments with new approaches. Manifests as innovation-seeking, willingness to try untested solutions, and comfort with uncertainty.",
    mixedDescription: "evaluates risks situationally, taking calculated risks when potential benefit justifies it while maintaining caution in high-stakes scenarios. Suggests balanced risk assessment skills."
  },

    "Analytical-Intuitive": {
    name: "Analytical vs. Intuitive",
    lowEnd: "Analytical",
    highEnd: "Intuitive",
    lowDescription: "Relies on structured evidence, explicit assumptions, and methodical validation. Excels where measurement, defensibility and reproducibility matter.",
    highDescription: "Relies on pattern recognition, experience, and rapid synthesis. Excels in ambiguous, novel contexts where timely judgment matters.",
    mixedDescription: "Integrates both—uses analysis for defensibility and intuition for speed when data is incomplete."
  },

  "Strategic-Tactical": {
    name: "Strategic vs. Tactical",
    lowEnd: "Strategic",
    highEnd: "Tactical",
    lowDescription: "Prioritizes long-term positioning, capability building, and alignment to a future north star. Makes trade-offs that favor sustained advantage.",
    highDescription: "Prioritizes immediate delivery, KPI performance, and operational reliability. Drives measurable outcomes over long-horizon bets.",
    mixedDescription: "Balances horizon trade-offs—secures short-term performance while protecting strategic optionality."
  },

  "Conceptual-Concrete": {
    name: "Conceptual vs. Concrete",
    lowEnd: "Conceptual",
    highEnd: "Concrete",
    lowDescription: "Builds models, frameworks, and mental maps that generalize across contexts. Favors abstraction and reframing.",
    highDescription: "Delivers replicable processes, templates, and clear execution plans. Favors pragmatic artifacts that teams can apply immediately.",
    mixedDescription: "Applies concepts into tangible plans, translating ideas into executable steps while preserving systemic perspective."
  },
  
    "Process-Outcome": {
    name: "Process Orientation vs Outcome Orientation",
    lowEnd: "Process-Oriented",
    highEnd: "Outcome-Oriented",
    lowDescription: "Values standardized processes, controls and repeatability. Excels where reliability, compliance and scale matter.",
    highDescription: "Values direct delivery, time-to-value and pragmatic iteration. Excels in rapid-learning environments that prize results.",
    mixedDescription: "Balances process discipline with pragmatic outcome focus depending on context and risk profile."
  },

  "Proactive-Reactive": {
    name: "Proactive vs Reactive",
    lowEnd: "Proactive",
    highEnd: "Reactive",
    lowDescription: "Anticipates change and builds optionality; invests early to avoid future disruption.",
    highDescription: "Waits for signals to act; optimizes resource allocation and reduces wasted effort on low-probability events.",
    mixedDescription: "Monitors signals while maintaining light preparatory actions to balance readiness with efficiency."
  },

  "Detail-BigPicture": {
    name: "Detail Focus vs Big-picture",
    lowEnd: "Detail-focused",
    highEnd: "Big-picture",
    lowDescription: "Excels at execution fidelity, defect reduction and operational clarity.",
    highDescription: "Excels at systems thinking, reframing problems, and setting strategic direction.",
    mixedDescription: "Translates strategy into operational detail and lifts details to inform systemic changes."
  },

  "Individual-Collaborative": {
    name: "Individualistic vs Collaborative",
    lowEnd: "Individualistic",
    highEnd: "Collaborative",
    lowDescription: "Prefers clear personal ownership and autonomy; effective for high-autonomy tasks.",
    highDescription: "Prefers shared ownership and cross-functional integration; effective in complex team problems.",
    mixedDescription: "Combines personal accountability with collaborative coordination when context requires."
  },

  "Assertive-Accommodating": {
    name: "Assertive vs Accommodating",
    lowEnd: "Assertive",
    highEnd: "Accommodating",
    lowDescription: "Direct, boundary-oriented, and willing to create tension to protect outcomes.",
    highDescription: "Relational, compromise-oriented, and prioritizes long-term rapport and alignment.",
    mixedDescription: "Balances directness with diplomacy based on stakes and relationship importance."
  },

    "Competitive-Cooperative": {
    name: "Competitive vs. Cooperative",
    lowEnd: "Competitive",
    highEnd: "Cooperative",
    lowDescription: "pursues excellence through individual performance, striving for distinction and measurable superiority.",
    highDescription: "thrives in shared achievement, seeking synergy and team alignment over individual victory.",
    mixedDescription: "balances personal drive with team cohesion, adapting strategy based on situational reward structure."
  },
  "Empathetic-Objective": {
    name: "Empathetic vs. Objective",
    lowEnd: "Empathetic",
    highEnd: "Objective",
    lowDescription: "prioritizes emotional understanding, harmony, and supportive relationships in decisions.",
    highDescription: "values fairness, detachment, and data-based reasoning over emotional influence.",
    mixedDescription: "adjusts relational tone depending on context, blending compassion with accountability."
  },
  "Innovative-Traditional": {
    name: "Innovative vs. Traditional",
    lowEnd: "Innovative",
    highEnd: "Traditional",
    lowDescription: "seeks novelty and transformation, challenging norms and creating new possibilities.",
    highDescription: "respects legacy methods and incremental improvements, emphasizing tested efficiency.",
    mixedDescription: "adopts innovation selectively while maintaining reliability and institutional continuity."
  },
  "AchievementStability": {
    name: "Achievement vs. Stability",
    lowEnd: "Achievement-driven",
    highEnd: "Stability-driven",
    lowDescription: "oriented toward growth, challenge, and progress even at personal or operational risk.",
    highDescription: "seeks equilibrium, quality consistency, and controlled workload for sustainable performance.",
    mixedDescription: "balances ambition and security, calibrating intensity with longevity."
  },
  "ChangeTolerance": {
    name: "Change Tolerance vs. Resistance",
    lowEnd: "Change-tolerant",
    highEnd: "Change-resistant",
    lowDescription: "embraces volatility and reinvention, adapting fluidly under uncertainty.",
    highDescription: "prefers stable routines, gradual transitions, and low ambiguity environments.",
    mixedDescription: "assesses changes case by case, adapting when benefits outweigh disruption."
  },

    "Ethical-Pragmatic": {
    name: "Ethical vs. Pragmatic",
    lowEnd: "Ethical",
    highEnd: "Pragmatic",
    lowDescription: "Prioritizes principle, fairness, and transparency even at short-term cost. Excels in trust-sensitive contexts.",
    highDescription: "Prioritizes outcomes, timeliness, and pragmatic trade-offs. Excels in fast-moving environments requiring tactical flexibility.",
    mixedDescription: "Balances principle and pragmatism contextually, seeking fair outcomes while managing operational constraints."
  },

  "Independent-Guided": {
    name: "Independent vs. Guided",
    lowEnd: "Independent",
    highEnd: "Guided",
    lowDescription: "Thrives on autonomy, ownership, and local decision-making. Effective in loosely structured, entrepreneurial roles.",
    highDescription: "Thrives with clear direction, templates, and alignment. Effective where coordination and consistency matter.",
    mixedDescription: "Operates autonomously within clear guardrails, combining ownership with alignment."
  },

  "Curious-Proficient": {
    name: "Curious vs. Proficient",
    lowEnd: "Curious",
    highEnd: "Proficient",
    lowDescription: "Seeks exploration, learning, and breadth of capability. Excels at innovation and cross-domain synthesis.",
    highDescription: "Seeks depth, reliability, and craft in a domain. Excels at consistent, high-quality delivery.",
    mixedDescription: "Learns selectively while preserving core excellence, balancing exploration and mastery."
  },

  "Composed-Expressive": {
    name: "Composed vs. Expressive",
    lowEnd: "Composed",
    highEnd: "Expressive",
    lowDescription: "Maintains emotional regulation, calm messaging, and steady leadership under stress.",
    highDescription: "Uses expressive communication and passionate engagement to motivate and mobilize teams.",
    mixedDescription: "Adapts emotional cadence to context—measured when needed, expressive when it ignites action."
  },

  "ShortTerm-LongTermFocused": {
    name: "Short-term vs. Long-term Focus",
    lowEnd: "Long-term Focused",
    highEnd: "Short-term Focused",
    lowDescription: "Invests in durable capabilities and compounding value; tolerates near-term trade-offs for future payoff.",
    highDescription: "Delivers immediate results and responsiveness; secures resources and credibility through present wins.",
    mixedDescription: "Balances near-term delivery while preserving runway for strategic investments."
  }

  // ADD NEW TRAIT INTERPRETATION HERE
};

const patternInterpretations = {
  "Structure-Flexibility": {
    "A-A-A": {
      label: "1Strong Structure Orientation",
      logic: "1Consistently prioritizes rules, planning and role clarity. Decision rule heavily weights defensibility, low variance, and predictable accountability.",
      cues: "1Insists on documented procedures, escalates unclear items, requests formal approvals, communicates with conservative framing.",
      impact: "1Delivers reliable, predictable outcomes with strong auditability; slower throughput and potential missed opportunities in fast contexts.",
      risk: "1Low tolerance for improvisation; risks missing critical windows or failing to react to novel threats quickly.",
      development: "1Train in 'safe exceptions' where temporary deviations are pre-authorized. Run timeboxed improvisation drills. Create contingency templates that preserve traceability."
    },
    "A-A-B": {
      label: "Mostly Structured with Tactical Flexibility",
      logic: "Defaults to procedure, but will change roles when milestone is genuinely threatened. Threshold for change is high and consequence-driven.",
      cues: "Detailed planning, contingency activation only under KPI breach, minimal role reassignments to preserve accountability.",
      impact: "Stability with targeted resilience; routine ops predictable but recovery available when necessary.",
      risk: "Moderate - risk taken only when clear necessity is present.",
      development: "Codify contingency activation thresholds. Schedule periodic drills so team knows fallback behaviors."
    },
    "A-B-A": {
      label: "Situational Planner",
      logic: "Differentiates domains: preserves governance where institutional legitimacy matters; prefers speed in ambiguous planning contexts.",
      cues: "Applies contextual decision rules, communicates if/then logic explicitly, adds qualifiers explaining process bypasses.",
      impact: "Flexible in execution but can create ambiguity about when rules apply.",
      risk: "Variable; good at triage but risks inconsistent norms.",
      development: "Publish explicit decision matrix mapping contexts to 'follow process' vs 'prioritize speed.'"
    },
    "A-B-B": {
      label: "Structured Governance, Operationally Adaptive",
      logic: "Keeps formal legitimacy in stakeholder disputes while applying operational agility. Governance remains north star; execution is adaptive.",
      cues: "Asks for sign-off on direction, reorganizes workflows, accepts iterative outputs, frames changes as temporary.",
      impact: "Strong middle ground - accountable at top, adaptive at execution.",
      risk: "Moderate-high adaptive risk; operational creativity balanced by governance constraints.",
      development: "Define delegated authorities where operational changes don't require escalation. Build operational playbooks."
    },
    "B-A-A": {
      label: "Pragmatic Conflict-Resolver",
      logic: "Pragmatically resolves conflicts short-term, then reverts to planning and role stability for sustained recovery.",
      cues: "Negotiates quickly at governance level, then requests time for structured recovery plans.",
      impact: "Excellent in conflict arbitration; may disappoint teams expecting sustained innovation after crisis.",
      risk: "Selective risk taking; quick fixes without systemic follow-through can leave loose ends.",
      development: "Implement post-conflict stabilization plan to convert short fixes into durable solutions."
    },
    "B-A-B": {
      label: "Adaptive Allocator (Hybrid Operator)",
      logic: "Balances pragmatic conflict resolution, careful planning in resource ambiguity, and operational role reconfiguration. Deliberate about where to apply each mode.",
      cues: "Actively calibrates trade-offs, documents rationale, comfortable with limited rule-breaking for clear benefit.",
      impact: "High versatility; requires careful communication to maintain trust.",
      risk: "Moderate; complexity of choices imposes coordination cost.",
      development: "Annotate decisions with concise trade-off reasoning. Practice explaining 'why now / why not.'"
    },
    "B-B-A": {
      label: "Action-first, Role-conservative",
      logic: "Acts immediately for conflicts and ambiguous resourcing, but resists role reassignment. Prioritizes momentum but preserves boundaries.",
      cues: "Fast decisions, short feedback cycles, requests teammates absorb work rather than change roles.",
      impact: "Keeps momentum but risks overloading people; resilience to turnover is limited.",
      risk: "Operational risk from overload, potential burnout or quality drop.",
      development: "Establish temporary role-share protocols. Invest in cross-training for high-impact roles."
    },
    "B-B-B": {
      label: "Strong Flexibility Orientation (Adaptive Resilience)",
      logic: "Optimizes for immediate outcomes across governance, planning and personnel shocks. Tolerates ambiguity and prioritizes adaptive actions.",
      cues: "Frequent reallocation, rapid experiments, candid assumption statements, high cadence stakeholder communication.",
      impact: "High adaptability and speed; risks include process drift, coordination overhead.",
      risk: "High variance - excellent in volatile contexts, weaker in scale or regulated contexts.",
      development: "Institute re-alignment rituals: immediate documentation of exceptions, scheduled retrospective."
    }
  },
  
  "Risk-Caution": {
    "A-A-A": {
      label: "Strong Caution Orientation",
      logic: "Consistent preference for downside protection across capital, public engagement, and technical choices. Aims to minimize exposure and preserve optionality.",
      cues: "Methodical due diligence, staged asks, strong emphasis on rollback and contingency, conservative public posture.",
      impact: "Stability and low catastrophic failures; potentially slow innovation, missed upside.",
      risk: "Low volatility, low upside capture. Strategic risk: competitor outflanks through speed.",
      development: "Pilot small bets to build evidence. Create fast-fail mechanisms. Periodic calibration workshops."
    },
    "A-A-B": {
      label: "Mostly Cautious with Tactical Risk",
      logic: "Generally avoids risk but accepts technical risk when discrete structural trigger compels action. Comfortable with single tactical risk while protecting capital.",
      cues: "Careful capital screening, cautious public positioning but steps up visibility if clear benefit.",
      impact: "Mostly predictable operations with selective tactical bets; may be slow to adjust without crisis signals.",
      risk: "Measured; takes limited, targeted risks.",
      development: "Define explicit signals that permit tactical risk-taking. Pre-approve contingency teams."
    },
    "A-B-A": {
      label: "Selective Explorer",
      logic: "Protects capital and systems but seeks learning through visible projects. Separates financial/technical safeguards from reputation experiments.",
      cues: "Volunteers for network roles but balks at large financial or technical exposure.",
      impact: "Gains visibility and learning while preserving core stability.",
      risk: "Moderate; social experiments accepted, fiscal/technical exposure limited.",
      development: "Create 'visibility vs capital exposure' guidelines. Use tight guardrails for technical projects."
    },
    "A-B-B": {
      label: "Cautious Capital, Operationally Aggressive",
      logic: "Protects balance sheet but favors action on visibility and technical experiments. Maintains capital flexibility while accepting operational variance.",
      cues: "Declines big investments but leads public projects and pushes technical pilots.",
      impact: "High learning and visibility, low capital exposure.",
      risk: "Asymmetric - operational/reputational risk higher, capital risk low.",
      development: "Ensure public commitments matched with operational readiness. Maintain strict capital allocation policies."
    },
    "B-A-A": {
      label: "Risk-Seeker in Capital",
      logic: "Will deploy capital for strategic advantage but minimizes public exposure and technical instability. Treats financial bets as controlled levers.",
      cues: "Pursues selective acquisitions/partnerships, avoids high-visibility roles, insists on robust technical validation.",
      impact: "Can achieve strategic scale quickly with careful public posture.",
      risk: "Capital risk high, reputational/technical risk low.",
      development: "Pair aggressive investment with communications plan. Ensure technical readiness before scaling."
    },
    "B-A-B": {
      label: "Capital Risk, Targeted Operational Experimentation",
      logic: "Aggressively invests but remains cautious on ambiguous resource decisions. Uses targeted technical pilots.",
      cues: "Makes financial commitments but requests structured plans for resource allocation.",
      impact: "Finance-driven growth with tactical controls.",
      risk: "Moderate-high; capital deployed with operational guardrails.",
      development: "Link capital deployment to operational milestones. Reserve funds for remediation."
    },
    "B-B-A": {
      label: "Actionable Risk-Taker with Infrastructure Conservatism",
      logic: "Embraces investment and public visibility, but avoids destabilizing core operations. Technical change only conservatively.",
      cues: "Pushes for bold strategic bets and public leadership, restricts technical experimentation to safe channels.",
      impact: "Strong growth orientation with operational backbone.",
      risk: "High outward exposure, low operational disruption.",
      development: "Expand non-critical experimentation zones. Strengthen incident response."
    },
    "B-B-B": {
      label: "Strong Risk Orientation (Growth Champion)",
      logic: "Consistently favors upside capture - invests boldly, leads publicly, pilots new technology. Accepts high variance for transformational outcomes.",
      cues: "Rapid capital allocation, front-facing leadership, production pilots, tolerance for short-term instability.",
      impact: "Highest potential for accelerated growth; also highest exposure to failures.",
      risk: "High variance; requires robust mitigation frameworks.",
      development: "Establish strict exposure caps and automated rollback. Create reasoned bet format."
    }
  },
  
  "Analytical-Intuitive": {
    "A-A-A": {
      label: "Consistent Analyst",
      logic: "Systematically seeks evidence, reduces ambiguity through measurement, and defends recommendations with replicable analysis.",
      cues: "Requests data, documents assumptions, uses sensitivity analyses, asks for validation plans.",
      impact: "High defensibility and reproducibility; slower in ambiguous or time-pressured novelty.",
      risk: "Missed opportunities in fast-moving contexts; paralysis by analysis.",
      development: "Practice rapid hypothesis framing and decision heuristics; timebox analyses and accept provisional action."
    },
    "A-A-B": {
      label: "Analytic with Pragmatic Pivot",
      logic: "Mostly analysis-driven but will act when timeliness outweighs marginal informational gain.",
      cues: "Runs core checks then empowers provisional pilots; uses staged validation.",
      impact: "Balanced reliability and timeliness.",
      risk: "May default to caution; needs triggers to accelerate.",
      development: "Define acceleration triggers and playbooks for rapid pilots."
    },
    "A-B-A": {
      label: "Reflective Synthesizer",
      logic: "Uses analysis to check intuition; alternates modeling with judgment in ambiguous spaces.",
      cues: "Frames models, then refines with expert sensechecks.",
      impact: "Good trade-off between rigor and speed.",
      risk: "Potential inconsistency across teams—document rationale clearly.",
      development: "Standardize when to elevate intuition vs. when to test."
    },
    "A-B-B": {
      label: "Judgment-assisted Operator",
      logic: "Defaults to analysis but respects experienced judgment when time is short.",
      cues: "Quick consults with domain experts, limited analytic checks before action.",
      impact: "Practical and defensible; good in mixed-uncertainty situations.",
      risk: "Occasional under-tested decisions; track pilot outcomes.",
      development: "Use lightweight analytics templates for fast validation."
    },
    "B-A-A": {
      label: "Intuitive with Analytical Recovery",
      logic: "Acts on pattern recognition, then formalizes learning with analysis afterward.",
      cues: "Rapid prototyping followed by post-hoc measurement and process capture.",
      impact: "Fast discovery, improved later reliability.",
      risk: "Early actions may expose systems to risk without upfront safeguards.",
      development: "Predefine rollback criteria and monitoring for early experiments."
    },
    "B-A-B": {
      label: "Adaptive Integrator",
      logic: "Relies on intuition for speed while using analysis selectively to de-risk critical points.",
      cues: "Pattern-led choices with targeted metrics, pragmatic testing in live contexts.",
      impact: "High agility with reasonable controls.",
      risk: "Coordination overhead to maintain alignment between intuition and measurements.",
      development: "Document critical metrics before launch; use short feedback loops."
    },
    "B-B-A": {
      label: "Heuristic Practitioner",
      logic: "Primarily acts on experience; applies analysis infrequently for major decisions.",
      cues: "Relies on playbooks, prior patterns, and expert calls rather than full analyses.",
      impact: "Very fast, high situational throughput.",
      risk: "Higher variance in outcome quality.",
      development: "Introduce spot-check analytics and peer review triggers."
    },
    "B-B-B": {
      label: "Consistent Intuitive Actor",
      logic: "Consistently uses judgment and tacit knowledge to move quickly; values speed and adaptation.",
      cues: "Rapid choices, experiential reasoning, strong reliance on domain heuristics.",
      impact: "Excellent for novel, time-sensitive problems; less defensible in audit-sensitive contexts.",
      risk: "Harder to scale decisions; reproducibility is limited.",
      development: "Capture heuristics into decision rules and training artifacts."
    }
  },

  "Strategic-Tactical": {
    "A-A-A": {
      label: "Long-Horizon Architect",
      logic: "Designs capability investments and organizational direction with durable advantages in mind.",
      cues: "Shifts incentives, sets north-star metrics, plans multi-year roadmaps.",
      impact: "Builds long-term resilience and differentiation.",
      risk: "Slow returns; stakeholder impatience.",
      development: "Balance with quick-win initiatives that demonstrate progress."
    },
    "A-A-B": {
      label: "Strategic-with-Delivery Mindset",
      logic: "Sets long-term goals but sequences tactical wins to maintain momentum and credibility.",
      cues: "Breaks strategy into staged deliverables, milestones tied to funding.",
      impact: "Strategic clarity with validated steps.",
      risk: "Requires disciplined orchestration.",
      development: "Use milestone-based funding and transparent progress reporting."
    },
    "A-B-A": {
      label: "Visionary Executor",
      logic: "Leads with strategic framing but intervenes tactically when operational risks threaten the vision.",
      cues: "Strategy-first communications, tactical war-rooms when needed.",
      impact: "Strong alignment; capable crisis handling.",
      risk: "May overcommit resources to strategic pivots.",
      development: "Institute guardrails and contingency budgets."
    },
    "A-B-B": {
      label: "Strategy-Sensitive Operator",
      logic: "Balances daily delivery while protecting strategic options through careful resource allocation.",
      cues: "Operational rigor with strategic signal preservation.",
      impact: "Stable performance and gradual strategic progress.",
      risk: "Trade-off: neither fastest delivery nor boldest strategic moves.",
      development: "Prioritize experiments that can shift strategic posture when validated."
    },
    "B-A-A": {
      label: "Tactical Opportunist with Vision",
      logic: "Executes quickly but invests opportunistically when clear strategic windows appear.",
      cues: "Fast sprints and opportunistic reallocations aligned to emergent windows.",
      impact: "High responsiveness and selective strategic wins.",
      risk: "Possible lack of coherent long-term plan.",
      development: "Codify opportunistic criteria that align with strategic themes."
    },
    "B-A-B": {
      label: "Delivery-first Strategist",
      logic: "Focuses on execution and uses tactical success to inform strategic choices.",
      cues: "Deliverables inform strategy; pivots based on validated outcomes.",
      impact: "Data-grounded strategy derived from execution.",
      risk: "Strategy may be reactive rather than proactive.",
      development: "Supplement with explicit horizon scans and scenario planning."
    },
    "B-B-A": {
      label: "Tactical Stabilizer",
      logic: "Relentlessly executes current priorities and minimizes exposure to long-range uncertainty.",
      cues: "Tight sprints, KPI obsession, conservative shifts.",
      impact: "Predictable delivery and reliability.",
      risk: "Missed disruptive shifts; vulnerable to industry inflection points.",
      development: "Schedule strategic reviews and horizon experiments regularly."
    },
    "B-B-B": {
      label: "Pure Executor",
      logic: "Maximizes throughput and immediate outcomes; de-prioritizes long-range repositioning.",
      cues: "High velocity, operational metrics focus, short feedback cycles.",
      impact: "Strong short-term performance; harder to pivot when context changes.",
      risk: "Strategic inertia; competitive disadvantage over time.",
      development: "Allocate a fixed percent of capacity to strategic exploration."
    }
  },

  "Conceptual-Concrete": {
    "A-A-A": {
      label: "Systemic Thinker",
      logic: "Builds and applies abstractions that reframe problems to gain leverage across contexts.",
      cues: "Uses frameworks, maps causal loops, elevates assumptions.",
      impact: "Transforms how teams view problems; high leverage planning.",
      risk: "Implementation gaps and slow execution.",
      development: "Translate models into minimal viable processes and pilot them."
    },
    "A-A-B": {
      label: "Conceptual Implementer",
      logic: "Develops frameworks and then codifies pragmatic steps for initial pilots.",
      cues: "Principles + early templates for application.",
      impact: "Useful balance: ideas that become usable quickly.",
      risk: "May under-specify operational details for scale.",
      development: "Invest in playbook creation from early pilots."
    },
    "A-B-A": {
      label: "Theory-then-Practice Leader",
      logic: "Focuses on big-picture framing, but intervenes with concrete sequences to validate ideas.",
      cues: "High-level vision paired with scheduled operational checkpoints.",
      impact: "Good for transformative initiatives that need experimental validation.",
      risk: "Coordination cost between vision and teams.",
      development: "Institutionalize translation rituals: 'vision → pilot → scale'."
    },
    "A-B-B": {
      label: "Framework-informed Doer",
      logic: "Applies models as guidelines but prioritizes delivering working solutions quickly.",
      cues: "Frameworks inform priorities; execution is pragmatic.",
      impact: "Practical innovation with sufficient structure.",
      risk: "May shortcut deeper model coherence to hit deliverables.",
      development: "Retrofit scaled learnings back into conceptual models."
    },
    "B-A-A": {
      label: "Practical Innovator",
      logic: "Starts with concrete solutions, then abstracts patterns for reuse.",
      cues: "Deploys practical fixes and extracts principles post-hoc.",
      impact: "Fast impact and later systemic gains.",
      risk: "May miss systemic root causes initially.",
      development: "Capture lessons and formalize abstractions from live projects."
    },
    "B-A-B": {
      label: "Execution-led Theorist",
      logic: "Delivers concrete outcomes and uses them to test conceptual hypotheses iteratively.",
      cues: "Rapid deployments feeding conceptual refinement.",
      impact: "Iterative elevation from practice to principle.",
      risk: "Requires discipline to capture and generalize learnings.",
      development: "Run 'postmortem → abstraction' cycles."
    },
    "B-B-A": {
      label: "Toolbox Practitioner",
      logic: "Relies on proven templates and practical processes to produce predictable results.",
      cues: "Checklists, templates, playbooks, immediate rollouts.",
      impact: "Consistent delivery and reliable replication.",
      risk: "Less leverage to change systemic behavior.",
      development: "Pilot occasional conceptual reviews to explore larger improvements."
    },
    "B-B-B": {
      label: "Operational Realist",
      logic: "Almost exclusively focuses on concrete deliverables and well-defined processes.",
      cues: "Process fidelity, outcome tracking, tactical discipline.",
      impact: "High reliability, strong quality control.",
      risk: "Limited innovation and systemic reframing capacity.",
      development: "Create paired roles or squads for conceptual exploration."
    }
  },

    "Process-Outcome": {
    "A-A-A": {
      label: "Process Purist",
      logic: "Relentlessly standardizes processes and prioritizes compliance before scale.",
      cues: "Extensive checklists, strong QA gates, slow but reliable launches.",
      impact: "High reliability and predictability; great for regulated environments.",
      risk: "May miss market windows and frustrate teams with heavy process burden.",
      development: "Create 'fast lanes' for pilot projects with time-bound process relaxations."
    },
    "A-A-B": {
      label: "Process-first with Tactical Interventions",
      logic: "Uses process as default but deploys outcome-focused initiatives when KPIs demand.",
      cues: "Robust SOPs with defined exceptions for urgent initiatives.",
      impact: "Stable operations with controlled bursts of speed.",
      risk: "Requires clear exception governance to avoid process erosion.",
      development: "Document exception criteria and authority for fast initiatives."
    },
    "A-B-A": {
      label: "Structured Troubleshooter",
      logic: "Applies process to diagnose but applies targeted action to fix issues.",
      cues: "Process-driven audits leading to tactical fixes.",
      impact: "Good at eliminating root operational causes.",
      risk: "Can be slow to implement wide changes when systems need redesign.",
      development: "Use parallel fast-track teams for systemic redesigns."
    },
    "A-B-B": {
      label: "Process-informed Operator",
      logic: "Leverages process knowledge to enable rapid outcome delivery.",
      cues: "Process templates adapted for fast sprints.",
      impact: "Reliable speed with maintained controls.",
      risk: "Potential drift in process fidelity over time.",
      development: "Schedule process reviews post-sprint to restore alignment."
    },
    "B-A-A": {
      label: "Outcome-driven Stabilizer",
      logic: "Pushes results first, then hardens processes to sustain gains.",
      cues: "Rapid initiatives followed by institutionalization efforts.",
      impact: "Quick impact with later scale-up discipline.",
      risk: "Risk of temporary chaos before stabilization.",
      development: "Mandate immediate documentation and playbook creation after wins."
    },
    "B-A-B": {
      label: "Direct Fixer",
      logic: "Targets outcomes aggressively but keeps an eye on systemic implications.",
      cues: "Short cycles for impact plus scheduled retrospectives.",
      impact: "Fast recovery and pragmatic scaling.",
      risk: "May under-invest in long-term process robustness.",
      development: "Allocate capacity for retrospective system hardening."
    },
    "B-B-A": {
      label: "Tactical First Responder",
      logic: "Prioritizes hitting targets with opportunistic fixes, later formalizing when necessary.",
      cues: "High cadence interventions, reactive documentation.",
      impact: "Keeps KPIs healthy but may create technical debt.",
      risk: "Debt accumulation and repeat fixes.",
      development: "Enforce debt paydown cycles and retrospective upgrades."
    },
    "B-B-B": {
      label: "Outcome Focused Accelerator",
      logic: "Relentless on delivering outcomes, less wedded to formal process.",
      cues: "Rapid launches, iterative improvement in production.",
      impact: "Fast value capture; high learning velocity.",
      risk: "Operational fragility without periodic stabilization.",
      development: "Create standing stabilization sprints and monitoring guards."
    }
  },

  "Proactive-Reactive": {
    "A-A-A": {
      label: "Anticipatory Planner",
      logic: "Builds capability and buffers early to reduce future shocks.",
      cues: "Long-range roadmaps, scenario planning, capability investments.",
      impact: "Lower disruption and smoother transitions at scale.",
      risk: "Potential over-investment in low-probability scenarios.",
      development: "Prioritize modular investments with staged commitments."
    },
    "A-A-B": {
      label: "Cautious Early Adapter",
      logic: "Prepares ahead but validates before large deployment.",
      cues: "Pilots, readiness checks, conditional scaling.",
      impact: "Balanced preparedness and resource discipline.",
      risk: "May under-commit early and lose first-mover advantages.",
      development: "Define criteria to shift from pilot to scale decisively."
    },
    "A-B-A": {
      label: "Smart Preparer",
      logic: "Readily prepares but waits for confirming signals to act decisively.",
      cues: "Low-cost preparedness with clear go/no-go triggers.",
      impact: "Good strike balance between readiness and efficiency.",
      risk: "Requires discipline to act once signals appear.",
      development: "Assign clear owners for go/no-go decisions."
    },
    "A-B-B": {
      label: "Watchful Reactor with Preparedness",
      logic: "Mostly monitors but keeps light preparations to accelerate response.",
      cues: "Surveillance systems plus quick-mobilize playbooks.",
      impact: "Efficient resource use with faster reaction times.",
      risk: "Possibility of late reaction if signals are weak.",
      development: "Expand monitoring sensitivity and decision thresholds."
    },
    "B-A-A": {
      label: "Reactive Mobilizer who Plans Later",
      logic: "Responds decisively and builds structure after events.",
      cues: "Quick mobilization, post-event stabilization.",
      impact: "Good crisis handling; improvement tends to be retrospective.",
      risk: "Higher initial disruption with slower systemic improvement.",
      development: "Create pre-approved mobilization templates to reduce post-hoc burden."
    },
    "B-A-B": {
      label: "Opportunistic Responder",
      logic: "Acts when required and uses post-hoc learning to improve future posture.",
      cues: "Fast reaction, frequent after-action reports.",
      impact: "Adaptive learning, but mostly reactive posture.",
      risk: "May be unprepared for novel large-scale shocks.",
      development: "Institutionalize learning into small preparedness investments."
    },
    "B-B-A": {
      label: "Lean Responder",
      logic: "Minimizes proactive investment and relies on lean reactive capabilities.",
      cues: "Low baseline overhead, rapid redeployment teams.",
      impact: "Cost efficient but risk of slow response to novel shifts.",
      risk: "Vulnerable to unexpected, high-impact events.",
      development: "Maintain small strategic reserves and contingency playbooks."
    },
    "B-B-B": {
      label: "Pure Reactor",
      logic: "Rarely prepares; strong at mobilizing when unequivocal needs arise.",
      cues: "Event-driven resourcing, reactive governance.",
      impact: "Conserves resources but may face larger crisis costs.",
      risk: "High exposure to sudden shocks without preparation.",
      development: "Schedule occasional horizon scans and minimal readiness drills."
    }
  },

  "Detail-BigPicture": {
    "A-A-A": {
      label: "Micro-operator",
      logic: "Focuses relentlessly on execution detail and near-term quality.",
      cues: "Deep checklists, metrics on small scopes, hands-on monitoring.",
      impact: "Low error rates and high delivery quality.",
      risk: "May miss systemic issues and long-term opportunities.",
      development: "Pair with strategic partners or schedule periodic strategic reviews."
    },
    "A-A-B": {
      label: "Detail-led Strategist",
      logic: "Grounds strategy in operational reality by ensuring details support big aims.",
      cues: "Operational pilots that inform strategic direction.",
      impact: "Practical strategy with operational feasibility baked in.",
      risk: "Time consumed by validation may slow strategic pivoting.",
      development: "Timebox pilots and ensure strategic synthesis cadence."
    },
    "A-B-A": {
      label: "Contextual Operator",
      logic: "Applies detail focus in execution and steps back for systemic signal when needed.",
      cues: "Alternates zoom-in/zoom-out cycles intentionally.",
      impact: "Balances reliability with occasional strategic insight.",
      risk: "Requires discipline to switch perspectives.",
      development: "Adopt explicit 'zoom' rituals in planning cycles."
    },
    "A-B-B": {
      label: "Tactical Visionary",
      logic: "Uses vision to prioritize detailed efforts where they matter most.",
      cues: "Strategic prioritization then operational depth allocation.",
      impact: "High leverage outcomes with solid execution where required.",
      risk: "May under-resource some necessary operational areas.",
      development: "Use portfolio management to distribute detail-investment efficiently."
    },
    "B-A-A": {
      label: "Strategic Doer",
      logic: "Drives big-picture change and attends to the crucial details to ensure success.",
      cues: "Strategic initiatives with embedded operational ownership.",
      impact: "High transformational impact with plausible delivery.",
      risk: "Heavy coordination demands.",
      development: "Institutionalize delivery squads aligned to strategic initiatives."
    },
    "B-A-B": {
      label: "Vision with Tactical Follow-through",
      logic: "Starts with big ideas then scaffolds concrete steps to execute them pragmatically.",
      cues: "Vision documents plus immediate short-cycle experiments.",
      impact: "High strategic traction with iterative realization.",
      risk: "Need discipline to avoid scope creep.",
      development: "Enforce milestone-based progress reviews tied to strategy."
    },
    "B-B-A": {
      label: "Integrator",
      logic: "Maintains a balanced eye on detail while driving systemic direction.",
      cues: "Bridges teams with a mix of strategy and operational oversight.",
      impact: "Reliable transformation with manageable risk.",
      risk: "High cognitive load on integrators.",
      development: "Distribute integrator responsibilities across roles to avoid single-point overload."
    },
    "B-B-B": {
      label: "Macro-strategist",
      logic: "Primarily directs system-level thinking and leaves details to empowering teams.",
      cues: "North-star frameworks, delegation of execution, outcome-oriented KPIs.",
      impact: "Large-scale change and direction-setting.",
      risk: "Execution gaps if teams lack capacity.",
      development: "Invest in capabilities and governance to translate strategy into results."
    }
  },

  "Individual-Collaborative": {
    "A-A-A": {
      label: "Lone Deliverer",
      logic: "Consistently owns work individually and delivers with minimal coordination.",
      cues: "Clear individual KPIs, independent decision-making, low meeting load.",
      impact: "High individual output; ideal for specialized contributors.",
      risk: "Siloing and knowledge loss when scaling.",
      development: "Encourage documentation and periodic cross-team syncs."
    },
    "A-A-B": {
      label: "Independent Integrator",
      logic: "Delivers individually but builds minimal cross-team bridges for integration.",
      cues: "Clear owners who also run lightweight integration checkpoints.",
      impact: "Efficient individual delivery with some cross-team coherence.",
      risk: "Integration risk if checkpoints fail.",
      development: "Standardize integration touchpoints and artifact handoffs."
    },
    "A-B-A": {
      label: "Task-focused Collaborator",
      logic: "Prefer personal ownership but collaborates selectively when value is clear.",
      cues: "Chooses collaboration pragmatically to solve bottlenecks.",
      impact: "Good throughput with targeted teamwork.",
      risk: "May underutilize team synergies.",
      development: "Identify routine collaboration opportunities to normalize team work."
    },
    "A-B-B": {
      label: "Solo Starter, Team Finisher",
      logic: "Works independently at first then brings team in for integration and scale.",
      cues: "Quick individual prototyping followed by collaborative refinement.",
      impact: "Fast early output with eventual broad alignment.",
      risk: "Initial misalignment possible; needs formal handoff rituals.",
      development: "Institute 'handoff readiness' checks before scaling prototypes."
    },
    "B-A-A": {
      label: "Collaborative Executor",
      logic: "Leads with shared ownership and organizes individuals to deliver outcomes.",
      cues: "Cross-functional teams with shared KPIs and joint accountability.",
      impact: "High cohesion and durable team outcomes.",
      risk: "Slower to decide in certain contexts.",
      development: "Create clear decision rights to speed collaboration."
    },
    "B-A-B": {
      label: "Shared-lead Operator",
      logic: "Balances teamwork with clear role boundaries to preserve delivery speed.",
      cues: "Defined co-ownership and rotating responsibilities.",
      impact: "Collective ownership with healthy velocity.",
      risk: "Requires cultural norms for shared accountability.",
      development: "Run team rituals to reinforce ownership behaviors."
    },
    "B-B-A": {
      label: "Networked Contributor",
      logic: "Collaborates broadly but maintains clear personal accountability where needed.",
      cues: "Active cross-team communication with personal delivery expectations.",
      impact: "Strong integration and reliable contributions.",
      risk: "Coordination overhead; needs communication discipline.",
      development: "Adopt compact sync cadences and clear artifact standards."
    },
    "B-B-B": {
      label: "Team-centric Leader",
      logic: "Fully relies on collective decision-making and shared ownership for outcomes.",
      cues: "Consensus building, shared KPIs, frequent cross-functional alignment.",
      impact: "High team morale and integrated results.",
      risk: "Potential slowdowns for time-sensitive decisions.",
      development: "Introduce delegated authorities for urgent choices."
    }
  },

  "Assertive-Accommodating": {
    "A-A-A": {
      label: "Boundary Enforcer",
      logic: "Directly defends commitments and enforces boundaries consistently.",
      cues: "Clear, firm communication and explicit consequences for non-compliance.",
      impact: "Strong protection of delivery and standards.",
      risk: "Relationship strain and possible morale issues.",
      development: "Pair firm stances with coaching language to keep ties intact."
    },
    "A-A-B": {
      label: "Firm Collaborator",
      logic: "Mostly direct but flexible when the relationship benefit justifies compromise.",
      cues: "Assertive core positions with selective concessions.",
      impact: "Protected outcomes with maintained partnerships.",
      risk: "Requires judgement to avoid perceived inconsistency.",
      development: "Set explicit rules for acceptable concessions."
    },
    "A-B-A": {
      label: "Tactical Assertor",
      logic: "Uses directness tactically while preserving working relationships on other matters.",
      cues: "Direct interventions on mission-critical items; diplomacy elsewhere.",
      impact: "Delivers on essentials while preserving social capital in general.",
      risk: "Potential confusion about when to be firm.",
      development: "Document negotiation protocols and escalation paths."
    },
    "A-B-B": {
      label: "Diplomatic Assertor",
      logic: "Combines clear boundary-setting with active softening to maintain ties.",
      cues: "Direct asks with empathic framing and compromise options.",
      impact: "Balances outcomes and relationships effectively.",
      risk: "May be perceived as inconsistent if not signaled well.",
      development: "Train in assertive empathy techniques and clear signaling."
    },
    "B-A-A": {
      label: "Consistent Harmonizer",
      logic: "Prioritizes relationships and is cautious to avoid direct confrontation.",
      cues: "Soothing language, problem framing as mutual challenges.",
      impact: "High team trust; potential under-enforcement of standards.",
      risk: "Risk of missed accountability and lowered performance.",
      development: "Introduce structures to ensure accountability while preserving harmony."
    },
    "B-A-B": {
      label: "Supportive Diplomat",
      logic: "Generally accommodating but will assert when essential for team cohesion.",
      cues: "Soft negotiation with occasional directness for critical matters.",
      impact: "Mostly harmonious teams with occasional firm corrections.",
      risk: "Assertion may be rare and surprising when it occurs.",
      development: "Practice predictable escalation pathways to normalize assertiveness."
    },
    "B-B-A": {
      label: "Relational Enabler",
      logic: "Leans toward accommodation but enforces minimal essential boundaries through coaching.",
      cues: "Gentle corrections, emphasis on development and shared values.",
      impact: "High morale with steady improvements when coached.",
      risk: "May delay tough decisions and accountability enforcement.",
      development: "Set clear, kind performance expectations and follow through."
    },
    "B-B-B": {
      label: "People-first Consensus Builder",
      logic: "Consistently values relationships and adjusts positions to maintain alignment.",
      cues: "Compromise-first framing, inclusive decision processes.",
      impact: "Strong cohesion and low interpersonal friction.",
      risk: "Compromises can erode standards without explicit guardrails.",
      development: "Establish non-negotiables and communicate them clearly to protect standards."
    }
  },

  "Competitive-Cooperative": {
  "A-A-A": {
    label: "Relentless Competitor",
    logic: "Sees performance as a hierarchy and strives to lead it. Thrives on comparison and measurable superiority.",
    cues: "Tracks wins, dominates in discussions, sets aggressive personal goals.",
    impact: "Drives high achievement, raises group standards through ambition.",
    risk: "Can erode collaboration and psychological safety if not balanced.",
    development: "Redirect competition toward external benchmarks and shared victories."
  },
  "A-A-B": {
    label: "Targeted Challenger",
    logic: "Primarily competitive but willing to cooperate when it serves a strategic purpose.",
    cues: "Alternates between assertive control and selective alliance-building.",
    impact: "Achieves outcomes efficiently while preserving essential cooperation.",
    risk: "May be perceived as self-serving if collaboration feels transactional.",
    development: "Clarify intent and shared purpose during alliances to maintain trust."
  },
  "A-B-A": {
    label: "Strategic Rival",
    logic: "Blends challenge with collaboration to optimize results for self and team.",
    cues: "Frames collective success as a stage for individual excellence.",
    impact: "Pushes peers to perform while keeping the atmosphere constructive.",
    risk: "Requires emotional intelligence to prevent rivalry from turning toxic.",
    development: "Reinforce empathy and transparency during competitive pushes."
  },
  "A-B-B": {
    label: "Collaborative Achiever",
    logic: "Competitive by instinct but genuinely values cooperative synergy.",
    cues: "Encourages shared goals, celebrates others’ wins when aligned with outcomes.",
    impact: "Creates a productive blend of energy and unity.",
    risk: "May downplay own needs or lose edge when cooperation dominates.",
    development: "Protect self-motivation by setting parallel personal milestones."
  },
  "B-A-A": {
    label: "Constructive Ally",
    logic: "Prefers cooperation yet competes when standards or fairness are challenged.",
    cues: "Diplomatic but firm when equality of effort or credit is at stake.",
    impact: "Balances group cohesion with performance protection.",
    risk: "Can oscillate between warmth and sharp defense of principles.",
    development: "Signal rationale early when shifting from cooperative to competitive mode."
  },
  "B-A-B": {
    label: "Team Strategist",
    logic: "Centers on collaboration but recognizes healthy competition as a growth driver.",
    cues: "Frames rivalries as mutual learning opportunities.",
    impact: "Promotes collective improvement without hostility.",
    risk: "Competition may be too subtle to motivate stronger personalities.",
    development: "Make constructive competition visible and celebrated to sustain momentum."
  },
  "B-B-A": {
    label: "Harmony-focused Performer",
    logic: "Highly cooperative, avoids overt competition but quietly strives for competence.",
    cues: "Supports others’ wins, focuses on mutual support.",
    impact: "Enhances cohesion and psychological safety.",
    risk: "May suppress ambition or delay self-advocacy.",
    development: "Set personal excellence metrics without reducing cooperation."
  },
  "B-B-B": {
    label: "Collective Integrator",
    logic: "Sees shared achievement as the only meaningful success metric.",
    cues: "Promotes inclusive decisions and celebrates group outcomes.",
    impact: "Builds trust and loyalty within teams.",
    risk: "Underplays performance differentiation, may slow execution in competitive contexts.",
    development: "Encourage selective ownership to preserve accountability within unity."
  }
},

"Empathetic-Objective": {
  "A-A-A": {
    label: "Emotive Connector",
    logic: "Reads emotional nuance with precision and acts to maintain human balance.",
    cues: "Quick to comfort, anticipates unspoken concerns, mediates tension naturally.",
    impact: "High trust and belonging in interpersonal environments.",
    risk: "Can absorb others’ stress or lose impartiality in conflict.",
    development: "Strengthen boundaries and introduce structured decision tools under pressure."
  },
  "A-A-B": {
    label: "Relational Analyst",
    logic: "Empathy-first but adopts objectivity when outcomes demand clarity.",
    cues: "Soft framing of facts, balances data with emotional context.",
    impact: "Bridges human needs and business imperatives effectively.",
    risk: "May over-negotiate or hesitate to enforce difficult choices.",
    development: "Use predefined thresholds to know when to pivot from empathy to action."
  },
  "A-B-A": {
    label: "Guided Empath",
    logic: "Uses empathy strategically while keeping analytical distance for key calls.",
    cues: "Warm tone, deliberate pauses before verdicts.",
    impact: "Earns respect through balanced emotional intelligence.",
    risk: "Risk of perceived indecision if switches appear reactive.",
    development: "Announce reasoning when transitioning between empathy and detachment."
  },
  "A-B-B": {
    label: "Human-Centric Pragmatist",
    logic: "Driven by understanding people but grounds decisions in logic.",
    cues: "Transparent communication, fairness with compassion.",
    impact: "Resolves issues with humanity and clarity.",
    risk: "May still internalize emotional strain after conflicts.",
    development: "Practice reflective detachment techniques after high-emotion events."
  },
  "B-A-A": {
    label: "Rational Harmonizer",
    logic: "Objective thinker with strong empathy awareness as secondary compass.",
    cues: "Leads with data but senses morale shifts quickly.",
    impact: "Produces balanced, credible solutions with humane execution.",
    risk: "Could appear impersonal in purely emotional contexts.",
    development: "Verbalize empathy explicitly to avoid misperception of detachment."
  },
  "B-A-B": {
    label: "Balanced Adjudicator",
    logic: "Combines detached fairness with emotional awareness to stabilize environments.",
    cues: "Listens fully before making evidence-based judgements.",
    impact: "Ensures trust in tough decisions.",
    risk: "Emotionally heavy issues may feel draining despite control.",
    development: "Schedule deliberate recovery after people-intensive periods."
  },
  "B-B-A": {
    label: "Measured Humanist",
    logic: "Prefers rational process but remains open to emotional cues when relevant.",
    cues: "Structured tone with occasional warmth.",
    impact: "Predictable and dependable in decision contexts.",
    risk: "May underreact to unspoken emotional dynamics.",
    development: "Train in affect recognition to detect subtle morale shifts."
  },
  "B-B-B": {
    label: "Detached Strategist",
    logic: "Maintains objectivity even under emotional pressure, decisions grounded solely on evidence.",
    cues: "Neutral tone, analytical framing of sensitive topics.",
    impact: "Ensures consistency and impartiality across scenarios.",
    risk: "Can appear cold or inaccessible to emotional teams.",
    development: "Integrate periodic empathy check-ins to humanize decision communication."
  }
},

"Innovative-Traditional": {
  "A-A-A": {
    label: "Disruptive Visionary",
    logic: "Constantly reimagines systems and challenges convention.",
    cues: "Proposes novel structures, reframes problems radically.",
    impact: "Catalyst for transformation and originality.",
    risk: "May alienate teams anchored in stability or proven models.",
    development: "Balance invention with rituals that maintain continuity."
  },
  "A-A-B": {
    label: "Adaptive Reformer",
    logic: "Defaults to innovation but integrates traditional anchors when efficiency demands.",
    cues: "Selective creativity, pragmatic recalibration under constraints.",
    impact: "High adaptability with reduced risk of chaos.",
    risk: "May appear inconsistent to both conservative and experimental stakeholders.",
    development: "Communicate rationale behind switching innovation intensity."
  },
  "A-B-A": {
    label: "Vision-Grounded Builder",
    logic: "Generates breakthrough concepts yet executes them using tested foundations.",
    cues: "Inventive top layer built on proven frameworks.",
    impact: "Bridges radical thinking and disciplined implementation.",
    risk: "Requires rigor to avoid overcomplicating hybrid models.",
    development: "Establish systematic pilots before scaling new concepts."
  },
  "A-B-B": {
    label: "Progressive Steward",
    logic: "Leans innovative but values traditional wisdom as operational backbone.",
    cues: "Experimentation within legacy frameworks.",
    impact: "Smooth transitions between past and future systems.",
    risk: "Could dilute innovation under institutional inertia.",
    development: "Schedule protected innovation cycles immune to legacy interference."
  },
  "B-A-A": {
    label: "Evolving Conservator",
    logic: "Tradition-oriented but responsive to innovation when benefits are proven.",
    cues: "Requests data before adopting new approaches.",
    impact: "Stabilizes culture while enabling slow, safe innovation.",
    risk: "Might resist early experimentation even when needed.",
    development: "Introduce small, reversible tests to increase change comfort."
  },
  "B-A-B": {
    label: "Cautious Adapter",
    logic: "Prefers heritage practices but integrates select modern methods to stay relevant.",
    cues: "Emphasizes improvement, not disruption.",
    impact: "Ensures sustainable modernization.",
    risk: "Can underplay urgency during shifts requiring reinvention.",
    development: "Pair with visionary peers to accelerate innovation cycles."
  },
  "B-B-A": {
    label: "Tradition-Aligned Optimizer",
    logic: "Anchored in established systems but refines them for marginal gains.",
    cues: "Focuses on procedural excellence.",
    impact: "Delivers predictability and efficiency.",
    risk: "Innovation inertia; low tolerance for ambiguity.",
    development: "Incentivize creative contributions even within routine optimization."
  },
  "B-B-B": {
    label: "Cultural Guardian",
    logic: "Preserves proven norms and champions institutional memory.",
    cues: "Defends historical models of success.",
    impact: "Protects identity and stability of the organization.",
    risk: "Can hinder evolution in dynamic markets.",
    development: "Introduce innovation allies to gradually modernize tradition."
  }
},

"AchievementStability": {
  "A-A-A": {
    label: "Driven Achiever",
    logic: "Pursues advancement relentlessly, defines worth through progression.",
    cues: "Sets stretch goals, tracks milestones obsessively.",
    impact: "Delivers growth and ambitious targets.",
    risk: "May overextend self or team capacity.",
    development: "Integrate recovery phases and define 'enough' metrics."
  },
  "A-A-B": {
    label: "Strategic Driver",
    logic: "Ambition-focused but values stability as an enabler of performance.",
    cues: "Sustains pace through planned equilibrium.",
    impact: "High consistent growth with less burnout.",
    risk: "May over-control variables to sustain rhythm.",
    development: "Allow selective risk-taking without performance anxiety."
  },
  "A-B-A": {
    label: "Purposeful Accelerator",
    logic: "Seeks achievement through controlled cycles of push and consolidation.",
    cues: "Alternates sprint and recovery periods intentionally.",
    impact: "Maintains resilience under long-term goals.",
    risk: "Can appear inconsistent to constant-performers.",
    development: "Communicate cyclical logic clearly to teams."
  },
  "A-B-B": {
    label: "Growth Stabilizer",
    logic: "Motivated by improvement but mindful of sustainable pace.",
    cues: "Plans incremental progress, monitors wellbeing balance.",
    impact: "Sustains performance culture without burnout.",
    risk: "May under-challenge when stability feels threatened.",
    development: "Define upper-performance zones without destabilizing comfort."
  },
  "B-A-A": {
    label: "Resilient Performer",
    logic: "Prefers stability but activates achievement focus when conditions are secure.",
    cues: "Consolidates before stretching performance.",
    impact: "Steady productivity under predictable conditions.",
    risk: "Progress slows in uncertain phases.",
    development: "Strengthen adaptability in ambiguous growth stages."
  },
  "B-A-B": {
    label: "Balanced Contributor",
    logic: "Centers on equilibrium yet seeks small performance uplifts over time.",
    cues: "Reliable cadence, moderate ambition.",
    impact: "Dependable base of consistent delivery.",
    risk: "Underplays competitive drive in performance-driven cultures.",
    development: "Introduce personal growth metrics for engagement."
  },
  "B-B-A": {
    label: "Security-Oriented Performer",
    logic: "Anchored in predictability but will rise to challenge when stability permits.",
    cues: "Minimizes disruption, prefers gradual evolution.",
    impact: "Strong under steady structures, risk-averse in volatility.",
    risk: "Can stagnate under static conditions.",
    development: "Simulate mild uncertainty to train resilience."
  },
  "B-B-B": {
    label: "Stability Guardian",
    logic: "Values continuity and reliability above advancement.",
    cues: "Maintains equilibrium, deters overreach.",
    impact: "Provides operational safety and cultural consistency.",
    risk: "Resists transformation, potential inertia.",
    development: "Build comfort with controlled experimentation."
  }
},

"ChangeTolerance": {
  "A-A-A": {
    label: "Change Catalyst",
    logic: "Thrives amid uncertainty, views transition as natural evolution.",
    cues: "Adopts new systems fast, encourages others to adapt.",
    impact: "Drives momentum and cultural renewal.",
    risk: "May create instability by moving too quickly.",
    development: "Learn to assess timing and collective readiness before shifting course."
  },
  "A-A-B": {
    label: "Transformative Operator",
    logic: "Prefers flux and adapts instinctively but knows when to stabilize.",
    cues: "Balances energy of change with need for anchors.",
    impact: "Leads adaptive environments effectively.",
    risk: "Can grow restless in stable phases.",
    development: "Develop patience for consolidation periods."
  },
  "A-B-A": {
    label: "Adaptive Integrator",
    logic: "Handles change with ease but protects core functions during transitions.",
    cues: "Implements flexible continuity models.",
    impact: "Smooths transitions while maintaining quality.",
    risk: "Potential blind spots on deep structural inertia.",
    development: "Conduct periodic audits to verify old processes are truly updated."
  },
  "A-B-B": {
    label: "Steady Adapter",
    logic: "Engages with change through structure and method.",
    cues: "Formalizes adjustments into planned programs.",
    impact: "Predictable modernization rhythm.",
    risk: "May limit agility under sudden shifts.",
    development: "Strengthen rapid response mechanisms."
  },
  "B-A-A": {
    label: "Stable Evolver",
    logic: "Prefers consistency but adapts when compelling evidence emerges.",
    cues: "Analyzes impact before committing to change.",
    impact: "Reduces transition risks, ensures quality control.",
    risk: "Slow adoption in fast-moving markets.",
    development: "Practice quicker pilot cycles to gain experiential confidence."
  },
  "B-A-B": {
    label: "Cautious Improver",
    logic: "Values order, integrates change only after thorough validation.",
    cues: "Systematic, risk-conscious adjustments.",
    impact: "Ensures continuity and reliability.",
    risk: "Innovation bottlenecks under over-analysis.",
    development: "Allow low-stakes experimentation alongside evaluation."
  },
  "B-B-A": {
    label: "Predictability Keeper",
    logic: "Resists change until absolutely necessary, acts only when stability threatened.",
    cues: "Prefers familiar workflows, seeks control.",
    impact: "Provides institutional memory and predictability.",
    risk: "Delays essential adaptation, potential obsolescence.",
    development: "Introduce micro-adaptations to build tolerance incrementally."
  },
  "B-B-B": {
    label: "Continuity Sentinel",
    logic: "Sees consistency as virtue, minimizes disruption at all cost.",
    cues: "Defends legacy systems and routines.",
    impact: "Protects organizational coherence and reliability.",
    risk: "Severe resistance to transformation; stagnation risk.",
    development: "Link continuity to progress through symbolic, gradual transitions."
  }
},

  "Ethical-Pragmatic": {
    "A-A-A": {
      label: "Principled Guardian",
      logic: "Unwavering adherence to principle; prioritizes fairness and long-term trust.",
      cues: "Transparent reporting, strict policy compliance, explicit fairness checks.",
      impact: "High integrity reputation and stakeholder trust.",
      risk: "May forgo critical short-term opportunities or create friction.",
      development: "Identify low-risk pragmatic levers that preserve principle while enabling speed."
    },
    "A-A-B": {
      label: "Principled Pragmatist",
      logic: "Principled by default but applies pragmatic steps when outcomes demand nuance.",
      cues: "Open communication with stakeholders while using staged implementation.",
      impact: "Sustains trust while delivering results incrementally.",
      risk: "Complex messaging may confuse intent.",
      development: "Predefine tolerable exceptions and disclosure rules to simplify choices."
    },
    "A-B-A": {
      label: "Ethical Operator",
      logic: "Ethical orientation that strategically accepts small tactical compromises for higher-order fairness.",
      cues: "Careful justification of exceptions, proactive remediation plans.",
      impact: "Preserves long-term legitimacy while keeping operations viable.",
      risk: "Requires disciplined follow-through to avoid erosion of standards.",
      development: "Automate remediation checklists to ensure principles are restored post-compromise."
    },
    "A-B-B": {
      label: "Contextual Moralist",
      logic: "Values principle but increasingly pragmatic in operational tails to secure outcomes.",
      cues: "Transparent compromises documented for governance review.",
      impact: "Balances integrity and utility with traceable accountability.",
      risk: "Gradual norm-shifts may occur if compromises accumulate.",
      development: "Schedule governance audits to recalibrate ethical boundaries regularly."
    },
    "B-A-A": {
      label: "Outcome-first Steward",
      logic: "Pragmatic by nature but enforces core ethical constraints when reputational exposure is material.",
      cues: "Decisions prioritize impact but include explicit guardrails for sensitive areas.",
      impact: "Delivers results with selective ethical protections.",
      risk: "Perceived opportunism if guardrails are not visible.",
      development: "Publicize ethical triggers that require elevated review to maintain credibility."
    },
    "B-A-B": {
      label: "Practical Operator with Ethical Sense",
      logic: "Operational pragmatism coupled with occasional principled stands when critical.",
      cues: "Mostly tactical choices; ethics invoked for high-salience challenges.",
      impact: "High agility with occasional integrity anchoring.",
      risk: "Inconsistent signals on values in day-to-day operations.",
      development: "Define clear ethical thresholds and role responsibilities to normalize response."
    },
    "B-B-A": {
      label: "Tactical Opportunist",
      logic: "Primarily pragmatic and outcome-driven, sometimes constrained by principle when essential.",
      cues: "Quick wins favored; ethical constraints triggered only when costly reputational risks emerge.",
      impact: "Fast delivery and tactical advantage.",
      risk: "Reputational damage risk if patterns of opportunism emerge.",
      development: "Implement periodic ethical reviews and stakeholder feedback loops."
    },
    "B-B-B": {
      label: "Pragmatic Accelerator",
      logic: "Unapologetically outcome-oriented, sees ethics as context-dependent and secondary to results.",
      cues: "Fast decisions with flexible boundary interpretation.",
      impact: "High throughput and responsiveness.",
      risk: "High reputational volatility and potential loss of long-term trust.",
      development: "Create mandatory pre-commit disclosure for high-impact exceptions to manage exposure."
    }
  },

  "Independent-Guided": {
    "A-A-A": {
      label: "Autonomous Leader",
      logic: "Operates independently with strong ownership and initiative.",
      cues: "Decisive action, minimal escalation, local decision frameworks.",
      impact: "High speed and clear ownership in ambiguous contexts.",
      risk: "Alignment risk and potential duplication of effort.",
      development: "Agree on guardrails and reporting cadences to preserve alignment."
    },
    "A-A-B": {
      label: "Autonomous Collaborator",
      logic: "Prefers independence but consults selectively for alignment on critical points.",
      cues: "Decides locally and integrates feedback at milestones.",
      impact: "Combines speed with occasional alignment corrections.",
      risk: "Potentially uneven coordination across units.",
      development: "Define escalation thresholds and sync rituals for cross-team coherence."
    },
    "A-B-A": {
      label: "Independent Pragmatist",
      logic: "Acts autonomously but formalizes outcomes through retroactive alignment.",
      cues: "Quick local action followed by documentation and seek-back approvals.",
      impact: "Delivers quickly while retrofitting alignment.",
      risk: "Post-hoc corrections may incur rework.",
      development: "Adopt lightweight pre-decision notices to reduce retroactive friction."
    },
    "A-B-B": {
      label: "Contextual Self-Starter",
      logic: "Independence favored, but relies on guidance in high-stake or novel domains.",
      cues: "Owns routine decisions; seeks direction when risk increases.",
      impact: "Practical autonomy with calibrated oversight.",
      risk: "May delay in ambiguous governance cases if guidance unavailable.",
      development: "Map decision domains to reduce uncertainty about when to escalate."
    },
    "B-A-A": {
      label: "Guided Implementer",
      logic: "Strongly follows direction but shows initiative within provided boundaries.",
      cues: "Executional excellence framed by adherence to direction.",
      impact: "Reliable delivery aligned to leadership intent.",
      risk: "May under-innovate in opportunity spaces without explicit permission.",
      development: "Encourage small autonomy experiments within safe zones."
    },
    "B-A-B": {
      label: "Aligned Executor",
      logic: "Seeks guidance and uses templates to scale consistent performance.",
      cues: "High conformity to standards, frequent check-ins.",
      impact: "Predictable outcomes and strong compliance.",
      risk: "Low initiative and potential over-dependence on instructions.",
      development: "Provide challenge tasks that require independent judgement within guards."
    },
    "B-B-A": {
      label: "Structured Follower",
      logic: "Prefers clear instruction and stepwise sign-off before acting.",
      cues: "Seeks approval early, follows playbooks closely.",
      impact: "High compliance, minimal surprise to stakeholders.",
      risk: "Slow responsiveness in fast-moving contexts.",
      development: "Train on rapid-decision frameworks to improve speed safely."
    },
    "B-B-B": {
      label: "Directive Specialist",
      logic: "Requires strong leadership direction to operate effectively.",
      cues: "Heavy reliance on roadmaps, approvals, and structured mentoring.",
      impact: "Consistent execution under clear leadership.",
      risk: "Low autonomy reduces scalability in decentralized teams.",
      development: "Gradually expand scope of decision authority with measured checkpoints."
    }
  },

  "Curious-Proficient": {
    "A-A-A": {
      label: "Exploratory Pioneer",
      logic: "Relentlessly seeks novelty, experiments broadly to discover new leverage.",
      cues: "Frequent prototypes, wide reading, cross-disciplinary curiosity.",
      impact: "High innovation potential and cross-pollination of ideas.",
      risk: "Shallow follow-through or scattered focus without consolidation.",
      development: "Pair exploration with disciplined documentation and selection criteria."
    },
    "A-A-B": {
      label: "Inquisitive Specialist",
      logic: "Highly curious but applies exploration toward strengthening core expertise.",
      cues: "Targeted learning with application to domain skills.",
      impact: "Expands capability while deepening value in critical areas.",
      risk: "Balance required to avoid overextension.",
      development: "Set learning objectives tied to measurable outcomes."
    },
    "A-B-A": {
      label: "Learning Practitioner",
      logic: "Balances learning sprints with applied practice to embed new insights.",
      cues: "Short experiments followed by skill refinement.",
      impact: "Sustainable capability expansion and practical knowledge growth.",
      risk: "Requires discipline to alternate learning and delivery phases.",
      development: "Timebox curiosity cycles with enforced implementation periods."
    },
    "A-B-B": {
      label: "Curious Implementer",
      logic: "Leans toward skill depth but makes room for exploratory inputs to evolve craft.",
      cues: "Occasional experimentation that refines standard methods.",
      impact: "Incremental innovation grounded in expertise.",
      risk: "May underinvest in breakthrough exploration.",
      development: "Reserve a fixed percentage of time for blue-sky research."
    },
    "B-A-A": {
      label: "Crafted Expert",
      logic: "Deep mastery drives reliable outcomes and domain authority.",
      cues: "Refined processes, deep domain artifacts, teaching others.",
      impact: "High-quality, consistent outputs and mentorship capacity.",
      risk: "Slower adaptation to disruptive shifts without curiosity inputs.",
      development: "Schedule cross-disciplinary exposure to rejuvenate perspective."
    },
    "B-A-B": {
      label: "Steady Specialist",
      logic: "Prioritizes proficiency while selectively integrating useful new methods.",
      cues: "Occasional skill upgrades targeted at clear ROI.",
      impact: "Strong dependability with pragmatic improvements.",
      risk: "Opportunity cost from rare exploration windows.",
      development: "Create a low-friction idea intake that filters high-potential novelty."
    },
    "B-B-A": {
      label: "Practical Authority",
      logic: "Deep practitioner focus with occasional curiosity-driven enhancements.",
      cues: "High local impact, controlled experiments when justified.",
      impact: "Reliable excellence with incremental modernization.",
      risk: "Limited radical reinvention capability.",
      development: "Partner with curious peers to infuse new insights."
    },
    "B-B-B": {
      label: "Master Craftsman",
      logic: "Relies on well-honed techniques and continuous refinement of core skill.",
      cues: "High fidelity outputs, process mastery, strong reproducibility.",
      impact: "Exceptional reliability and quality.",
      risk: "Innovation inflection points may be missed.",
      development: "Institutionalize learning rituals that surface critical new practices."
    }
  },

  "Composed-Expressive": {
    "A-A-A": {
      label: "Stoic Anchor",
      logic: "Remains calm in pressure, uses measured messaging to stabilize teams.",
      cues: "Low-emotion delivery, steady cadence, expectation management.",
      impact: "Reduces panic and maintains operational focus.",
      risk: "May come across as unengaged or distant.",
      development: "Add occasional expressive moments to humanize leadership."
    },
    "A-A-B": {
      label: "Calm Motivator",
      logic: "Predominantly composed but deploys expressive appeals for morale when strategic.",
      cues: "Measured communication punctuated by inspirational narratives.",
      impact: "Reliable steadiness with targeted emotional uplift.",
      risk: "Timing of expressive moments must be chosen carefully.",
      development: "Plan expressive interventions aligned with clear motivational objectives."
    },
    "A-B-A": {
      label: "Measured Orator",
      logic: "Balances calm analysis with occasional passionate interventions to drive focus.",
      cues: "Clarity first, energy to mobilize when needed.",
      impact: "Combines trust with engagement.",
      risk: "May hesitate to express fully when authenticity could inspire.",
      development: "Practice authentic expressive techniques that align with personal style."
    },
    "A-B-B": {
      label: "Strategic Performer",
      logic: "Primarily expressive in engagement but returns to composure for execution.",
      cues: "High-energy launches followed by steady operational follow-through.",
      impact: "Strong initial mobilization and disciplined delivery.",
      risk: "Energy fluctuations can create perception mismatch.",
      development: "Map cadence of expression to project lifecycle to smooth expectations."
    },
    "B-A-A": {
      label: "Warm Realist",
      logic: "Generally expressive but grounds messages with stable facts and plans.",
      cues: "Emphatic storytelling anchored in evidence.",
      impact: "Builds rapport while maintaining credibility.",
      risk: "Expressions may be perceived as scripted if not authentic.",
      development: "Encourage spontaneous, vulnerability-based sharing to enhance authenticity."
    },
    "B-A-B": {
      label: "Engaging Analyst",
      logic: "Uses expressiveness to clarify and persuade while preserving analytical rigor.",
      cues: "Passionate rationale, vivid metaphors, data-backed claims.",
      impact: "High persuasion and trust-building potential.",
      risk: "Risk of emotional exhaustion in sustained high-engagement contexts.",
      development: "Practice economy of passion—choose moments that yield maximal impact."
    },
    "B-B-A": {
      label: "Expressive Stabilizer",
      logic: "Expressive by default but conscientious about maintaining composure in crises.",
      cues: "Warm, active communication with contingency calm.",
      impact: "High morale and executive reliability.",
      risk: "May over-energize teams leading to fatigue.",
      development: "Balance energy with structured recovery and clarity on limits."
    },
    "B-B-B": {
      label: "Radiant Communicator",
      logic: "Consistently expressive, uses emotion and narrative to lead and inspire.",
      cues: "High energy, vivid language, visible enthusiasm.",
      impact: "Strong mobilization and culture-shaping influence.",
      risk: "May overshadow quieter contributions or be seen as theatrical if not grounded.",
      development: "Pair expressive leadership with explicit recognition mechanics for quieter performers."
    }
  },

  "ShortTerm-LongTermFocused": {
    "A-A-A": {
      label: "Legacy Builder",
      logic: "Committed to long-term compounding value and organizational durability.",
      cues: "Invests in capability, deprioritizes ephemeral gains.",
      impact: "Creates durable advantage and strategic optionality.",
      risk: "Short-term resource constraints and stakeholder impatience.",
      development: "Deliver visible interim milestones to demonstrate progress."
    },
    "A-A-B": {
      label: "Strategic Operator",
      logic: "Long-term orientation tempered with tactical initiatives to maintain momentum.",
      cues: "Roadmaps with near-term milestones.",
      impact: "Sustained transformation with continued stakeholder support.",
      risk: "Potential complexity in balancing horizon trade-offs.",
      development: "Use milestone-aligned communication to keep stakeholders confident."
    },
    "A-B-A": {
      label: "Patient Accelerator",
      logic: "Prefers durable investments but uses short bursts of delivery to validate approach.",
      cues: "Pilot-driven scaling with long-range vision.",
      impact: "Reduces risk while building assets iteratively.",
      risk: "May underperform when rapid market capture is required.",
      development: "Introduce targeted quick wins that feed strategic narratives."
    },
    "A-B-B": {
      label: "Planned Executor",
      logic: "Plans for the long term but adapts near-term actions to secure resources.",
      cues: "Strategic investments phased with tactical funding windows.",
      impact: "Viable long-range plans with manageable short-term wins.",
      risk: "Coordination complexity across investment horizons.",
      development: "Create a governance ladder that gates long-term investments through short-term KPIs."
    },
    "B-A-A": {
      label: "Short-term Achiever",
      logic: "Delivers immediate results and leverages them to fund future work.",
      cues: "Sprint focus, rapid ROI, tactical wins.",
      impact: "Secures resources and credibility quickly.",
      risk: "May underinvest in foundational capabilities causing future friction.",
      development: "Allocate a fixed percentage of returns to capability building automatically."
    },
    "B-A-B": {
      label: "Balanced Performer",
      logic: "Focuses on present outcomes while seeding strategic initiatives modestly.",
      cues: "Short-term wins with low-level strategic pilots.",
      impact: "Steady performance and nascent future positioning.",
      risk: "Strategic initiatives may lack sufficient scale to matter.",
      development: "Scale strategic pilots rapidly once validated by short-term wins."
    },
    "B-B-A": {
      label: "Responsive Operator",
      logic: "Optimizes for current cycles but can pivot toward long-term when clear signals appear.",
      cues: "Reactive resource allocation with opportunistic endurance.",
      impact: "Good at sustaining current operations while preserving optionality.",
      risk: "May be late to invest in structural advantage.",
      development: "Set predefined triggers to move resources into long-term builds swiftly."
    },
    "B-B-B": {
      label: "Quarterly Performer",
      logic: "Maximizes immediate metrics and short-horizon returns as primary objective.",
      cues: "High cadence delivery and visible KPIs.",
      impact: "Strong near-term performance and stakeholder satisfaction.",
      risk: "Vulnerability to future shocks and capability gaps.",
      development: "Automate reinvestment rules to ensure some proceeds fund long-term resilience."
    }
  }


};