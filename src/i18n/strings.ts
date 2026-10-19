/**
 * Every word of chrome in the app, in both languages.
 *
 * `en` is the source of truth for the shape — `th` is typed against it, so a
 * missing or misspelt key is a compile error rather than a blank label. Strings
 * that interpolate are functions, which keeps word order the translator's
 * decision instead of the caller's.
 */

import type { Lang } from './lang';

const en = {
  tabPlay: 'Play',
  tabKept: 'Kept',
  tabPacks: 'Packs',

  // Home
  startStreak: 'Start a streak',
  streakDays: (n: number) => `${n} day${n === 1 ? '' : 's'} streak`,
  homeTitle: "Who's across from you tonight?",
  homeSubtitle: "Pick a relationship. We'll do the awkward part.",
  dailyEyebrow: "TODAY'S ONE QUESTION",
  dailyCta: 'Ask it → keep the streak',
  dailyCtaA11y: "Ask today's question and keep the streak",
  languageA11y: (name: string) => `Switch the app to ${name}`,
  todayLabel: 'Today',

  // Setup
  back: 'Back',
  setupTitle: 'How deep are we going?',
  setDepthA11y: (level: number) => `Set depth to level ${level}`,
  levelOfTen: (level: number) => `Level ${level} / 10`,
  howYouArePlaying: "HOW YOU'RE PLAYING",
  atTheTable: (n: number) => `AT THE TABLE (${n})`,
  removePlayerA11y: (name: string) => `Remove ${name}`,
  noPlayers: 'Add names and the app will call whose turn it is.',
  addNamePlaceholder: 'Add a name',
  addPlayerA11y: 'Add player',
  add: 'Add',
  dealFirstCard: 'Deal the first card',

  // Session
  endSessionA11y: 'End session',
  playerTurn: (name: string) => `${name}'s turn`,
  yourTurn: 'Your turn',
  cardProgress: (card: number, total: number, level: number) =>
    `Card ${card} of ${total} · Level ${level}`,
  deckProgress: (total: number, level: number) => `${total} of ${total} · Level ${level}`,
  pauseTimerA11y: 'Pause turn timer',
  startTimerA11y: 'Start turn timer',
  deckDone: "That's the whole deck.",
  keptNothing: 'Nothing kept tonight. Go deeper, or call it.',
  keptSome: (n: number) => `${n} question${n === 1 ? '' : 's'} saved. Go deeper, or call it.`,
  turnItUp: 'Turn it up a level',
  done: 'Done',
  hintPass: 'Answer, then pass left',
  hintSolo: 'Swipe or tap next',
  pass: 'Pass',
  passA11y: 'Pass on this question',
  answeredPassOn: 'Answered — pass on',
  answeredPassOnA11y: 'Answered, pass on',
  nextCard: 'Next card',
  keepQuestionA11y: 'Keep this question',
  unkeepQuestionA11y: 'Remove from kept',

  // Kept
  keptTitle: 'Kept',
  keptEmptySubtitle: 'Questions worth asking again live here.',
  keptSubtitle: (n: number) => `${n} question${n === 1 ? '' : 's'} worth asking again.`,
  keptEmpty: 'Nothing kept yet. Tap ★ on a card mid-game.',
  keptMeta: (rel: string, level: number) => `${rel.toUpperCase()} · LEVEL ${level}`,
  remove: 'Remove',
  removeA11y: (q: string) => `Remove: ${q}`,

  // Packs
  packsTitle: 'Packs',
  packsSubtitle: 'Swap the deck for a night with a theme.',
  packA11y: (name: string, blurb: string, n: number) => `${name}. ${blurb}. ${n} questions.`,
  writeYourOwn: 'Write your own',
  yourPack: 'Your pack',
  yourPackLower: 'your pack',
  customCount: (n: number) => `${n} question${n === 1 ? '' : 's'} in your pack.`,
  select: 'Select',
  selected: 'Selected',
  selectYourPackA11y: 'Select your own pack',
  customPlaceholder: "Ask something you'd never ask sober",
  addQuestionA11y: 'Add question',
  appSection: 'APP',
  sessionSection: 'SESSION',
  turnTimer: 'Turn timer',
  turnTimerBlurb: 'Show a countdown on each card',
  timePerTurn: 'Time per turn',
  minutes: (mmss: string) => `${mmss} minutes`,
  lessTimeA11y: 'Less time per turn',
  moreTimeA11y: 'More time per turn',
  allowPassing: 'Allow passing',
  allowPassingBlurb: 'Keep a Pass button on every card',
  language: 'Language',
  languageBlurb: 'The app and the questions',
  theme: 'Theme',
  themeBlurb: 'Light or dark',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeA11y: (name: string) => `Switch the app to ${name} theme`,
  privacyPolicy: 'Privacy Policy',
  privacyPolicyBlurb: 'What the app stores, and where',
  privacyPolicyA11y: 'Open the privacy policy in your browser',
  dealFrom: (name: string) => `Deal from ${name}`,

  // Subscription
  locked: 'Locked',
  lockedA11y: (name: string) => `${name} — unlock with Azolla Deeper`,
  proName: 'Azolla Deeper',
  proTitle: 'The questions that change something',
  proSubtitle:
    'Breaking the ice is free. Deeper is for the people already sitting close to you.',
  proFeatureLevels: 'Levels 6–10 — the ones usually left unsaid',
  proFeatureDecks: 'Every relationship: old friends, best friends, lovers, family',
  proFeaturePacks: 'All four themed packs, including After midnight',
  proFeatureCustom: 'Write your own questions and play them like any deck',
  proMonthly: 'Monthly',
  proYearly: 'Yearly',
  proYearlyNote: 'Best value',
  proCta: 'Subscribe',
  proRestore: 'Restore purchase',
  proRestored: 'Your subscription is back.',
  proRestoreFailed: 'No previous purchase found on this account.',
  proClose: 'Not now',
  proCloseA11y: 'Close and keep the free version',
  proUnavailable: 'Subscriptions are available in the iOS and Android app.',
  proLoading: 'Loading plans…',
  /** Apple requires auto-renewal terms on the paywall itself, not just in the store. */
  proTerms:
    'Payment is charged to your store account at confirmation. The subscription renews automatically unless cancelled at least 24 hours before the period ends. Manage or cancel it any time in your account settings.',
};

type Dict = typeof en;

const th: Dict = {
  tabPlay: 'เล่น',
  tabKept: 'เก็บไว้',
  tabPacks: 'แพ็ก',

  // Home
  startStreak: 'เริ่มสตรีค',
  streakDays: (n: number) => `สตรีค ${n} วัน`,
  homeTitle: 'คืนนี้ใครนั่งอยู่ตรงข้ามคุณ?',
  homeSubtitle: 'เลือกความสัมพันธ์มา เดี๋ยวเราถามส่วนที่กระอักกระอ่วนเอง',
  dailyEyebrow: 'คำถามประจำวันนี้',
  dailyCta: 'ถามเลย → รักษาสตรีคไว้',
  dailyCtaA11y: 'ถามคำถามประจำวันและรักษาสตรีคไว้',
  languageA11y: (name: string) => `เปลี่ยนภาษาแอปเป็น${name}`,
  todayLabel: 'วันนี้',

  // Setup
  back: 'ย้อนกลับ',
  setupTitle: 'คืนนี้จะลงลึกแค่ไหน?',
  setDepthA11y: (level: number) => `ตั้งความลึกเป็นระดับ ${level}`,
  levelOfTen: (level: number) => `ระดับ ${level} / 10`,
  howYouArePlaying: 'เล่นกันแบบไหน',
  atTheTable: (n: number) => `คนที่โต๊ะ (${n})`,
  removePlayerA11y: (name: string) => `ลบ ${name}`,
  noPlayers: 'ใส่ชื่อไว้ แล้วแอปจะบอกเองว่าถึงตาใคร',
  addNamePlaceholder: 'เพิ่มชื่อ',
  addPlayerA11y: 'เพิ่มผู้เล่น',
  add: 'เพิ่ม',
  dealFirstCard: 'แจกการ์ดใบแรก',

  // Session
  endSessionA11y: 'จบเซสชัน',
  playerTurn: (name: string) => `ตาของ ${name}`,
  yourTurn: 'ตาคุณ',
  cardProgress: (card: number, total: number, level: number) =>
    `ใบที่ ${card} จาก ${total} · ระดับ ${level}`,
  deckProgress: (total: number, level: number) => `${total} จาก ${total} · ระดับ ${level}`,
  pauseTimerA11y: 'หยุดจับเวลา',
  startTimerA11y: 'เริ่มจับเวลา',
  deckDone: 'หมดสำรับแล้ว',
  keptNothing: 'คืนนี้ยังไม่ได้เก็บคำถามไว้เลย จะลงลึกต่อ หรือพอแค่นี้ก็ได้',
  keptSome: (n: number) => `เก็บไว้ ${n} คำถาม จะลงลึกต่อ หรือพอแค่นี้ก็ได้`,
  turnItUp: 'เพิ่มอีกระดับ',
  done: 'พอแค่นี้',
  hintPass: 'ตอบแล้วส่งต่อไปทางซ้าย',
  hintSolo: 'ปัดหรือแตะเพื่อไปใบถัดไป',
  pass: 'ข้าม',
  passA11y: 'ข้ามคำถามนี้',
  answeredPassOn: 'ตอบแล้ว — ส่งต่อ',
  answeredPassOnA11y: 'ตอบแล้ว ส่งต่อ',
  nextCard: 'ใบถัดไป',
  keepQuestionA11y: 'เก็บคำถามนี้ไว้',
  unkeepQuestionA11y: 'เอาออกจากที่เก็บไว้',

  // Kept
  keptTitle: 'เก็บไว้',
  keptEmptySubtitle: 'คำถามที่อยากถามอีกครั้งจะมาอยู่ที่นี่',
  keptSubtitle: (n: number) => `${n} คำถามที่อยากถามอีกครั้ง`,
  keptEmpty: 'ยังไม่มีอะไรเก็บไว้ แตะ ★ บนการ์ดระหว่างเล่นได้เลย',
  keptMeta: (rel: string, level: number) => `${rel} · ระดับ ${level}`,
  remove: 'ลบออก',
  removeA11y: (q: string) => `ลบ: ${q}`,

  // Packs
  packsTitle: 'แพ็ก',
  packsSubtitle: 'เปลี่ยนสำรับ ให้คืนนี้มีธีมของมันเอง',
  packA11y: (name: string, blurb: string, n: number) => `${name} ${blurb} ${n} คำถาม`,
  writeYourOwn: 'เขียนเอง',
  yourPack: 'แพ็กของคุณ',
  yourPackLower: 'แพ็กของคุณ',
  customCount: (n: number) => `มี ${n} คำถามในแพ็กของคุณ`,
  select: 'เลือก',
  selected: 'เลือกแล้ว',
  selectYourPackA11y: 'เลือกแพ็กของคุณ',
  customPlaceholder: 'ถามสิ่งที่ปกติไม่กล้าถาม',
  addQuestionA11y: 'เพิ่มคำถาม',
  appSection: 'แอป',
  sessionSection: 'เซสชัน',
  turnTimer: 'จับเวลาต่อตา',
  turnTimerBlurb: 'แสดงเวลานับถอยหลังบนการ์ดทุกใบ',
  timePerTurn: 'เวลาต่อหนึ่งตา',
  minutes: (mmss: string) => `${mmss} นาที`,
  lessTimeA11y: 'ลดเวลาต่อตา',
  moreTimeA11y: 'เพิ่มเวลาต่อตา',
  allowPassing: 'ให้ข้ามได้',
  allowPassingBlurb: 'มีปุ่มข้ามบนการ์ดทุกใบ',
  language: 'ภาษา',
  languageBlurb: 'ทั้งตัวแอปและคำถาม',
  theme: 'ธีม',
  themeBlurb: 'สว่างหรือมืด',
  themeLight: 'สว่าง',
  themeDark: 'มืด',
  themeA11y: (name: string) => `เปลี่ยนธีมแอปเป็น${name}`,
  privacyPolicy: 'นโยบายความเป็นส่วนตัว',
  privacyPolicyBlurb: 'แอปเก็บอะไรไว้ และเก็บที่ไหน',
  privacyPolicyA11y: 'เปิดนโยบายความเป็นส่วนตัวในเบราว์เซอร์',
  dealFrom: (name: string) => `แจกจาก${name}`,

  // Subscription
  locked: 'ล็อกอยู่',
  lockedA11y: (name: string) => `${name} — ปลดล็อกด้วย Azolla Deeper`,
  proName: 'Azolla Deeper',
  proTitle: 'คำถามที่เปลี่ยนบางอย่างระหว่างเรา',
  proSubtitle: 'การละลายพฤติกรรมเป็นของฟรี ส่วน Deeper มีไว้สำหรับคนที่นั่งใกล้คุณอยู่แล้ว',
  proFeatureLevels: 'ระดับ 6–10 — เรื่องที่ปกติไม่เคยพูดออกมา',
  proFeatureDecks: 'ครบทุกความสัมพันธ์: เพื่อนเก่า เพื่อนสนิท คนรัก ครอบครัว',
  proFeaturePacks: 'แพ็กธีมครบทั้ง 4 ชุด รวม After midnight',
  proFeatureCustom: 'เขียนคำถามเอง แล้วเล่นได้เหมือนสำรับปกติ',
  proMonthly: 'รายเดือน',
  proYearly: 'รายปี',
  proYearlyNote: 'คุ้มที่สุด',
  proCta: 'สมัครสมาชิก',
  proRestore: 'กู้คืนการซื้อ',
  proRestored: 'ได้สมาชิกกลับคืนแล้ว',
  proRestoreFailed: 'ไม่พบการซื้อก่อนหน้าในบัญชีนี้',
  proClose: 'ไว้ก่อน',
  proCloseA11y: 'ปิดหน้านี้และใช้เวอร์ชันฟรีต่อ',
  proUnavailable: 'สมัครสมาชิกได้ในแอป iOS และ Android',
  proLoading: 'กำลังโหลดแพ็กเกจ…',
  proTerms:
    'ระบบจะเรียกเก็บเงินผ่านบัญชีสโตร์ของคุณเมื่อยืนยันการซื้อ และต่ออายุอัตโนมัติ เว้นแต่จะยกเลิกอย่างน้อย 24 ชั่วโมงก่อนรอบถัดไป จัดการหรือยกเลิกได้ตลอดเวลาในการตั้งค่าบัญชีของคุณ',
};

export type Strings = Dict;

export const STRINGS: Record<Lang, Strings> = { en, th };
