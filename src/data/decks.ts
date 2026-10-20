import type { ImageSourcePropType } from 'react-native';

import type { IconName } from '../components/Icon';
import type { Lang } from '../i18n/lang';

import { EN } from './content.en';
import { TH } from './content.th';
import type { Content } from './content';

export type Relationship =
  | 'New friend'
  | 'Old friend'
  | 'Best friend'
  | 'Lover'
  | 'Family'
  | 'Colleague'
  | 'Stranger'
  | 'Dark mode'
  | 'Sex mode';

export type ModeId = 'solo' | 'pass' | 'group';
export type PackId = 'dark' | 'sex' | 'first' | 'years' | 'after' | 'repair' | 'custom';
/** The six shipped packs — "custom" is the user's own and has no content entry. */
export type DeckPackId = Exclude<PackId, 'custom'>;
export type BandId = 'warm' | 'real' | 'honest' | 'final';

/** [accent, soft] per relationship — balanced for both Light and Dark surfaces. */
export const HUES: Record<Relationship, readonly [string, string]> = {
  'New friend': ['#2b82d9', 'rgba(43,130,217,.14)'],
  'Old friend': ['#d98218', 'rgba(217,130,24,.15)'],
  'Best friend': ['#1f9d55', 'rgba(31,157,85,.14)'],
  Lover: ['#e0466c', 'rgba(224,70,108,.14)'],
  Family: ['#7c52d9', 'rgba(124,82,217,.14)'],
  Colleague: ['#4b6b8a', 'rgba(75,107,138,.14)'],
  Stranger: ['#c96a28', 'rgba(201,106,40,.14)'],
  'Dark mode': ['#be185d', 'rgba(190,24,93,.15)'],
  'Sex mode': ['#db2777', 'rgba(219,39,119,.15)'],
};

export const BRAND_LOGO: ImageSourcePropType = require('../../assets/icon.png');

export const REL_IMAGES: Record<Relationship, ImageSourcePropType> = {
  'New friend': require('../../assets/cards/new-friend.jpg'),
  'Old friend': require('../../assets/cards/old-friend.jpg'),
  'Best friend': require('../../assets/cards/best-friend.jpg'),
  Lover: require('../../assets/cards/lover.jpg'),
  Family: require('../../assets/cards/family.jpg'),
  Colleague: require('../../assets/cards/colleague.jpg'),
  Stranger: require('../../assets/cards/stranger.jpg'),
  'Dark mode': require('../../assets/cards/dark-mode.jpg'),
  'Sex mode': require('../../assets/cards/sex-mode.jpg'),
};

export const PACK_IMAGES: Record<DeckPackId, ImageSourcePropType> = {
  dark: require('../../assets/cards/dark-mode.jpg'),
  sex: require('../../assets/cards/sex-mode.jpg'),
  first: require('../../assets/cards/pack-first.jpg'),
  years: require('../../assets/cards/pack-years.jpg'),
  after: require('../../assets/cards/pack-after.jpg'),
  repair: require('../../assets/cards/pack-repair.jpg'),
};

export const MODE_ICONS: Record<ModeId, IconName> = {
  solo: 'chat-two',
  pass: 'phone-pass',
  group: 'users-group',
};

export const RELATIONSHIPS = Object.keys(HUES) as Relationship[];

/** Render order for the play modes and the pack list. */
export const MODE_IDS: readonly ModeId[] = ['solo', 'pass', 'group'];
export const PACK_IDS: readonly DeckPackId[] = ['dark', 'sex', 'first', 'years', 'after', 'repair'];

const CONTENT: Record<Lang, Content> = { en: EN, th: TH };

export function contentFor(lang: Lang): Content {
  return CONTENT[lang];
}

/** Upper bound of each band, in order. */
const BAND_MAX: readonly { max: number; id: BandId }[] = [
  { max: 3, id: 'warm' },
  { max: 6, id: 'real' },
  { max: 8, id: 'honest' },
  { max: 10, id: 'final' },
];

export function bandFor(depth: number): BandId {
  return (BAND_MAX.find((b) => depth <= b.max) ?? BAND_MAX[3]).id;
}

export type { Content } from './content';
