/**
 * English chrome content — names, blurbs, packs, bands and the daily pool.
 *
 * The relationship questions do not live here: they carry a level and both
 * languages at once, in `pool/`. What is left is copy that comes straight from
 * the design canvas, plus the pack questions, which the canvas names but never
 * writes. The Thai file mirrors this one index for index.
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
