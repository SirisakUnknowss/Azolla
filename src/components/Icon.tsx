import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Briefcase,
  Check,
  Clock,
  Crown,
  Dices,
  ExternalLink,
  Flame,
  Heart,
  Home,
  Layers,
  Lock,
  MessagesSquare,
  Moon,
  PenLine,
  Share2,
  ShieldAlert,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sprout,
  Sun,
  Users,
  X,
} from 'lucide-react-native';
import React from 'react';

export type IconName =
  | 'sun'
  | 'moon'
  | 'flame'
  | 'lock'
  | 'crown'
  | 'cards'
  | 'bookmark'
  | 'bookmark-filled'
  | 'sliders'
  | 'sparkle'
  | 'wave'
  | 'clock'
  | 'heart'
  | 'home'
  | 'briefcase'
  | 'dice'
  | 'chat-two'
  | 'phone-pass'
  | 'users-group'
  | 'pack-first'
  | 'pack-years'
  | 'pack-after'
  | 'pack-repair'
  | 'pen'
  | 'check'
  | 'arrow-left'
  | 'arrow-right'
  | 'close'
  | 'external'
  | 'leaf'
  | 'share'
  | 'shield';

type Props = {
  name: IconName;
  size?: number;
  color: string;
  bgColor?: string;
  strokeWidth?: number;
};

/**
 * Official Lucide vector icons (`lucide-react-native`) with clean optical sizing.
 */
export function Icon({ name, size = 18, color, strokeWidth = 2 }: Props) {
  const common = { size, color, strokeWidth };

  switch (name) {
    case 'sun':
      return <Sun {...common} />;
    case 'moon':
    case 'pack-after':
      return <Moon {...common} />;
    case 'flame':
      return <Flame {...common} />;
    case 'lock':
      return <Lock {...common} />;
    case 'crown':
      return <Crown {...common} />;
    case 'cards':
      return <Layers {...common} />;
    case 'bookmark':
      return <Bookmark {...common} />;
    case 'bookmark-filled':
      return <Bookmark {...common} fill={color} />;
    case 'sliders':
      return <SlidersHorizontal {...common} />;
    case 'sparkle':
    case 'pack-first':
      return <Sparkles {...common} />;
    case 'heart':
    case 'pack-repair':
      return <Heart {...common} />;
    case 'clock':
    case 'pack-years':
      return <Clock {...common} />;
    case 'home':
      return <Home {...common} />;
    case 'briefcase':
      return <Briefcase {...common} />;
    case 'dice':
      return <Dices {...common} />;
    case 'chat-two':
      return <MessagesSquare {...common} />;
    case 'phone-pass':
      return <Smartphone {...common} />;
    case 'users-group':
    case 'wave':
      return <Users {...common} />;
    case 'pen':
      return <PenLine {...common} />;
    case 'check':
      return <Check {...common} strokeWidth={2.5} />;
    case 'arrow-left':
      return <ArrowLeft {...common} />;
    case 'arrow-right':
      return <ArrowRight {...common} />;
    case 'close':
      return <X {...common} />;
    case 'external':
      return <ExternalLink {...common} />;
    case 'leaf':
      return <Sprout {...common} />;
    case 'share':
      return <Share2 {...common} />;
    case 'shield':
      return <ShieldAlert {...common} />;
  }
}
