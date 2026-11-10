// Living Index: one data file drives the home cards, the page banners and the
// "More in this section" blocks. Edit here; nothing else needs to change.
//
// Item fields:
//   to       a doc route, without baseUrl (for example '/ux-writing')
//   href     a static file under /static, without baseUrl (for example '/lessons/lake-wren.html')
//   planned  true shows the item as "soon" with no link (keeps onBrokenLinks happy)
//   how, min the verb and minutes shown beside the title

const sections = [
  {
    id: 'i',
    name: 'Interactives',
    verb: 'Play',
    promise: 'Lessons you work through with your hands, not your eyes.',
    items: [
      {title: 'Saving Lake Wren', href: '/lessons/lake-wren.html', how: 'Play', min: 5,
        blurb: 'Five households share a lake and work out the eight design principles for long-lasting commons.'},
      {title: 'Larkspur in Layers', href: '/lessons/larkspur-in-layers.html', how: 'Play', min: 6,
        blurb: 'Redraw police, lab and flood districts to see why polycentric governance works.'},
      {title: 'The Kettle Street Fund', href: '/lessons/kettle-street-fund.html', how: 'Play', min: 6,
        blurb: 'Twelve houses share one fund. Watch trust, reputation and norms shape who cooperates.'},
      {title: 'The Juniper Falls Charter', href: '/lessons/juniper-falls-charter.html', how: 'Play', min: 5,
        blurb: 'Match each resource to market, club, state, community or layered governance.'},
      {title: 'All four lessons, explained', to: '/interactive-lessons', how: 'Read', min: 2,
        blurb: 'What the Ostrom lessons teach and how they were built.'},
      {title: 'Crosscurrents', planned: true, how: 'Play', min: 10,
        blurb: 'Map your own values and find the pairs that pull against each other.'},
      {title: 'Desire Lines', planned: true, how: 'Play', min: 8,
        blurb: 'Name your ideal, make a run of choices, and see how close you got.'},
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
];

// The one quiet hint on the home page. Set to null to hide it.
export const startHint = {text: 'Short on time?', title: 'Saving Lake Wren', href: '/lessons/lake-wren.html', tail: 'takes five minutes.'};

export default sections;
