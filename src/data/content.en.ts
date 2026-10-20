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
    'Dark mode': 'Deep Dark',
    'Sex mode': 'Sex Mode (18+)',
  },

  blurb: {
    'New friend': 'Two weeks in, still polite',
    'Old friend': 'History, some of it fuzzy',
    'Best friend': 'No filter required',
    Lover: "Everything's already loaded",
    Family: 'The unspoken stuff',
    Colleague: 'Past the standup small talk',
    Stranger: 'Nothing to lose',
    'Dark mode': 'Shadow self, secret desires & untold truths',
    'Sex mode': 'Attraction, fantasies, turn-ons & 18+ intimacy',
  },

  modes: {
    solo: { name: 'Just us two', blurb: 'One phone, take turns answering' },
    pass: { name: 'Pass the phone', blurb: 'It tells you whose turn it is' },
    group: { name: 'Group table', blurb: '3–6 people, cards dealt around' },
  },

  packs: {
    dark: {
      name: 'Deep Dark: Forbidden Desires',
      blurb: 'The shadow side of the mind, hidden cravings, and secrets never told to anyone',
      tag: 'Dark',
      questions: [
        'What is a secret desire you have never told a single soul because you fear being judged?',
        'What is the biggest lie about your personality that you let everyone around you believe?',
        'If you had one night with zero consequences and total anonymity, what would you actually do?',
        'What is a forbidden attraction or fantasy you have kept locked inside your head?',
        'When have you subtly manipulated someone to get exactly what you wanted?',
        'Whose downfall would secretly satisfy a dark part of you?',
        'What is the most selfish or ruthless thing you have ever done to someone who trusted you?',
        'What temptation are you resisting right now only because you are afraid of getting caught?',
        'Which part of your dark side do you secretly love and refuse to let go of?',
        'What is a craving — emotional or physical — that you are ashamed of how intensely you want?',
        'If everyone in this room could read your unfiltered thoughts for one hour, who would leave first?',
        'What secret are you planning to take to your grave — give the closest hint you dare to speak?',
      ],
    },
    sex: {
      name: 'Sex Mode: Spicy & Unfiltered (18+)',
      blurb: 'Turn-ons, bedroom secrets, roleplay, and fantasies you want to try tonight',
      tag: '18+ Hot',
      questions: [
        'What is a sexual fantasy you have had for years but have never acted on yet?',
        'Do you prefer being the one in control in bed, or letting the other person take over completely?',
        'What is the dirtiest phrase someone could whisper in your ear right now to turn you on?',
        'Where on your body do you want to be kissed, touched, or bitten right this second?',
        'How do you feel about being blindfolded, pinned down, or having your hands tied in bed?',
        'What is one thing in bed that instantly takes you from "this is nice" to "I am losing my mind"?',
        'If we were alone in a hotel room tonight with zero rules, what is the first thing you would do to me?',
        'What roleplay scenario, power dynamic, or secret kink turns you on the most?',
        'Describe step by step how you would seduce and undress me if this card game ended right now.',
        'What is the riskiest or most unexpected place you have ever hooked up — or want to?',
        'On a scale of 1 to 10, how turned on are you right now, and what would make it a 10?',
        'No filter: what is the exact fantasy you want to try with the person across from you tonight?',
      ],
    },
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
