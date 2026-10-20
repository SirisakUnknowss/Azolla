import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export type IconName =
  | 'sun'
  | 'moon'
  | 'flame'
  | 'lock'
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
};

/**
 * Crisp vector SVG icons (24x24 viewBox, 2px rounded strokes) across iOS, Android, and Web.
 */
export function Icon({ name, size = 18, color }: Props) {
  const strokeProps = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'sun':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="4.5" {...strokeProps} />
          <Line x1="12" y1="2" x2="12" y2="4.5" {...strokeProps} />
          <Line x1="12" y1="19.5" x2="12" y2="22" {...strokeProps} />
          <Line x1="4.93" y1="4.93" x2="6.7" y2="6.7" {...strokeProps} />
          <Line x1="17.3" y1="17.3" x2="19.07" y2="19.07" {...strokeProps} />
          <Line x1="2" y1="12" x2="4.5" y2="12" {...strokeProps} />
          <Line x1="19.5" y1="12" x2="22" y2="12" {...strokeProps} />
          <Line x1="4.93" y1="19.07" x2="6.7" y2="17.3" {...strokeProps} />
          <Line x1="17.3" y1="6.7" x2="19.07" y2="4.93" {...strokeProps} />
        </Svg>
      );

    case 'moon':
    case 'pack-after':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            {...strokeProps}
          />
        </Svg>
      );

    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill={color}
            fillOpacity={0.18}
            {...strokeProps}
          />
        </Svg>
      );

    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="11" width="16" height="10" rx="2.5" {...strokeProps} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...strokeProps} />
        </Svg>
      );

    case 'cards':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="4" width="13" height="16" rx="2.5" {...strokeProps} />
          <Path d="M4 8v10a2.5 2.5 0 0 0 2.5 2.5H15" {...strokeProps} />
        </Svg>
      );

    case 'bookmark':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" {...strokeProps} />
        </Svg>
      );

    case 'bookmark-filled':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
            fill={color}
            {...strokeProps}
          />
        </Svg>
      );

    case 'sliders':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1="4" y1="6" x2="20" y2="6" {...strokeProps} />
          <Line x1="4" y1="12" x2="20" y2="12" {...strokeProps} />
          <Line x1="4" y1="18" x2="20" y2="18" {...strokeProps} />
          <Circle cx="9" cy="6" r="2.2" fill={color} {...strokeProps} />
          <Circle cx="15" cy="12" r="2.2" fill={color} {...strokeProps} />
          <Circle cx="10" cy="18" r="2.2" fill={color} {...strokeProps} />
        </Svg>
      );

    case 'sparkle':
    case 'pack-first':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3l2.2 6.3L20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.7L12 3z"
            fill={color}
            fillOpacity={0.18}
            {...strokeProps}
          />
        </Svg>
      );

    case 'heart':
    case 'pack-repair':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill={color}
            fillOpacity={0.18}
            {...strokeProps}
          />
        </Svg>
      );

    case 'clock':
    case 'pack-years':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" {...strokeProps} />
          <Polyline points="12 7 12 12 15.5 14" {...strokeProps} />
        </Svg>
      );

    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20v-9.5z" {...strokeProps} />
          <Path d="M9 21.5V13h6v8.5" {...strokeProps} />
        </Svg>
      );

    case 'briefcase':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="7" width="18" height="13" rx="2.5" {...strokeProps} />
          <Path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...strokeProps} />
        </Svg>
      );

    case 'dice':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3.5" y="3.5" width="17" height="17" rx="3.5" {...strokeProps} />
          <Circle cx="8.5" cy="8.5" r="1.4" fill={color} />
          <Circle cx="15.5" cy="8.5" r="1.4" fill={color} />
          <Circle cx="12" cy="12" r="1.4" fill={color} />
          <Circle cx="8.5" cy="15.5" r="1.4" fill={color} />
          <Circle cx="15.5" cy="15.5" r="1.4" fill={color} />
        </Svg>
      );

    case 'chat-two':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...strokeProps} />
        </Svg>
      );

    case 'phone-pass':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="2.5" width="12" height="19" rx="2.5" {...strokeProps} />
          <Line x1="11" y1="18" x2="13" y2="18" {...strokeProps} />
        </Svg>
      );

    case 'users-group':
    case 'wave':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...strokeProps} />
          <Circle cx="9.5" cy="7" r="4" {...strokeProps} />
          <Path d="M22 21v-2a4 4 0 0 0-3-3.87" {...strokeProps} />
          <Path d="M16 3.13a4 4 0 0 1 0 7.75" {...strokeProps} />
        </Svg>
      );

    case 'pen':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 20h9" {...strokeProps} />
          <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" {...strokeProps} />
        </Svg>
      );

    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Polyline points="20 6 9 17 4 12" {...strokeProps} strokeWidth={2.5} />
        </Svg>
      );

    case 'arrow-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1="19" y1="12" x2="5" y2="12" {...strokeProps} />
          <Polyline points="12 19 5 12 12 5" {...strokeProps} />
        </Svg>
      );

    case 'arrow-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1="5" y1="12" x2="19" y2="12" {...strokeProps} />
          <Polyline points="12 5 19 12 12 19" {...strokeProps} />
        </Svg>
      );

    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1="18" y1="6" x2="6" y2="18" {...strokeProps} />
          <Line x1="6" y1="6" x2="18" y2="18" {...strokeProps} />
        </Svg>
      );

    case 'external':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" {...strokeProps} />
          <Polyline points="15 3 21 3 21 9" {...strokeProps} />
          <Line x1="10" y1="14" x2="21" y2="3" {...strokeProps} />
        </Svg>
      );

    case 'leaf':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"
            {...strokeProps}
          />
          <Path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" {...strokeProps} />
        </Svg>
      );

    case 'share':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" {...strokeProps} />
          <Polyline points="16 6 12 2 8 6" {...strokeProps} />
          <Line x1="12" y1="2" x2="12" y2="15" {...strokeProps} />
        </Svg>
      );

    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...strokeProps} />
        </Svg>
      );
  }
}
