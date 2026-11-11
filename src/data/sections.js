// Living Index: one data file drives the home cards, the page banners and the
// "More in this section" blocks. Edit here; nothing else needs to change.
//
// Item fields:
//   to       a doc route, without baseUrl (for example '/ux-writing')
//   href     a static file under /static, without baseUrl (for example '/lessons/lake-wren.html')
//   planned  true shows the item as "soon" with no link (keeps onBrokenLinks happy)
//   how, min the verb and minutes shown beside the title
//   group    optional; on a page, "More in this section" shows only items with the same group

const sections = [
  {
    id: 'i',
    name: 'Interactives',
    verb: 'Play',
    promise: 'Lessons you work through with your hands, not your eyes.',
    items: [
      {title: 'Saving Lake Wren', href: '/lessons/lake-wren.html', how: 'Play', min: 5,
        blurb: 'Five households share a lake and work out the eight design principles for long-lasting commons.'},
      {title: 'Crosscurrents', href: '/lessons/crosscurrents.html', how: 'Play', min: 10,
        blurb: 'Map your own values and find the pairs that pull against each other.'},
      {title: 'Desire Lines', href: '/lessons/desire-lines.html', how: 'Play', min: 8,
        blurb: 'Name your ideal, make a run of choices, and see how close you got.'},
      {title: 'Larkspur in Layers', href: '/lessons/larkspur-in-layers.html', how: 'Play', min: 6,
        blurb: 'Redraw police, lab and flood districts to see why polycentric governance works.'},
      {title: 'The Kettle Street Fund', href: '/lessons/kettle-street-fund.html', how: 'Play', min: 6,
        blurb: 'Twelve houses share one fund. Watch trust, reputation and norms shape who cooperates.'},
      {title: 'The Juniper Falls Charter', href: '/lessons/juniper-falls-charter.html', how: 'Play', min: 5,
        blurb: 'Match each resource to market, club, state, community or layered governance.'},
      {title: 'All four lessons, explained', to: '/interactive-lessons', how: 'Read', min: 2,
        blurb: 'What the Ostrom lessons teach and how they were built.'},
    ],
  },
  {
    id: 'c',
    name: 'Chat analyses',
    verb: 'Diagnose',
    promise: 'One chatbot fleet, one bad week: the incident, the prompt fix and the reports.',
    // The card's glimpse: an illustration of the wrong-payer failure in the post-mortem.
    glimpse: {
      user: 'Are you in network with my plan?',
      bot: 'Yes, we are in network with that plan.',
      note: 'Wrong payer: answered from an archived 2024 page',
    },
    items: [
      {title: 'Post-mortem: routing failure', to: '/chat-analyses/post-mortem', how: 'Read', min: 8,
        blurb: 'Three overlapping causes behind a SEV-2, separated with a 2x2 reproduction, and the safeguards that followed.'},
      {title: 'Prompt analysis', to: '/chat-analyses/prompt-analysis', how: 'Read', min: 9,
        blurb: 'Wording, ordering and layering tested on 120 messages: routing accuracy up from 62% to 95% with 57% fewer tokens.'},
      {title: 'Weekly fleet health report', to: '/chat-analyses/fleet-health-report', how: 'Read', min: 6,
        blurb: 'Twenty-four client bots in one view: KPIs, day-by-day recovery, per-bot status and next week\'s actions.'},
      {title: 'Fleet leads report', to: '/chat-analyses/fleet-leads-report', how: 'Read', min: 6,
        blurb: 'Where 967 leads came from, where they stalled, and why after-hours leads wait almost 14 hours.'},
    ],
  },
  {
    id: 'w',
    name: 'White papers',
    verb: 'Argue',
    promise: 'Positions and reviews with the evidence attached.',
    glimpse: {
      quote: 'A page an AI drafted is not documentation until a person has checked it.',
      cite: 'A human gate for AI-drafted docs',
    },
    items: [
      {title: 'MCP tutorial review', to: '/mcp-tutorial-review', how: 'Read', min: 6,
        blurb: 'Ten findings on the official MCP server quickstart, a rewritten Python section and a test results table.'},
      {title: 'A human gate for AI-drafted docs', planned: true, how: 'Read', min: 8,
        blurb: 'Why AI-drafted pages should wait for a person to verify them, and how a build can enforce it.'},
    ],
  },
  {
    id: 's',
    name: 'Doc samples',
    verb: 'Inspect',
    promise: 'Manuals, UX copy and knowledge bases, built like the real thing.',
    items: [
      {title: 'DITA sample: pressure washer manual', to: '/dita-pressure-washer', how: 'Browse', min: 4,
        blurb: "One DITA 1.3 source builds two owner's manuals, with shared safety warnings stored once."},
      {title: 'UX writing sample', to: '/ux-writing', how: 'Compare', min: 4,
        blurb: 'Ovenbird app copy across six screens, each with a redline against the original and notes.'},
      // Trailing slash: every page under /quillon/ counts as this item.
      {title: 'Self-auditing knowledge base', to: '/quillon/', how: 'Browse', min: 6,
        blurb: "A litigation platform's knowledge base where AI-drafted pages wait for a human check."},
      {title: 'Weather-aware AI skill', to: '/xweather-skill', how: 'Follow', min: 10,
        blurb: 'A tutorial on MCP, Claude Skills and the Vaisala Xweather MCP server.'},
    ],
  },
  {
    id: 'b',
    name: 'Blog posts',
    verb: 'Read',
    promise: 'Sixteen articles written for F3 Wireless, from how a firm engages to testing a radio by radio.',
    // The card's glimpse: opening lines from five posts, one at a time.
    glimpse: {
      lines: [
        {tag: "LoRa", title: "DVT of a LoRa Radio", to: '/blog-posts/dvt-of-a-lora-radio', line: "The sensitivity floor that makes long-range deployment possible also makes the test setup difficult, because the receiver hears everything."},
        {tag: "Lab Capability", title: "The Lab as the Iteration Loop", to: '/blog-posts/the-lab-as-the-iteration-loop', line: "The cost of that decision is not the lab bill. It is the iteration cycle."},
        {tag: "Bluetooth", title: "DVT of a Bluetooth Radio", to: '/blog-posts/dvt-of-a-bluetooth-radio', line: "Bluetooth Low Energy and Bluetooth Classic share a name and almost nothing else."},
        {tag: "Engaging F3", title: "What Equipment Does and Doesn’t Tell You About a Firm", to: '/blog-posts/equipment-and-expertise', line: "Anyone with capital can buy a spectrum analyzer."},
        {tag: "Cellular", title: "DVT of a Cellular Radio", to: '/blog-posts/dvt-of-a-cellular-radio', line: "It transmits only in response to a network, which means the test setup has to bring the network along."},
      ],
    },
    // group: posts with the same group are shown together under "More blog posts".
    items: [
      // The Firm
      {title: "What F3 Is and What F3 Is Not", to: '/blog-posts/what-f3-is-and-is-not', how: 'Read', min: 6, group: "The Firm",
        blurb: "Work for hire, customer-owned IP, the contrast with ODM lock-in, and what happens to the relationship after the certified prototype."},
      {title: "What a Wireless Engagement Looks Like", to: '/blog-posts/what-an-engagement-looks-like', how: 'Read', min: 8, group: "The Firm",
        blurb: "From the first requirements conversation to the certified prototype: the specialists involved, the artifacts produced, the way hours are tracked."},
      {title: "Why Design Reuse Compresses the Schedule", to: '/blog-posts/why-design-reuse-compresses-schedule', how: 'Read', min: 6, group: "The Firm",
        blurb: "Most of a connected product is built from blocks that have been built before. What reuses cleanly, what does not, and where the IP boundary falls."},
      {title: "Project Risk and Who Carries It", to: '/blog-posts/project-risk-and-who-carries-it', how: 'Read', min: 6, group: "The Firm",
        blurb: "Tariffs, chip shortages, regulatory changes, and design unknowns. Why product development risk is structurally the customer's."},
      // DVT, Radio by Radio
      {title: "Design Verification Test for Radio Products", to: '/blog-posts/dvt-for-radio-products', how: 'Read', min: 8, group: "DVT, Radio by Radio",
        blurb: "What DVT is, what it covers, and why the certified-prototype milestone depends on it."},
      {title: "What “Good Enough” Means for a Radio", to: '/blog-posts/good-enough-for-a-radio', how: 'Read', min: 7, group: "DVT, Radio by Radio",
        blurb: "Link budget thinking, fade margin, and the relationship between the chip's data sheet, the design's measurements, and what ships."},
      {title: "DVT of a Regular Radio", to: '/blog-posts/dvt-of-a-regular-radio', how: 'Read', min: 8, group: "DVT, Radio by Radio",
        blurb: "Design verification for Bluetooth, Wi-Fi, LoRa, Zigbee, and other radios with predictable behavior under direct control."},
      {title: "DVT of a Cellular Radio", to: '/blog-posts/dvt-of-a-cellular-radio', how: 'Read', min: 7, group: "DVT, Radio by Radio",
        blurb: "A cellular radio transmits only in response to a network. The test setup has to bring the network along."},
      {title: "DVT of GPS and GNSS Receivers", to: '/blog-posts/dvt-of-gps-and-gnss', how: 'Read', min: 7, group: "DVT, Radio by Radio",
        blurb: "Why a parking lot is not a test environment, what a GPS signal generator does, and how firmware engineers test geofencing without driving anywhere."},
      {title: "DVT of a Bluetooth Radio", to: '/blog-posts/dvt-of-a-bluetooth-radio', how: 'Read', min: 8, group: "DVT, Radio by Radio",
        blurb: "Bluetooth Low Energy and Bluetooth Classic share a name and almost nothing else. The DVT setup and equipment differ."},
      {title: "DVT of a Wi-Fi Radio", to: '/blog-posts/dvt-of-a-wifi-radio', how: 'Read', min: 9, group: "DVT, Radio by Radio",
        blurb: "Wi-Fi is the first radio many engineers encounter where the modulation has amplitude content. The implications run through the whole transmit chain."},
      {title: "DVT of a LoRa Radio", to: '/blog-posts/dvt-of-a-lora-radio', how: 'Read', min: 7, group: "DVT, Radio by Radio",
        blurb: "LoRa trades data rate for receive sensitivity. The sensitivity floor that makes long-range deployment possible also makes the test setup difficult."},
      // Lab, Manufacturing, Certification
      {title: "Production Test of a Radio Product", to: '/blog-posts/production-test-of-a-radio', how: 'Read', min: 6, group: "Lab, Manufacturing, Certification",
        blurb: "How manufacturing test asks a different question than DVT, what gets checked on every unit, and the failure modes that show up when it is done wrong."},
      {title: "The Lab as the Iteration Loop", to: '/blog-posts/the-lab-as-the-iteration-loop', how: 'Read', min: 6, group: "Lab, Manufacturing, Certification",
        blurb: "Why owning the equipment in-house changes the schedule. Anechoic chambers, antenna measurement systems, and the iteration cycle they make possible."},
      {title: "What Equipment Does and Doesn’t Tell You About a Firm", to: '/blog-posts/equipment-and-expertise', how: 'Read', min: 6, group: "Lab, Manufacturing, Certification",
        blurb: "Anyone with capital can buy a spectrum analyzer. Equipment is the floor of what a wireless engineering firm needs, not the ceiling."},
      {title: "FCC Certification with a Pre-Certified Module", to: '/blog-posts/fcc-with-pre-certified-modules', how: 'Read', min: 5, group: "Lab, Manufacturing, Certification",
        blurb: "When a pre-certified module covers the integrated product, when it does not, and the Class II permissive change path between the two."},
    ],
  },
];

// The one quiet hint on the home page. Set to null to hide it.
export const startHint = {text: '', title: 'Saving Lake Wren', href: '/lessons/lake-wren.html', tail: 'is the shortest, at five minutes.'};

export default sections;
