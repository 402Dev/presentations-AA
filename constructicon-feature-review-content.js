(function () {
  const BASE_FEATURE_COUNT = 2;
  const GENERATED_FEATURES = [
    {
      key: "intonation-stress",
      title: "The Intonation & Stress Profile",
      category: "Form",
      level: "Whole construction + slot",
      lead: "Prosodic feature: logs the contour across the construction and the slot that carries the strongest stress.",
      question:
        "Which pitch and stress cues are grammatically contrastive here?",
      definitionLabel: "Prosodic definition",
      definition:
        "The Intonation & Stress Profile stores a whole-construction contour plus any slot that carries contrastive or emphatic stress.",
      contrastLabel: "Two prosodic layers",
      contrastItems: [
        {
          label: "Global contour",
          title: "Whole-construction melody",
          copy: "Rise, fall, or flat contour marks question, closure, or continuation.",
        },
        {
          label: "Stress anchor",
          title: "Local prominence",
          copy: "A specific slot carries default, contrastive, or emphatic stress.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[contour = terminal_rise | stressed_node = leaving | stress = contrastive]",
      exampleCopy:
        "Same words, different profile: prosody can shift doubt, correction, or insistence.",
      examples: [
        {
          badge: "Contour",
          name: "Question vs. doubt",
          code: "[rise | leaving]",
          example: '"You\'re LEAVING?"',
          roleLines: [
            { label: "Contour", value: "Rise keeps the turn open." },
            { label: "Stress", value: "Leaving carries contrastive doubt." },
          ],
        },
        {
          badge: "Stress",
          name: "Correction cue",
          code: "[fall | you]",
          example: '"YOU said it, not me."',
          roleLines: [
            { label: "Contour", value: "Fall closes the statement." },
            { label: "Stress", value: "Pronoun focus marks correction." },
          ],
        },
      ],
      constructiconHead: "Prosody-aware storage",
      constructiconBullets: [
        "Keep one topology and log when prosody flips the meaning.",
      ],
      queryHead: "Query by contour",
      queryBullets: [
        "Find constructions where rise, fall, or stress anchoring changes interpretation.",
      ],
      queryChips: [
        "contour = rise | fall | flat",
        "stress = default | contrastive | emphatic",
        "prosody separate from topology",
      ],
      reviewPrompt:
        "Would we compare constructions through prosodic contrast, or would a separate phonology layer do the same job better?",
      feedbackDefinition:
        "Prosodic schema of whole-construction contour and local stress anchors",
      feedbackUtility:
        "Separates prosodic contrast from shared topology for comparison and query",
    },
    {
      key: "nesting-recursion",
      title: "The Nesting & Recursion Profile",
      category: "Form",
      level: "Whole construction",
      lead: "Structural feature: states whether the construction can stand alone, embed inside another node, or repeat itself.",
      question: "Can this construction root, embed, or recurse?",
      definitionLabel: "Structural definition",
      definition:
        "The Nesting & Recursion Profile records whether a construction is root-only, which parent domains can host it, and whether self-embedding is allowed.",
      contrastLabel: "Two structural levers",
      contrastItems: [
        {
          label: "Root only",
          title: "Top-level only",
          copy: "The construction may anchor the graph but may not fill another construction's slot.",
        },
        {
          label: "Recursive",
          title: "Self-nesting allowed",
          copy: "The construction may embed another instance of itself without breaking the pattern.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[root_only = false | embeddable_domains = {complement, nominal} | recursive = true]",
      exampleCopy:
        "One profile rules out illegal inserts before they ever reach the parse.",
      examples: [
        {
          badge: "English",
          name: "Direct vs. indirect question",
          code: "I wonder [if she knows].",
          example: "Direct questions stay root-only; indirect questions embed.",
          roleLines: [
            {
              label: "Host",
              value: "Complement slot admits the indirect form.",
            },
            { label: "Root", value: "Direct question remains top-level only." },
          ],
        },
        {
          badge: "Dutch",
          name: "V2 vs. subordinate clause",
          code: "V2 root | subordinate complement",
          example:
            "V2 stays root-only; subordinate clauses fill complement slots.",
          roleLines: [
            { label: "Root", value: "V2 anchors the clause from the top." },
            {
              label: "Embed",
              value: "Subordinate form fits under a parent node.",
            },
          ],
        },
      ],
      constructiconHead: "Graph-safe structure",
      constructiconBullets: [
        "Reject illegal embeds before they become separate construction rows.",
      ],
      queryHead: "Select by embedding profile",
      queryBullets: [
        "Retrieve only root-only, embeddable, or recursive constructions as needed.",
      ],
      queryChips: [
        "root_only = true | false",
        "recursive = true | false",
        "embeddable_domains = complement, nominal",
      ],
      reviewPrompt:
        "Does this profile clarify the construction inventory, or does it only repackage standard embedding constraints?",
      feedbackDefinition:
        "Structural profile of root-only status, embeddable domains, and recursion",
      feedbackUtility:
        "Prunes impossible graph edges and improves construction selection",
    },
    {
      key: "morphosyntactic-flexibility",
      title: "The Morphosyntactic Flexibility Index",
      category: "Form",
      level: "Whole construction",
      lead: "Flexibility feature: marks which transformations preserve the construction and which ones destroy it.",
      question: "Which transformations preserve the construction's meaning?",
      definitionLabel: "Flexibility definition",
      definition:
        "The Morphosyntactic Flexibility Index marks whether the construction is fully frozen or selectively flexible, and which operations stay blocked.",
      contrastLabel: "Two flexibility states",
      contrastItems: [
        {
          label: "Frozen",
          title: "Invariant form",
          copy: "The construction collapses as soon as standard operations mutate it.",
        },
        {
          label: "Selective",
          title: "Some changes survive",
          copy: "Specific operations remain blocked while tense or aspect may still shift.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[frozen = partial | blocked = {passive, plural} | allowed = {tense_shift}]",
      exampleCopy:
        "The same string can behave like a normal phrase or like a protected idiom.",
      examples: [
        {
          badge: "English",
          name: "Kick the bucket",
          code: "kick the bucket",
          example:
            "Passivization and pluralization kill the idiom; tense shift survives.",
          roleLines: [
            {
              label: "Blocked",
              value: "Passive and plural forms destroy the idiomatic reading.",
            },
            {
              label: "Allowed",
              value: "Past tense keeps the same idiomatic meaning.",
            },
          ],
        },
        {
          badge: "Dutch",
          name: "Op hete kolen zitten",
          code: "op hete kolen zitten",
          example:
            "Topicalization and scrambling disrupt the constructional reading.",
          roleLines: [
            {
              label: "Blocked",
              value: "Word-order freedom drops away in the idiomatic use.",
            },
            {
              label: "Cue",
              value: "Rigidity helps separate idiom from literal syntax.",
            },
          ],
        },
      ],
      constructiconHead: "Idiom-safe storage",
      constructiconBullets: [
        "Keep literal and idiomatic parses apart by their mutation limits.",
      ],
      queryHead: "Search by blocked operations",
      queryBullets: [
        "Find constructions that ban passives, pluralization, clefts, or other transforms.",
      ],
      queryChips: [
        "blocked = passive | plural",
        "allowed = tense_shift",
        "frozen = full | partial",
      ],
      reviewPrompt:
        "Does transformation-tracking genuinely improve parsing and comparison, or is it better treated as a separate idiom module?",
      feedbackDefinition:
        "Index of blocked and allowed transformations for one construction",
      feedbackUtility:
        "Separates idiomatic rigidity from ordinary morphosyntactic variation",
    },
    {
      key: "collostructional-gravity",
      title: "The Collostructional Gravity Vector",
      category: "Form",
      level: "Slot level",
      lead: "Slot-level feature: records which lexemes a slot statistically attracts and which ones it repels.",
      question: "Which lexemes are statistically drawn to this slot?",
      definitionLabel: "Slot-level definition",
      definition:
        "The Collostructional Gravity Vector stores attracted collexemes, repelled collexemes, and the score attached to each slot-lexeme pairing.",
      contrastLabel: "Two lexical forces",
      contrastItems: [
        {
          label: "Attracted",
          title: "High-probability fillers",
          copy: "These lemmas repeatedly dock into the slot with strong native-speaker preference.",
        },
        {
          label: "Repelled",
          title: "Legal but unnatural fillers",
          copy: "These lemmas remain grammatically possible but statistically wrong for the slot.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote: "[building(15.2), car(12.8)] | repelled = {water, concept}",
      exampleCopy:
        "The slot is not just open. It has a measurable lexical pull.",
      examples: [
        {
          badge: "English",
          name: "Set X on fire",
          code: "set [X] on fire",
          example: "Building and car fit naturally; water or concept do not.",
          roleLines: [
            {
              label: "Attracted",
              value: "Concrete burnable nouns score highest.",
            },
            {
              label: "Repelled",
              value:
                "Abstract nouns stay structurally legal but pragmatically wrong.",
            },
          ],
        },
        {
          badge: "Farsi",
          name: "Support verb pairing",
          code: "N + zadan",
          example:
            "Specific nouns cluster strongly around one light verb rather than another.",
          roleLines: [
            {
              label: "Slot",
              value: "The noun slot has preferred lexical partners.",
            },
            {
              label: "Score",
              value: "Weights turn binary grammar into a probabilistic map.",
            },
          ],
        },
      ],
      constructiconHead: "Weighted slot knowledge",
      constructiconBullets: [
        "Attach preferred and avoided lexemes directly to one open slot.",
      ],
      queryHead: "Naturalness grading",
      queryBullets: [
        "Surface syntactically legal but statistically unlikely slot fillers.",
      ],
      queryChips: [
        "score > 10",
        "repelled = lexical mismatch",
        "slot-level probability",
      ],
      reviewPrompt:
        "Does probabilistic slot knowledge belong in the core constructicon, or should corpus frequency live in a separate statistics layer?",
      feedbackDefinition:
        "Vector of attracted and repelled lexemes for one construction slot",
      feedbackUtility:
        "Adds probabilistic slot preferences for comparison, pedagogy, and query",
    },
    {
      key: "slot-elision",
      title: "The Slot Elision Profile",
      category: "Form",
      level: "Slot level",
      lead: "Slot-level feature: states when a component may stay silent and how the missing material is recovered.",
      question: "When may a slot stay silent and still count?",
      definitionLabel: "Slot-level definition",
      definition:
        "The Slot Elision Profile marks whether a slot may be unspoken, which kind of elision it shows, and how recovery works.",
      contrastLabel: "Two elision levers",
      contrastItems: [
        {
          label: "Elision",
          title: "Silent but licensed",
          copy: "The slot may disappear from the string while remaining present in the schema.",
        },
        {
          label: "Recovery",
          title: "How the slot returns",
          copy: "Morphology, discourse context, or a hardcoded default reconstructs the missing node.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        '[elision = true | type = grammatical | recovery = default("you")]',
      exampleCopy:
        "A silent slot still needs an explicit recovery rule if the schema is going to stay queryable.",
      examples: [
        {
          badge: "English",
          name: "Imperative subject",
          code: "Push it to main.",
          example:
            "The subject NP is absent, but the construction still resolves to you.",
          roleLines: [
            { label: "Type", value: "Grammatical subject ellipsis." },
            { label: "Recovery", value: "Default second-person subject." },
          ],
        },
        {
          badge: "Farsi",
          name: "Pro-drop subject",
          code: "Ketab ro khundam.",
          example: "The verb ending recovers a first-person singular subject.",
          roleLines: [
            { label: "Type", value: "Morphologically licensed pro-drop." },
            {
              label: "Recovery",
              value: "Agreement suffix supplies the missing node.",
            },
          ],
        },
      ],
      constructiconHead: "No duplicate rows",
      constructiconBullets: [
        "Store one construction and recover silent slots instead of duplicating variants.",
      ],
      queryHead: "Recover missing nodes",
      queryBullets: [
        "Join imperatives, pro-drop, and silent-argument patterns without parser errors.",
      ],
      queryChips: [
        "elision = true | false",
        "recovery = morphology | context | default",
        "silent slot still counted",
      ],
      reviewPrompt:
        "Does slot-level elision reduce redundancy and improve multilingual comparison, or does it blur syntax with morphology too aggressively?",
      feedbackDefinition:
        "Profile of whether a slot may be silent and how it is recovered",
      feedbackUtility:
        "Normalizes pro-drop and silent-slot patterns without duplicating constructions",
    },
    {
      key: "semantic-frame-anchor",
      title: "The Semantic Frame Anchor",
      category: "Meaning",
      level: "Whole construction",
      lead: "Meaning feature: identifies which event frame the construction profiles and which participants receive the spotlight.",
      question:
        "Which event frame is this construction anchoring, and what gets the camera focus?",
      definitionLabel: "Meaning-level definition",
      definition:
        "The Semantic Frame Anchor stores a frame ID plus a split between spotlighted participants and backgrounded scene elements.",
      contrastLabel: "Two semantic levers",
      contrastItems: [
        {
          label: "Frame ID",
          title: "The event scene",
          copy: "Names the real-world event model that the construction activates.",
        },
        {
          label: "Camera focus",
          title: "Foreground vs. background",
          copy: "Records which participants the grammar puts on screen and which remain implicit.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        '"He baked me a cake" -> frame = ACTUAL_TRANSFER | focus = Creator, Recipient, Object',
      exampleCopy:
        "The construction can override a verb's default scene and impose a different frame.",
      examples: [
        {
          badge: "English",
          name: "Ditransitive coercion",
          code: "He baked me a cake.",
          example: "Bake is forced into transfer, not bare creation.",
          roleLines: [
            {
              label: "Frame",
              value: "ACTUAL_TRANSFER replaces simple creation.",
            },
            {
              label: "Focus",
              value: "Creator, recipient, and object stay foregrounded.",
            },
          ],
        },
        {
          badge: "Farsi",
          name: "Experiencer copula",
          code: "sard-am-e",
          example:
            "The construction profiles a physiological state rather than active causation.",
          roleLines: [
            {
              label: "Frame",
              value: "PHYSIOLOGICAL_STATE anchors the meaning.",
            },
            {
              label: "Focus",
              value: "Experiencer stays central; cause stays backgrounded.",
            },
          ],
        },
      ],
      constructiconHead: "Cross-language semantic hub",
      constructiconBullets: [
        "Map different surface forms inward to the same event node.",
      ],
      queryHead: "Search by frame identity",
      queryBullets: [
        "Retrieve every construction anchored to the same event frame.",
      ],
      queryChips: [
        "frame_id = ACTUAL_TRANSFER",
        "focus = recipient",
        "backgrounded = cause",
      ],
      reviewPrompt:
        "Does separating event identity from grammatical spotlight give the constructicon a reusable semantic anchor that survives translation?",
      feedbackDefinition:
        "Frame ID plus participant spotlight for the event a construction profiles",
      feedbackUtility:
        "Creates a reusable semantic hub across languages and constructions",
    },
    {
      key: "event-shape-profile",
      title: "The Event Shape Profile",
      category: "Meaning",
      level: "Whole construction",
      lead: "Temporal feature: records where the event ends and how time unfolds inside it.",
      question:
        "How does the event unfold internally, and where is its finish line?",
      definitionLabel: "Meaning-level definition",
      definition:
        "The Event Shape Profile stores boundary state and internal rhythm as separate dimensions of one event.",
      contrastLabel: "Two temporal levers",
      contrastItems: [
        {
          label: "Boundary",
          title: "Where the event ends",
          copy: "Bounded, unbounded, or already reached status marks the finish-line logic.",
        },
        {
          label: "Rhythm",
          title: "How time ticks inside",
          copy: "Punctual, continuous, iterative, or habitual rhythm captures internal playback.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote: "[boundary = unbounded | rhythm = continuous]",
      exampleCopy:
        "Temporal geometry becomes explicit instead of hiding inside aspect labels alone.",
      examples: [
        {
          badge: "English",
          name: "Progressive override",
          code: "The engine is coughing.",
          example:
            "A punctual dictionary sense is coerced into an ongoing loop.",
          roleLines: [
            {
              label: "Boundary",
              value: "Unbounded while the event is still in progress.",
            },
            {
              label: "Rhythm",
              value: "Continuous shell forces iterative interpretation.",
            },
          ],
        },
        {
          badge: "Farsi",
          name: "Imperfective split",
          code: "Ali mi-nevesht.",
          example:
            "The same form can lean toward continuous or habitual reading.",
          roleLines: [
            { label: "Boundary", value: "No completion point is asserted." },
            {
              label: "Rhythm",
              value: "Context chooses continuous vs. habitual playback.",
            },
          ],
        },
      ],
      constructiconHead: "Temporal geometry layer",
      constructiconBullets: [
        "Compare constructions by event shape instead of by tense labels alone.",
      ],
      queryHead: "Search by boundary or rhythm",
      queryBullets: [
        "Retrieve bounded, habitual, or iterative constructions across languages.",
      ],
      queryChips: [
        "boundary = bounded | unbounded | reached",
        "rhythm = punctual | continuous | iterative | habitual",
      ],
      reviewPrompt:
        "Should temporal shape stay separate from frame identity, or is it cleaner to fold time into the semantic frame layer itself?",
      feedbackDefinition:
        "Temporal profile of event boundary state and internal rhythm",
      feedbackUtility:
        "Makes temporal geometry explicit for comparison and cross-language query",
    },
    {
      key: "macro-event-proposition",
      title: "The Macro-Event Proposition",
      category: "Meaning",
      level: "Whole construction",
      lead: "Logical feature: turns the construction into an explicit proposition with stated entailments.",
      question:
        "What proposition does the construction compute, and what must follow from it?",
      definitionLabel: "Meaning-level definition",
      definition:
        "The Macro-Event Proposition stores a proposition template, a causal direction, and the entailments that fire once the construction resolves.",
      contrastLabel: "Two logical layers",
      contrastItems: [
        {
          label: "Template",
          title: "The logical contract",
          copy: "A variable-based proposition spells out who does what to whom.",
        },
        {
          label: "Entailments",
          title: "Guaranteed fallout",
          copy: "The construction contributes consequences that can be asserted without rereading the string.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[AFFECTOR causes RECIPIENT to act on THEME] -> entailment: RECIPIENT now obligated",
      exampleCopy:
        "The construction becomes a reusable logical equation rather than a loose gloss.",
      examples: [
        {
          badge: "English",
          name: "Request as causation",
          code: "She asked him to come.",
          example:
            "The construction encodes causal pressure, not just reported speech.",
          roleLines: [
            { label: "Direction", value: "A causes or pressures B." },
            {
              label: "Entailment",
              value: "The recipient enters an obligation space.",
            },
          ],
        },
        {
          badge: "Dutch",
          name: "Way construction proposition",
          code: "Hij baant zich een weg.",
          example:
            "The construction encodes path-creation through effort and obstacle.",
          roleLines: [
            {
              label: "Template",
              value: "Actor creates path through obstacle by action.",
            },
            {
              label: "Result",
              value: "Traversal is asserted as part of the proposition.",
            },
          ],
        },
      ],
      constructiconHead: "Logic in the schema",
      constructiconBullets: [
        "Store a construction's proposition as graphable logic rather than free paraphrase.",
      ],
      queryHead: "Search by causal direction",
      queryBullets: [
        "Retrieve causative, experiential, or equative propositions across languages.",
      ],
      queryChips: [
        "causal_direction = causes | experiences | equals",
        "entailment = possession | obligation | traversal",
      ],
      reviewPrompt:
        "Does formalizing the construction as logic improve storage and inference enough to justify the extra schema layer?",
      feedbackDefinition:
        "Logical proposition template with causal direction and entailments",
      feedbackUtility:
        "Turns construction meaning into reusable logical structure and queryable consequences",
    },
    {
      key: "pragmatic-intent",
      title: "The Pragmatic Intent Profile",
      category: "Meaning",
      level: "Whole construction",
      lead: "Pragmatic feature: records what social act the speaker performs and how gently or harshly it is delivered.",
      question:
        "What social act is the speaker performing, and with what register?",
      definitionLabel: "Meaning-level definition",
      definition:
        "The Pragmatic Intent Profile stores illocutionary force, epistemic stance, and pragmatic polarity.",
      contrastLabel: "Two pragmatic layers",
      contrastItems: [
        {
          label: "Speech act",
          title: "What the utterance does",
          copy: "Directive, commissive, expressive, or declaration values capture the core act.",
        },
        {
          label: "Register",
          title: "How the act lands socially",
          copy: "Mitigated, aggravated, or deferential delivery changes the social force without changing the words.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[force = directive | stance = dubitative | polarity = mitigated]",
      exampleCopy:
        "Interrogative form and directive intent can diverge cleanly once pragmatics is explicit.",
      examples: [
        {
          badge: "Dutch",
          name: "Mitigated command",
          code: "Kijk eens even naar die code.",
          example:
            "Particles soften the directive into a suggestion-like request.",
          roleLines: [
            { label: "Force", value: "Directive act remains intact." },
            {
              label: "Register",
              value: "Mitigation lowers the social pressure.",
            },
          ],
        },
        {
          badge: "Farsi",
          name: "Ta'arof token",
          code: "Ghorbunet beram.",
          example: "The literal wording yields to a ritualized expressive act.",
          roleLines: [
            {
              label: "Force",
              value: "Expressive rather than literal sacrifice.",
            },
            {
              label: "Register",
              value: "High deference is built into the construction.",
            },
          ],
        },
      ],
      constructiconHead: "Form vs. social action",
      constructiconBullets: [
        "Keep interrogative form separate from directive, expressive, or deferential function.",
      ],
      queryHead: "Search by pragmatic force",
      queryBullets: [
        "Retrieve polite directives or deferential formulas without matching surface syntax.",
      ],
      queryChips: [
        "force = directive | expressive",
        "polarity = mitigated | aggravated | deferential",
      ],
      reviewPrompt:
        "Should pragmatic intent stay in the Meaning layer, or does it deserve a separate social-behavioral layer of its own?",
      feedbackDefinition:
        "Profile of illocutionary force, stance, and pragmatic polarity",
      feedbackUtility:
        "Separates social action from surface form for comparison and query",
    },
    {
      key: "force-dynamics",
      title: "The Force Dynamics Matrix",
      category: "Meaning",
      level: "Whole construction",
      lead: "Causal feature: tracks what tends toward action, what resists it, and what state wins.",
      question: "What pushes, what resists, and what finally gives?",
      definitionLabel: "Meaning-level definition",
      definition:
        "The Force Dynamics Matrix stores the focal tendency, the opposing or enabling force, and the resulting state.",
      contrastLabel: "Two causal roles",
      contrastItems: [
        {
          label: "Agonist",
          title: "Focal tendency",
          copy: "The main entity leans toward motion, rest, or some other baseline path.",
        },
        {
          label: "Antagonist",
          title: "Resistance or release",
          copy: "Another force blocks, permits, sustains, or removes the barrier around the agonist.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[agonist = towards_motion | antagonist = barrier_removed | result = action_occurs]",
      exampleCopy:
        "Permission, coercion, endurance, and relief become distinct force geometries instead of one vague causative field.",
      examples: [
        {
          badge: "Dutch",
          name: "Permission vs. coercion",
          code: "laten vs. doen",
          example: "Different causatives encode release vs. active force.",
          roleLines: [
            {
              label: "Antagonist",
              value: "Barrier removal differs from direct pressure.",
            },
            {
              label: "Result",
              value: "Action occurs through different causal shapes.",
            },
          ],
        },
        {
          badge: "Farsi",
          name: "Managed action",
          code: "Tavunestam project ro tamum konam.",
          example:
            "The construction profiles victory over internal difficulty.",
          roleLines: [
            {
              label: "Antagonist",
              value: "Internal difficulty acts as the resisting force.",
            },
            {
              label: "Result",
              value: "Completion signals that the force was overcome.",
            },
          ],
        },
      ],
      constructiconHead: "Causal geometry layer",
      constructiconBullets: [
        "Distinguish permission, coercion, endurance, and release without changing the core frame.",
      ],
      queryHead: "Search by force pattern",
      queryBullets: [
        "Retrieve permission, blockage, or endurance constructions by force vector alone.",
      ],
      queryChips: [
        "agonist = motion | rest",
        "antagonist = stronger | barrier_removed | internal_difficulty",
        "result = occurs | prevented | maintained",
      ],
      reviewPrompt:
        "Does force geometry add a useful meaning layer beyond proposition and frame, or does it duplicate distinctions already visible elsewhere?",
      feedbackDefinition:
        "Matrix of focal tendency, opposing force, and resulting state",
      feedbackUtility:
        "Makes permission, coercion, and resistance queryable as shared causal schemas",
    },
    {
      key: "taxonomic-inheritance",
      title: "The Taxonomic Inheritance Matrix",
      category: "Relational",
      level: "Construction network",
      lead: "Network feature: stores abstract rules high in the graph so children inherit instead of restating them.",
      question:
        "Which properties live high in the network, and which stay local to a child node?",
      definitionLabel: "Relational definition",
      definition:
        "The Taxonomic Inheritance Matrix links children to parent nodes and lets abstract rules flow downward unless a local override blocks them.",
      contrastLabel: "Two inheritance roles",
      contrastItems: [
        {
          label: "Parent rule",
          title: "Store abstraction once",
          copy: "High-level nodes keep shared constraints so child entries do not rewrite them.",
        },
        {
          label: "Child override",
          title: "Keep local exceptions local",
          copy: "A child only stores what departs from inherited defaults.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[ancestor_node_ids | relation = instance | inheritance = default_with_override]",
      exampleCopy:
        "The graph becomes a reusable routing table rather than a flat list of repeated schemas.",
      examples: [
        {
          badge: "Network",
          name: "Inheritance schema",
          code: "ancestor_node_ids -> relation_types -> policy",
          example:
            "Parent nodes carry shared logic; children only log what is different.",
          roleLines: [
            {
              label: "Parent",
              value: "Abstract constraints stay in one high node.",
            },
            {
              label: "Child",
              value: "Only idiosyncratic material remains local.",
            },
          ],
        },
        {
          badge: "Farsi",
          name: "Light-verb family",
          code: "shared pairing defaults",
          example:
            "Related patterns inherit common pairing behavior while storing local quirks separately.",
          roleLines: [
            {
              label: "Inheritance",
              value: "Shared behavior flows down the family.",
            },
            {
              label: "Override",
              value: "Specific pairings remain child-specific.",
            },
          ],
        },
      ],
      constructiconHead: "Less schema duplication",
      constructiconBullets: [
        "Keep abstract rules high and let children inherit instead of repeating them.",
      ],
      queryHead: "Traverse inheritance directly",
      queryBullets: [
        "Retrieve every child that inherits or overrides one shared rule.",
      ],
      queryChips: [
        "relation = instance | metaphorical | subpart",
        "inheritance = default_with_override",
      ],
      reviewPrompt:
        "Does the inheritance matrix actually reduce redundancy, or does it only restate hierarchy that other schema layers already imply?",
      feedbackDefinition:
        "Graph of inherited parent rules and local child overrides",
      feedbackUtility:
        "Reduces redundancy and makes inherited constraints directly queryable",
    },
    {
      key: "paradigm-cluster",
      title: "The Paradigm Cluster Matrix",
      category: "Relational",
      level: "Construction network",
      lead: "Family feature: groups constructions into one functional system even when they live on different branches.",
      question:
        "Which constructions belong to one family even if they do not share one parent?",
      definitionLabel: "Relational definition",
      definition:
        "The Paradigm Cluster Matrix adds a lateral family layer on top of vertical inheritance so functionally allied constructions can stay linked.",
      contrastLabel: "Two network views",
      contrastItems: [
        {
          label: "Vertical tree",
          title: "Ancestry only",
          copy: "A pure hierarchy captures descent but misses whole functional systems spread across branches.",
        },
        {
          label: "Horizontal family",
          title: "Shared system role",
          copy: "A cluster ties distant nodes into one grammatical neighborhood without erasing their ancestry.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[family = future | members = will, going_to, present_progressive, simple_present]",
      exampleCopy:
        "The family matrix explains system membership where inheritance alone stays too narrow.",
      examples: [
        {
          badge: "System",
          name: "Future family",
          code: "will | going to | present progressive | simple present",
          example:
            "Multiple English futures live on different branches but one functional family.",
          roleLines: [
            {
              label: "Role",
              value: "All members serve one future-time system.",
            },
            {
              label: "Tree",
              value: "Their morphosyntax does not force one shared parent.",
            },
          ],
        },
        {
          badge: "System",
          name: "Passive family",
          code: "be-passive | get-passive | concealed passive",
          example:
            "Different passive constructions still cluster as one voice system.",
          roleLines: [
            { label: "Role", value: "Voice unifies the family laterally." },
            {
              label: "Tree",
              value: "Inheritance still explains each member's own shape.",
            },
          ],
        },
      ],
      constructiconHead: "Whole systems, not just branches",
      constructiconBullets: [
        "Model grammatical families without forcing unrelated forms under one abstract parent.",
      ],
      queryHead: "Search by family membership",
      queryBullets: [
        "Retrieve all members of one functional family even when topology differs.",
      ],
      queryChips: ["family = future | passive", "cluster_role = system_member"],
      reviewPrompt:
        "Does the family matrix capture real grammatical neighborhoods that inheritance misses, or does it duplicate work already done by the hierarchy?",
      feedbackDefinition:
        "Lateral family matrix connecting functionally allied constructions",
      feedbackUtility:
        "Links scattered constructions into one queryable grammatical system",
    },
    {
      key: "entrenchment-productivity",
      title: "The Entrenchment & Productivity Matrix",
      category: "Relational",
      level: "Usage profile",
      lead: "Usage feature: separates repeated habit from open generative power.",
      question: "Is this construction a fossilized habit or a live algorithm?",
      definitionLabel: "Relational definition",
      definition:
        "The Entrenchment & Productivity Matrix tracks token frequency and type frequency separately so rigid habits and open schemas do not collapse into one score.",
      contrastLabel: "Two usage masses",
      contrastItems: [
        {
          label: "Entrenchment",
          title: "Repeated exact pattern",
          copy: "High token mass marks a habit that recurs again and again in the same form.",
        },
        {
          label: "Productivity",
          title: "Open slot growth",
          copy: "High type mass marks a schema that still welcomes many new fillers.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[token_mass = high | type_mass = low | status = fossilized]",
      exampleCopy:
        "The matrix distinguishes a memorized habit from a still-productive constructional algorithm.",
      examples: [
        {
          badge: "Dutch",
          name: "Strong verb residue",
          code: "high token | low type",
          example:
            "A familiar set stays deeply entrenched without inviting new members.",
          roleLines: [
            {
              label: "Entrenchment",
              value: "High repetition keeps the pattern cognitively heavy.",
            },
            {
              label: "Productivity",
              value: "Very little room remains for novel expansion.",
            },
          ],
        },
        {
          badge: "English",
          name: "Way construction",
          code: "moderate token | high type",
          example:
            "The pattern remains open enough to attract fresh verbs and paths.",
          roleLines: [
            {
              label: "Entrenchment",
              value: "The pattern is known but not frozen.",
            },
            {
              label: "Productivity",
              value: "Open slots still accept varied fillers.",
            },
          ],
        },
      ],
      constructiconHead: "Vitality as data",
      constructiconBullets: [
        "Tag which constructions behave like habits and which behave like live algorithms.",
      ],
      queryHead: "Search by vitality",
      queryBullets: [
        "Retrieve only highly productive or highly entrenched constructions for comparison.",
      ],
      queryChips: [
        "token_mass = high | low",
        "type_mass = high | low",
        "status = fossilized | productive",
      ],
      reviewPrompt:
        "Does separating entrenchment from productivity give us actionable knowledge about constructional vitality, or is one usage score enough?",
      feedbackDefinition:
        "Dual usage matrix of token entrenchment and type productivity",
      feedbackUtility:
        "Distinguishes fossilized habits from productive schemas for comparison and query",
    },
    {
      key: "core-administrative-identity",
      title: "The Core Administrative Identity",
      category: "Meta",
      level: "Metadata",
      lead: "Meta feature: gives every construction a stable machine key and a searchable human handle.",
      question:
        "How do we uniquely name, retrieve, and silo this construction?",
      definitionLabel: "Meta-level definition",
      definition:
        "Core Administrative Identity stores a UUID, a human-readable construction name, and a language namespace.",
      contrastLabel: "Two identity anchors",
      contrastItems: [
        {
          label: "UUID",
          title: "Machine-stable key",
          copy: "The immutable identifier that keeps rows stable across edits, exports, and joins.",
        },
        {
          label: "Handle",
          title: "Human-readable name",
          copy: "The conventional label and language silo that let humans search the constructicon quickly.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "FIND cxn WHERE cxn_name = 'The_Ditransitive' AND language_silo = 'en-US'",
      exampleCopy:
        "Identity is what keeps one multilingual constructicon from collapsing into namespace collisions.",
      examples: [
        {
          badge: "English",
          name: "Stable handle",
          code: "The_Ditransitive | en-US",
          example:
            "A conventional name stays easy to search while the UUID stays fixed underneath.",
          roleLines: [
            { label: "Handle", value: "Human-readable retrieval path." },
            { label: "UUID", value: "Machine identity never changes." },
          ],
        },
        {
          badge: "Dutch",
          name: "Language silo",
          code: "Dutch_V2_Subordinate | nl-NL",
          example:
            "The same theoretical label can stay isolated by language namespace.",
          roleLines: [
            { label: "Silo", value: "Language namespace blocks collisions." },
            {
              label: "Query",
              value: "Human handle still retrieves the row fast.",
            },
          ],
        },
      ],
      constructiconHead: "Collision-free identity",
      constructiconBullets: [
        "Keep multilingual constructicon entries unique without sacrificing readable names.",
      ],
      queryHead: "Reliable lookup",
      queryBullets: [
        "Retrieve constructions by handle while keeping backend joins anchored to UUIDs.",
      ],
      queryChips: [
        "uuid = stable",
        "cxn_name = searchable",
        "language_silo = en-US | nl-NL | fa-IR",
      ],
      reviewPrompt:
        "Does the identity layer genuinely prevent namespace collisions and retrieval errors, or would lighter admin tagging already be enough?",
      feedbackDefinition:
        "Stable machine key plus human-readable construction handle and language namespace",
      feedbackUtility:
        "Prevents namespace collisions and enables reliable lookup across languages",
    },
    {
      key: "stratum-vector",
      title: "The Stratum Vector",
      category: "Meta",
      level: "Layering",
      lead: "Meta feature: tags the scale at which the construction should be viewed, from morpheme to macro construction.",
      question:
        "At what scale should this construction be analyzed and filtered?",
      definitionLabel: "Meta-level definition",
      definition:
        "The Stratum Vector assigns each construction to a granularity band so interfaces and queries can zoom cleanly.",
      contrastLabel: "Two scale bands",
      contrastItems: [
        {
          label: "Micro",
          title: "Morpheme or lexical scale",
          copy: "Small entries stay out of sentence-level workflows when researchers need larger units.",
        },
        {
          label: "Macro",
          title: "Clausal or multi-clause scale",
          copy: "Large constructions stay visible when the task is event or discourse architecture.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote: "[MORPHEME | LEXICAL | CLAUSAL | COMPLEX_MACRO]",
      exampleCopy:
        "The same constructicon can zoom from suffixes to macro patterns without one flat undifferentiated list.",
      examples: [
        {
          badge: "UI",
          name: "Clause-level filter",
          code: "selected = CLAUSAL",
          example:
            "Sentence-scale research can hide morpheme-level entries in one click.",
          roleLines: [
            {
              label: "Filter",
              value: "Granularity becomes an interface control.",
            },
            {
              label: "Use",
              value: "Clausal work is no longer buried under micro entries.",
            },
          ],
        },
        {
          badge: "Macro",
          name: "Complex frame",
          code: "COMPLEX_MACRO",
          example:
            "Conditional or discourse-level constructions stay grouped at the right scale.",
          roleLines: [
            {
              label: "Band",
              value: "Macro constructions remain searchable as macro units.",
            },
            {
              label: "Compare",
              value: "Researchers can align scale before comparing structures.",
            },
          ],
        },
      ],
      constructiconHead: "Scale-aware interface",
      constructiconBullets: [
        "Let the constructicon zoom across granularity instead of mixing every scale together.",
      ],
      queryHead: "Filter by scale",
      queryBullets: [
        "Retrieve only morpheme, clause, or macro constructions for the current task.",
      ],
      queryChips: ["stratum = morpheme | lexical | clausal | complex_macro"],
      reviewPrompt:
        "Does a formal granularity tag materially improve constructicon navigation and query, or would looser UI filtering already cover the same ground?",
      feedbackDefinition:
        "Granularity tag placing a construction on one scale band",
      feedbackUtility:
        "Makes scale explicit for interface filtering and cross-construction comparison",
    },
    {
      key: "canonical-exemplar-array",
      title: "The Canonical Exemplar Array",
      category: "Meta",
      level: "Exemplars",
      lead: "Evidence feature: stores the gold examples that prove the construction exists and show how its slots are filled.",
      question:
        "Which exemplars prove this construction actually exists in use?",
      definitionLabel: "Meta-level definition",
      definition:
        "The Canonical Exemplar Array keeps a small set of canonical examples plus one annotated exemplar that maps words to slots.",
      contrastLabel: "Two evidence forms",
      contrastItems: [
        {
          label: "Gold set",
          title: "Canonical examples",
          copy: "A few clean instances make the construction legible to both humans and reviewers.",
        },
        {
          label: "Annotation",
          title: "One mapped exemplar",
          copy: "One sentence ties concrete string spans directly to the schema's roles or slots.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        '{"sentence":"John gave Mary the book.","slots":{"AGENT":"John","RECIPIENT":"Mary"}}',
      exampleCopy:
        "Examples stop being decorative once the deck treats them as evidence-bearing admin data.",
      examples: [
        {
          badge: "Example",
          name: "Canonical set",
          code: "John gave Mary the book.",
          example:
            "A small gold set makes the construction instantly recognizable.",
          roleLines: [
            {
              label: "Use",
              value: "Fast human recognition of the target pattern.",
            },
            {
              label: "Scope",
              value: "A few clean sentences prove the construction exists.",
            },
          ],
        },
        {
          badge: "Annotation",
          name: "Mapped exemplar",
          code: "{AGENT: John, RECIPIENT: Mary, THEME: the book}",
          example:
            "One annotated sentence bridges the abstract schema and the actual string.",
          roleLines: [
            {
              label: "Map",
              value: "String spans line up with roles or slots.",
            },
            {
              label: "Query",
              value: "Structured exemplars become searchable evidence.",
            },
          ],
        },
      ],
      constructiconHead: "Evidence that teaches",
      constructiconBullets: [
        "Keep canonical examples and one mapped exemplar as first-class constructicon data.",
      ],
      queryHead: "Search by exemplars",
      queryBullets: [
        "Retrieve constructions whose mapped examples match a slot or role signature.",
      ],
      queryChips: ["canonical_examples >= 3", "annotated_exemplar = true"],
      reviewPrompt:
        "Do exemplar arrays materially improve onboarding and query, or would one illustrative sentence per construction already be enough?",
      feedbackDefinition:
        "Canonical example set plus one annotated exemplar for a construction",
      feedbackUtility:
        "Turns examples into explicit evidence and queryable role mappings",
    },
    {
      key: "epistemological-tag",
      title: "The Epistemological Tag",
      category: "Meta",
      level: "Evidence",
      lead: "Evidence-status feature: records where the claim came from and whether the system treats it as validated or disputed.",
      question:
        "What is the evidence claim and current validation status for this construction?",
      definitionLabel: "Meta-level definition",
      definition:
        "The Epistemological Tag stores source citation, curation status, and audit trail so construction claims remain traceable and contestable.",
      contrastLabel: "Two evidence states",
      contrastItems: [
        {
          label: "Validated",
          title: "Ready for downstream use",
          copy: "The construction has cleared review and can safely feed comparison, export, and teaching pipelines.",
        },
        {
          label: "Disputed",
          title: "Stored but contested",
          copy: "The claim stays visible, but the deck signals that its status remains under debate.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote: "The_Ditransitive | Goldberg 1995 | VALIDATED",
      exampleCopy:
        "A scientific constructicon needs explicit evidence status, not silent assumptions about trust.",
      examples: [
        {
          badge: "English",
          name: "Validated record",
          code: "The_Ditransitive | VALIDATED",
          example: "A reviewed source can move safely into downstream use.",
          roleLines: [
            {
              label: "Source",
              value: "Citation stays attached to the construction claim.",
            },
            {
              label: "Status",
              value: "Validation state is explicit rather than assumed.",
            },
          ],
        },
        {
          badge: "Dutch",
          name: "Disputed record",
          code: "Dutch_V2_Subordinate | DISPUTED",
          example:
            "The construction remains visible while its scope or evidence stays contested.",
          roleLines: [
            { label: "Source", value: "Even contested claims stay traceable." },
            {
              label: "Status",
              value: "Reviewers can filter them without deleting them.",
            },
          ],
        },
      ],
      constructiconHead: "Evidence-aware storage",
      constructiconBullets: [
        "Keep provenance and curation status explicit for every construction claim.",
      ],
      queryHead: "Filter by evidence status",
      queryBullets: [
        "Retrieve only validated, disputed, or draft constructions as needed.",
      ],
      queryChips: [
        "status = draft | validated | disputed",
        "source_type = grammar | corpus | note",
      ],
      reviewPrompt:
        "Does explicit provenance and validation status make the constructicon more trustworthy, or is it too much admin for too little analytical gain?",
      feedbackDefinition:
        "Evidence-status tag with provenance, curation state, and audit trail",
      feedbackUtility:
        "Makes construction claims traceable, filterable, and review-safe",
    },
    {
      key: "processability-index",
      title: "The Processability Index",
      category: "Acquisitional",
      level: "Learner",
      lead: "Acquisitional feature: maps the cognitive tier a learner must reach before the construction can be processed reliably.",
      question:
        "At what cognitive tier can the learner execute this construction?",
      definitionLabel: "Acquisitional definition",
      definition:
        "The Processability Index assigns a construction to one processability level in the learner's developmental hierarchy.",
      contrastLabel: "Two learning tiers",
      contrastItems: [
        {
          label: "Early tier",
          title: "Chunk and phrase level",
          copy: "Low-demand constructions become teachable once basic categories and simple phrases are available.",
        },
        {
          label: "Late tier",
          title: "Clause-linking level",
          copy: "More complex constructions wait until the learner can manage wider dependency tracking.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[pt_level = LEVEL_3_PHRASAL | prerequisites = category_recognition]",
      exampleCopy:
        "Teaching order becomes explicit when the feature names the cognitive tier instead of guessing from difficulty alone.",
      examples: [
        {
          badge: "English",
          name: "Basic transitive frame",
          code: "Put X in Y.",
          example:
            "A simple phrasal pattern becomes available early in the learning path.",
          roleLines: [
            { label: "Tier", value: "Phrase-level processability is enough." },
            {
              label: "Use",
              value: "Suitable once basic category recognition is stable.",
            },
          ],
        },
        {
          badge: "Dutch",
          name: "Basic clause frame",
          code: "Ik drink koffie.",
          example:
            "An early clausal pattern stays teachable before more complex dependency work.",
          roleLines: [
            { label: "Tier", value: "Still low enough for early sequencing." },
            {
              label: "Use",
              value: "Can be staged before subordinate linking patterns.",
            },
          ],
        },
      ],
      constructiconHead: "Cognitively gated sequencing",
      constructiconBullets: [
        "Match construction teaching order to learner processing readiness.",
      ],
      queryHead: "Search by tier",
      queryBullets: [
        "Retrieve only constructions available at one processability level.",
      ],
      queryChips: [
        "pt_level = level_2..level_5",
        "sequencing = readiness-first",
      ],
      reviewPrompt:
        "Should processability be mandatory for instructional sequencing, or is it better treated as advisory metadata only?",
      feedbackDefinition:
        "Learner-processability tier required to execute one construction",
      feedbackUtility:
        "Supports readiness-based sequencing and curriculum query",
    },
    {
      key: "typological-transfer-vector",
      title: "The Typological Transfer Vector",
      category: "Acquisitional",
      level: "Transfer",
      lead: "Acquisitional feature: predicts whether the learner's L1 helps, hurts, or stays neutral for this construction.",
      question:
        "Does native grammar make this construction easier, harder, or transparent?",
      definitionLabel: "Acquisitional definition",
      definition:
        "The Typological Transfer Vector stores transfer type and the default fallback error a learner is likely to produce.",
      contrastLabel: "Two transfer outcomes",
      contrastItems: [
        {
          label: "Positive",
          title: "L1 helps",
          copy: "The native grammar offers a close enough pattern that the construction comes with transfer support.",
        },
        {
          label: "Negative",
          title: "L1 misleads",
          copy: "The learner falls back to a familiar but wrong pattern when the target construction appears.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote:
        "[transfer = negative_interference | fallback = SVO_default]",
      exampleCopy:
        "Transfer becomes explicit enough to compare learner populations by construction instead of by vague difficulty labels.",
      examples: [
        {
          badge: "English L1",
          name: "Dutch V2 interference",
          code: "V2 inversion",
          example:
            "English learners default to SVO order when Dutch wants verb-second behavior.",
          roleLines: [
            { label: "Type", value: "Negative interference." },
            { label: "Fallback", value: "SVO stays the default repair path." },
          ],
        },
        {
          badge: "Farsi L1",
          name: "Dutch dummy er",
          code: "er wordt gebouwd",
          example:
            "No close Farsi analogue means little transfer help is available.",
          roleLines: [
            { label: "Type", value: "Near-zero or weak transfer support." },
            {
              label: "Fallback",
              value: "Learners omit or misplace the dummy slot.",
            },
          ],
        },
      ],
      constructiconHead: "L1-aware teaching",
      constructiconBullets: [
        "Tie one construction directly to likely transfer support or interference by learner group.",
      ],
      queryHead: "Search by transfer risk",
      queryBullets: [
        "Retrieve constructions with negative interference for one L1-to-L2 path.",
      ],
      queryChips: [
        "transfer = positive | negative | zero",
        "fallback = predicted_error",
      ],
      reviewPrompt:
        "Is a transfer vector worth the annotation cost, or is general contrastive linguistics enough without construction-level transfer data?",
      feedbackDefinition:
        "Transfer type and fallback error predicted for one L1-L2 construction pair",
      feedbackUtility:
        "Makes learner interference and facilitation queryable by construction",
    },
    {
      key: "fossilization-risk-index",
      title: "The Fossilization Risk Index",
      category: "Acquisitional",
      level: "Risk",
      lead: "Risk feature: marks which constructional errors tend to calcify and how much communicative damage they cause.",
      question:
        "If the learner gets this construction wrong, does the error calcify or self-correct?",
      definitionLabel: "Acquisitional definition",
      definition:
        "The Fossilization Risk Index stores both permanence risk and communicative gravity so hidden traps and self-healing errors stay distinct.",
      contrastLabel: "Two risk profiles",
      contrastItems: [
        {
          label: "Hidden risk",
          title: "Cosmetic but severe",
          copy: "The error may not block meaning, which lets it fossilize quietly.",
        },
        {
          label: "Breakdown",
          title: "Visible and self-correcting",
          copy: "The error breaks comprehension hard enough that repair pressure stays high.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote: "[risk = severe | gravity = cosmetic]",
      exampleCopy:
        "The index separates errors that calcify silently from errors that get fixed because they break the interaction.",
      examples: [
        {
          badge: "Farsi",
          name: "Ezafe omission",
          code: "ketab-e Ali",
          example:
            "Dropping the linker sounds non-native but often leaves the message intact.",
          roleLines: [
            {
              label: "Risk",
              value:
                "High fossilization because the error often goes uncorrected.",
            },
            { label: "Gravity", value: "Cosmetic rather than catastrophic." },
          ],
        },
        {
          badge: "Dutch",
          name: "Dummy er omission",
          code: "er wordt gebouwd",
          example:
            "Removing the dummy slot can make the construction collapse outright.",
          roleLines: [
            {
              label: "Risk",
              value: "Repair pressure keeps the error from hiding.",
            },
            { label: "Gravity", value: "High breakdown keeps it visible." },
          ],
        },
      ],
      constructiconHead: "Intervention priority",
      constructiconBullets: [
        "Surface the constructions that need early correction before errors harden.",
      ],
      queryHead: "Search by risk profile",
      queryBullets: [
        "Retrieve silent traps separately from obvious high-breakdown errors.",
      ],
      queryChips: [
        "risk = low | moderate | severe",
        "gravity = cosmetic | distracting | fatal",
      ],
      reviewPrompt:
        "Does the fossilization index give us actionable intervention priorities, or is it too speculative to keep as a core feature?",
      feedbackDefinition:
        "Risk profile of error fossilization and communicative gravity for one construction",
      feedbackUtility:
        "Prioritizes intervention by distinguishing silent traps from self-healing errors",
    },
    {
      key: "cefr-profiling",
      title: "The CEFR Profiling Layer",
      category: "Acquisitional",
      level: "Proficiency",
      lead: "Pedagogical feature: maps each construction to a CEFR band and the can-do work it supports.",
      question:
        "At which CEFR level do learners usually gain the resources to master this construction?",
      definitionLabel: "Acquisitional definition",
      definition:
        "The CEFR Profiling Layer tags a construction with one proficiency band and the can-do work that band is expected to support.",
      contrastLabel: "Two proficiency bands",
      contrastItems: [
        {
          label: "A1-A2",
          title: "Concrete and formulaic",
          copy: "Early bands cover highly constrained constructions grounded in direct, observable meanings.",
        },
        {
          label: "B1-B2",
          title: "Abstract and strategic",
          copy: "Later bands absorb constructions that need more abstraction, logic, or social calibration.",
        },
      ],
      exampleLabel: "One compact example",
      exampleQuote: "[cefr = A1 | can_do = describe identity]",
      exampleCopy:
        "The constructicon can talk directly to curricular levels once constructions carry an explicit proficiency tag.",
      examples: [
        {
          badge: "A1",
          name: "Predicate nominal",
          code: "I am an engineer.",
          example:
            "A concrete identity construction fits early proficiency work.",
          roleLines: [
            { label: "Level", value: "A1 for basic self-description." },
            { label: "Can-do", value: "Introduce identity in simple clauses." },
          ],
        },
        {
          badge: "B2",
          name: "Conditional frame",
          code: "If I had known, I would have left.",
          example:
            "Counterfactual logic usually appears later in the proficiency ladder.",
          roleLines: [
            { label: "Level", value: "B2 for counterfactual reasoning." },
            {
              label: "Can-do",
              value: "Handle hypothetical and layered logic.",
            },
          ],
        },
      ],
      constructiconHead: "Curriculum-ready constructicon",
      constructiconBullets: [
        "Bridge construction analysis directly to proficiency sequencing and accreditation needs.",
      ],
      queryHead: "Search by CEFR band",
      queryBullets: [
        "Retrieve only constructions targeted to one proficiency level or band range.",
      ],
      queryChips: ["cefr = A1..C2", "can_do = curricular target"],
      reviewPrompt:
        "Should CEFR profiling live inside the feature set as a core pedagogical layer, or stay as optional curriculum metadata outside the main model?",
      feedbackDefinition:
        "CEFR band and can-do profile attached to one construction",
      feedbackUtility:
        "Connects construction analysis to curriculum design and proficiency-based query",
    },
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function shortTitle(title) {
    return String(title || "")
      .replace(/^The\s+/i, "")
      .trim();
  }

  function resolveExampleAccent(example, index) {
    const badge = String(example.badge || "").toLowerCase();

    if (badge.includes("farsi")) {
      return "schema-card--farsi";
    }

    if (badge.includes("dutch")) {
      return "schema-card--dutch";
    }

    return index % 2 === 0 ? "schema-card--english" : "schema-card--farsi";
  }

  function renderRoleLines(lines) {
    return (lines || [])
      .map(
        (line) =>
          '<div class="schema-role-line"><strong>' +
          escapeHtml(line.label) +
          "</strong>" +
          escapeHtml(line.value) +
          "</div>",
      )
      .join("");
  }

  function renderExampleCards(feature) {
    return feature.examples
      .map(
        (example, index) =>
          '<section class="schema-card ' +
          resolveExampleAccent(example, index) +
          '">' +
          '<div class="schema-language">' +
          escapeHtml(example.badge) +
          "</div>" +
          '<div class="schema-name">' +
          escapeHtml(example.name) +
          "</div>" +
          '<div class="schema-code">' +
          escapeHtml(example.code) +
          "</div>" +
          '<div class="schema-example">' +
          escapeHtml(example.example) +
          "</div>" +
          '<div class="schema-role-lines">' +
          renderRoleLines(example.roleLines) +
          "</div>" +
          "</section>",
      )
      .join("");
  }

  function renderContrastItems(feature) {
    return feature.contrastItems
      .map(
        (item) =>
          '<div class="component-kind-row">' +
          '<span class="component-type-label">' +
          escapeHtml(item.label) +
          "</span>" +
          "<div>" +
          '<div class="component-kind-title">' +
          escapeHtml(item.title) +
          "</div>" +
          '<div class="component-kind-copy">' +
          escapeHtml(item.copy) +
          "</div>" +
          "</div>" +
          "</div>",
      )
      .join("");
  }

  function renderCompactExample(feature) {
    return (
      '<div class="example-quote">' +
      escapeHtml(feature.exampleQuote) +
      "</div>"
    );
  }

  function renderIntroSlide(feature, featureNumber) {
    return (
      '<div class="slide-container generated-feature-slide feature-definition-slide" id="' +
      escapeHtml(feature.key) +
      '-intro">' +
      '<div class="slide-kicker">Feature ' +
      pad(featureNumber) +
      " / " +
      escapeHtml(feature.category) +
      " / " +
      escapeHtml(feature.level) +
      "</div>" +
      '<div class="feature-header">' +
      '<div class="feature-title-wrap stack" style="gap: 14px">' +
      '<h2 class="slide-title">' +
      escapeHtml(feature.title) +
      "</h2>" +
      '<p class="slide-lead">' +
      escapeHtml(feature.lead) +
      "</p>" +
      "</div>" +
      "</div>" +
      '<div class="feature-sequence-board">' +
      '<div class="focus-question-card feature-question-banner">' +
      '<div class="eyebrow">Central question</div>' +
      '<div class="focus-question">' +
      escapeHtml(feature.question) +
      "</div>" +
      "</div>" +
      '<div class="feature-sequence-row feature-sequence-row--definition">' +
      '<div class="feature-sequence-step">Step 01<br />Definition</div>' +
      '<div class="feature-sequence-content">' +
      '<div class="eyebrow">' +
      escapeHtml(feature.definitionLabel) +
      "</div>" +
      '<div class="definition-statement">' +
      escapeHtml(feature.definition) +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="feature-sequence-row feature-sequence-row--types">' +
      '<div class="feature-sequence-step">Step 02<br />Axes</div>' +
      '<div class="feature-sequence-content">' +
      '<div class="eyebrow">' +
      escapeHtml(feature.contrastLabel) +
      "</div>" +
      '<div class="component-kind-stack">' +
      renderContrastItems(feature) +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="feature-sequence-row feature-sequence-row--example">' +
      '<div class="feature-sequence-step">Step 03<br />Example</div>' +
      '<div class="feature-sequence-content">' +
      '<div class="eyebrow">' +
      escapeHtml(feature.exampleLabel) +
      "</div>" +
      renderCompactExample(feature) +
      '<div class="feature-sequence-copy">' +
      escapeHtml(feature.exampleCopy) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderExamplesSlide(feature, featureNumber) {
    return (
      '<div class="slide-container generated-feature-slide feature-examples-slide" id="' +
      escapeHtml(feature.key) +
      '-examples">' +
      '<div class="slide-kicker">Feature ' +
      pad(featureNumber) +
      " / Examples + Utility</div>" +
      '<h2 class="slide-title">Evidence + payoff</h2>' +
      '<p class="slide-lead">The examples are only evidence. The stronger claim is that this feature can be stored and queried as a reusable layer.</p>' +
      '<div class="examples-utility-shell">' +
      '<div class="examples-column">' +
      '<div class="eyebrow">Two compact examples</div>' +
      renderExampleCards(feature) +
      "</div>" +
      '<section class="utility-argument-panel">' +
      '<div class="eyebrow">Why this matters more than the examples</div>' +
      '<div class="utility-argument-title">The real payoff is making the feature explicit enough for constructicon storage, comparison, and query.</div>' +
      '<div class="utility-argument-grid">' +
      '<div class="utility-argument-card">' +
      '<div class="utility-argument-label">Constructicon</div>' +
      '<div class="utility-argument-head">' +
      escapeHtml(feature.constructiconHead) +
      "</div>" +
      '<ul class="utility-argument-list">' +
      feature.constructiconBullets
        .map((bullet) => "<li>" + escapeHtml(bullet) + "</li>")
        .join("") +
      "</ul>" +
      "</div>" +
      '<div class="utility-argument-card">' +
      '<div class="utility-argument-label">Query</div>' +
      '<div class="utility-argument-head">' +
      escapeHtml(feature.queryHead) +
      "</div>" +
      '<ul class="utility-argument-list">' +
      feature.queryBullets
        .map((bullet) => "<li>" + escapeHtml(bullet) + "</li>")
        .join("") +
      "</ul>" +
      "</div>" +
      "</div>" +
      '<div class="query-chip-row">' +
      feature.queryChips
        .map(
          (chip) => '<span class="query-chip">' + escapeHtml(chip) + "</span>",
        )
        .join("") +
      "</div>" +
      "</section>" +
      "</div>" +
      "</div>"
    );
  }

  function renderReviewSlide(feature, featureNumber) {
    const featureName = shortTitle(feature.title);
    const featureKey = escapeHtml(feature.key);

    return (
      '<div class="slide-container generated-feature-slide feature-review-slide" id="' +
      escapeHtml(feature.key) +
      '-review">' +
      '<div class="slide-kicker">Feature ' +
      pad(featureNumber) +
      " / Review</div>" +
      '<div class="feedback-layout">' +
      '<div class="panel feedback-prompt">' +
      '<div class="stack">' +
      '<div class="eyebrow">Decision prompt</div>' +
      '<div class="feedback-question">Should ' +
      escapeHtml(featureName) +
      " stay in the core " +
      escapeHtml(feature.category.toLowerCase()) +
      " feature set?</div>" +
      '<div class="body-copy">Judge it by whether it creates a reusable layer for comparison, storage, or query rather than renaming structure we already capture elsewhere.</div>' +
      "</div>" +
      '<div class="stack">' +
      '<div class="feedback-prompt-quote">&ldquo;' +
      escapeHtml(feature.reviewPrompt) +
      "&rdquo;</div>" +
      '<div class="note-strip">' +
      '<i class="fa-solid fa-diagram-project"></i>' +
      '<div class="body-copy">Use the note for one missing example, one query case, or one reason the feature still feels redundant.</div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<form class="panel feature-review-form" data-feedback-form data-feature-key="' +
      featureKey +
      '" data-feature-title="' +
      escapeHtml(featureName) +
      '" data-feature-category="' +
      escapeHtml(feature.category) +
      '" data-feature-definition="' +
      escapeHtml(feature.feedbackDefinition) +
      '" data-feature-utility="' +
      escapeHtml(feature.feedbackUtility) +
      '">' +
      '<div class="feedback-options">' +
      '<div class="feedback-option">' +
      '<input id="' +
      featureKey +
      '-valuable" type="radio" name="' +
      featureKey +
      '" value="valuable" />' +
      '<label class="feedback-choice-card" for="' +
      featureKey +
      '-valuable">' +
      '<span class="feedback-choice-title">Valuable</span>' +
      '<span class="feedback-choice-copy">Keep it. It creates a usable layer for review, storage, or query.</span>' +
      '<span class="feedback-choice-foot">Use when the feature adds a layer you would actually reuse.</span>' +
      "</label>" +
      "</div>" +
      '<div class="feedback-option">' +
      '<input id="' +
      featureKey +
      '-not-useful" type="radio" name="' +
      featureKey +
      '" value="not useful" />' +
      '<label class="feedback-choice-card" for="' +
      featureKey +
      '-not-useful">' +
      '<span class="feedback-choice-title">Not useful</span>' +
      '<span class="feedback-choice-copy">Drop or merge it. The same work is already covered elsewhere.</span>' +
      '<span class="feedback-choice-foot">Use when the layer feels redundant or too expensive to maintain.</span>' +
      "</label>" +
      "</div>" +
      '<div class="feedback-option">' +
      '<input id="' +
      featureKey +
      '-not-sure" type="radio" name="' +
      featureKey +
      '" value="not sure" />' +
      '<label class="feedback-choice-card" for="' +
      featureKey +
      '-not-sure">' +
      '<span class="feedback-choice-title">Not sure</span>' +
      '<span class="feedback-choice-copy">Keep testing. The idea is plausible, but the payoff still needs sharper evidence.</span>' +
      '<span class="feedback-choice-foot">Use when the scope or use-case remains unclear.</span>' +
      "</label>" +
      "</div>" +
      "</div>" +
      '<div class="stack">' +
      '<label class="feedback-comment-label" for="' +
      featureKey +
      '-comment">Comment</label>' +
      '<textarea class="feedback-comment-area" id="' +
      featureKey +
      '-comment" data-feedback-comment placeholder="Add one concern, one query case, or one tighter use definition."></textarea>' +
      "</div>" +
      '<div class="feedback-form-footer">' +
      '<div class="feedback-live-status">' +
      '<span class="feedback-status-pill feedback-live-pill"><span data-feedback-choice-output>Pending</span></span>' +
      '<span class="feedback-caption" data-feedback-comment-output>No comment yet</span>' +
      "</div>" +
      '<span class="feedback-caption">Saved locally while the page stays open or reloads.</span>' +
      "</div>" +
      "</form>" +
      "</div>" +
      "</div>"
    );
  }

  function renderSidebarSection(feature, featureNumber, startSlideIndex) {
    return (
      '<details class="sidebar-section" data-section-title="Feature ' +
      pad(featureNumber) +
      '">' +
      '<summary class="sidebar-section-summary">' +
      '<span class="sidebar-section-meta">' +
      '<span class="sidebar-section-kicker">Feature block</span>' +
      '<span class="sidebar-section-title">' +
      escapeHtml(shortTitle(feature.title)) +
      "</span>" +
      "</span>" +
      '<span class="sidebar-summary-right">' +
      '<span class="sidebar-count">3</span>' +
      '<i class="fa-solid fa-chevron-down sidebar-chevron"></i>' +
      "</span>" +
      "</summary>" +
      '<div class="sidebar-section-items">' +
      '<button class="sidebar-item" data-slide="' +
      startSlideIndex +
      '" onclick="goToSlide(' +
      startSlideIndex +
      ')" type="button">' +
      escapeHtml(shortTitle(feature.title)) +
      "</button>" +
      '<button class="sidebar-item" data-slide="' +
      (startSlideIndex + 1) +
      '" onclick="goToSlide(' +
      (startSlideIndex + 1) +
      ')" type="button">Examples and utility</button>' +
      '<button class="sidebar-item" data-slide="' +
      (startSlideIndex + 2) +
      '" onclick="goToSlide(' +
      (startSlideIndex + 2) +
      ')" type="button">Review prompt</button>' +
      "</div>" +
      "</details>"
    );
  }

  function setJumpButton(button, slideIndex) {
    if (!button) {
      return;
    }

    button.dataset.slide = String(slideIndex);
    button.setAttribute("onclick", "goToSlide(" + slideIndex + ")");
  }

  const slidesMount = document.getElementById("generatedFeatureSlides");
  const sidebarMount = document.getElementById(
    "sidebarGeneratedFeatureSections",
  );

  if (!slidesMount || !sidebarMount) {
    return;
  }

  const firstGeneratedSlideIndex = 8;

  slidesMount.innerHTML = GENERATED_FEATURES.map((feature, index) => {
    const featureNumber = BASE_FEATURE_COUNT + index + 1;

    return (
      renderIntroSlide(feature, featureNumber) +
      renderExamplesSlide(feature, featureNumber) +
      renderReviewSlide(feature, featureNumber)
    );
  }).join("");

  sidebarMount.innerHTML = GENERATED_FEATURES.map((feature, index) => {
    const featureNumber = BASE_FEATURE_COUNT + index + 1;
    const startSlideIndex = firstGeneratedSlideIndex + index * 3;

    return renderSidebarSection(feature, featureNumber, startSlideIndex);
  }).join("");

  const summaryTableIndex =
    firstGeneratedSlideIndex + GENERATED_FEATURES.length * 3;
  const summaryBoardIndex = summaryTableIndex + 1;
  const totalFeatureCount = BASE_FEATURE_COUNT + GENERATED_FEATURES.length;

  setJumpButton(
    document.getElementById("summaryTableSidebarButton"),
    summaryTableIndex,
  );
  setJumpButton(
    document.getElementById("summaryBoardSidebarButton"),
    summaryBoardIndex,
  );

  const coverFeatureRangeTag = document.getElementById("coverFeatureRangeTag");
  if (coverFeatureRangeTag) {
    coverFeatureRangeTag.textContent =
      "Features 01-" + pad(totalFeatureCount) + ": full review";
  }

  const coverDeckSummary = document.getElementById("coverDeckSummary");
  if (coverDeckSummary) {
    coverDeckSummary.textContent =
      "This review document opens with the current feature landscape, then tests the full feature inventory through concise definitions, compact examples, utility arguments, and decision prompts.";
  }

  const coverFeatureCount = document.getElementById("coverFeatureCount");
  if (coverFeatureCount) {
    coverFeatureCount.textContent = pad(totalFeatureCount);
  }

  const coverFeatureSummary = document.getElementById("coverFeatureSummary");
  if (coverFeatureSummary) {
    coverFeatureSummary.textContent =
      "All " +
      totalFeatureCount +
      " candidate feature blocks across five feature families are now under review.";
  }

  const summaryBoardMeta = document.getElementById("summaryBoardMeta");
  if (summaryBoardMeta) {
    summaryBoardMeta.textContent =
      "This view groups the full review by family, decision spread, and next jumps.";
  }
})();
