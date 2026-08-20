/**
 * English content.
 *
 * The relationship decks, blurbs, hues and modes come straight from the design
 * canvas. The pack decks are new: the canvas defines the four packs and their
 * copy but ships no questions for them, so they are written here in the same
 * voice. The Thai file mirrors this one index for index — the two are paired by
 * position, so questions keep their identity across a language switch.
 */

import type { Content } from './content';

export const EN: Content = {
  rel: {
    'New friend': 'New friend',
    'Old friend': 'Old friend',
    'Best friend': 'Best friend',
    Lover: 'Lover',
    Family: 'Family',
    Colleague: 'Colleague',
    Stranger: 'Stranger',
  },

  blurb: {
    'New friend': 'Two weeks in, still polite',
    'Old friend': 'History, some of it fuzzy',
    'Best friend': 'No filter required',
    Lover: "Everything's already loaded",
    Family: 'The unspoken stuff',
    Colleague: 'Past the standup small talk',
    Stranger: 'Nothing to lose',
  },

  decks: {
    'New friend': [
      "What's a lie you tell strangers about yourself?",
      'What did you assume about me in the first ten seconds?',
      "What's the last thing you searched that you'd rather not admit?",
      'What are you pretending to have figured out?',
      "Who did you want to be at seventeen, and how's that going?",
      'What compliment do you never get but wish you did?',
      "What's the loneliest you've been in a crowded room?",
      'What do you hope nobody ever finds out about you?',
      'What would you change about the way people meet you?',
    ],
    'Old friend': [
      'Which version of me do you miss?',
      "What's the dumbest thing we got away with?",
      "What do you tell other people about me when I'm not there?",
      'When did you stop telling me everything?',
      'What did I get wrong about you back then?',
      "What have you outgrown that I haven't noticed?",
      'Was there a moment you almost let this friendship go?',
      'What do you forgive me for that I never apologised for?',
      'If we met today, would we still pick each other?',
    ],
    'Best friend': [
      "What's my most annoying habit? Be specific.",
      'What would you do first if you woke up as me?',
      'What secret of mine are you weirdly proud of keeping?',
      'Where am I lying to myself?',
      'What have you been protecting me from?',
      'What do you envy about my life?',
      "What would you say at my funeral that you'd never say to my face?",
      'What about me have you decided to accept instead of mention?',
      'When did I let you down and never find out?',
    ],
    Lover: [
      'What did you notice about me before we spoke?',
      'What small thing I do would you miss immediately?',
      'Which of my texts did you reread?',
      "What do you need from me that you've never asked for?",
      'When do you feel furthest from me in the same room?',
      'What are you scared to want out loud?',
      'What would break us, if we let it?',
      'What part of you have you never brought into this?',
      'What do you need me to stop forgiving you for?',
    ],
    Family: [
      'Which family story do you think got exaggerated?',
      'What did you think my life would look like?',
      "What's the family trait you can't escape?",
      'What did we never talk about, and why?',
      'When did you first see me as an adult?',
      "What do you wish you'd asked while you had the chance?",
      'What have you never forgiven, and does it still cost you?',
      "What did you inherit that you're trying not to pass on?",
      'What would you say to me if there were no consequences?',
    ],
    Colleague: [
      'What do you actually do all day?',
      'Which recurring meeting would you cancel forever?',
      'What did you think I did here when we met?',
      "What do you want that you haven't told anyone at work?",
      'When did you last feel out of your depth?',
      'What would you do if the money were handled?',
      'What are you afraid this job is turning you into?',
      'Who here do you not trust, and how do you live with it?',
      'What ambition have you quietly given up on?',
    ],
    Stranger: [
      "What's on your mind that you haven't said out loud today?",
      "What's the best thing that happened to you this week?",
      'What would you do with a completely free Tuesday?',
      'What are you tired of explaining?',
      'What do you wish people asked you about?',
      'What did you change your mind about recently?',
      'What are you carrying right now?',
      "What do you need that you can't ask for?",
      'When did you last surprise yourself?',
    ],
  },

  modes: {
    solo: { name: 'Just us two', blurb: 'One phone, take turns answering' },
    pass: { name: 'Pass the phone', blurb: 'It tells you whose turn it is' },
    group: { name: 'Group table', blurb: '3–6 people, cards dealt around' },
  },

  packs: {
    first: {
      name: 'First night out',
      blurb: 'For people who just met and want to skip the weather',
      tag: 'Free',
      questions: [
        "What's the story people always get wrong about you?",
        'What did you want to be doing at this age?',
        "What's the most interesting thing you believe that most people don't?",
        'What are you good at that never comes up?',
        'What kind of person do you find hard to be around?',
        "What's something you've quietly stopped caring about?",
        'When did you last feel genuinely out of your depth?',
        'What do you want more of in your life this year?',
        'What would you want me to remember about tonight?',
      ],
    },
    years: {
      name: 'Ten years later',
      blurb: 'Reunions, weddings, and everyone who knew you before',
      tag: 'Free',
      questions: [
        'What did you think would have happened to us by now?',
        'Which version of yourself would you not want to meet again?',
        'What did we all pretend not to notice back then?',
        'Who from those years do you still think about?',
        'What did you get right that nobody gave you credit for?',
        "What did you lose track of that you wish you hadn't?",
        'What would your younger self be disappointed by?',
        'What would your younger self be relieved about?',
        'What do you want the next ten years to feel like?',
      ],
    },
    after: {
      name: 'After midnight',
      blurb: "Level 8 and up only. Don't start this at 9pm.",
      tag: 'Deep',
      questions: [
        'What do you do when nobody could possibly find out?',
        "What's the thought that keeps you up?",
        'What have you never said out loud to anyone in this room?',
        'What do you resent that you never admit to resenting?',
        'What are you still angry about that you claim to be over?',
        'What would you undo if there were no consequences?',
        'What part of yourself do you hide from the people who love you?',
        "What's the worst thing you've ever thought about someone here?",
        'What are you most afraid is true about you?',
      ],
    },
    repair: {
      name: 'The repair pack',
      blurb: "For the conversation you've been putting off",
      tag: 'Lover',
      questions: [
        'What did I miss that you needed me to see?',
        'When did you last feel unheard by me?',
        'What have you been carrying alone in this?',
        'What do you need to hear from me right now?',
        'What did I do that hurt more than I realised?',
        'What are you afraid will happen if you tell me the truth?',
        'What would make this feel repairable to you?',
        'What have you been holding back to keep the peace?',
        'What do you want us to be on the other side of this?',
      ],
    },
  },

  bands: {
    warm: 'Warm-up',
    real: 'Getting real',
    honest: 'Uncomfortably honest',
    final: 'No going back',
  },

  daily: [
    "What did you almost say to me today, and didn't?",
    'What are you avoiding a conversation about?',
    'What went better than you expected this week?',
    'Who do you owe a message to?',
    'What are you pretending not to want?',
    "What did you need today that you didn't ask for?",
    'What would you do differently if today repeated?',
    'What are you grateful for that you never mention?',
    'What is taking up more space in your head than it deserves?',
    'When did you last change your mind about something that mattered?',
    'What are you looking forward to that nobody knows about?',
    'What do you keep meaning to start?',
    'What did someone do for you recently that you never acknowledged?',
    "What are you tolerating that you shouldn't?",
  ],
};
