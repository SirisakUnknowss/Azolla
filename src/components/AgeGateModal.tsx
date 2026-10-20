import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../i18n';
import { radius, type Palette, type Typo } from '../theme/tokens';
import { useStyles } from '../theme/useStyles';
import { tapLight, tapMedium } from '../util/haptics';

import { Icon } from './Icon';

type Props = {
  modeType: 'Dark mode' | 'Sex mode';
  onConfirm: () => void;
  onCancel: () => void;
};

export function AgeGateModal({ modeType, onConfirm, onCancel }: Props) {
  const { lang } = useI18n();
  const styles = useStyles(makeStyles);
  const isSex = modeType === 'Sex mode';

  const badgeText = isSex
    ? lang === 'th'
      ? 'เนื้อหาสำหรับผู้ใหญ่ 18+'
      : 'ADULTS ONLY · 18+'
    : lang === 'th'
      ? 'คำเตือนเนื้อหาด้านมืด 18+'
      : 'DEEP PSYCHOLOGICAL · 18+';

  const title = isSex
    ? lang === 'th'
      ? 'ยืนยันอายุ 18 ปีขึ้นไป'
      : 'Confirm You Are 18+'
    : lang === 'th'
      ? 'พร้อมเปิดมุมมืดในใจหรือยัง?'
      : 'Ready to Enter the Shadow?';

  const body = isSex
    ? lang === 'th'
      ? 'สำรับนี้มีคำถามเกี่ยวกับเรื่องบนเตียง ความปรารถนา และแฟนตาซีทางเพศอย่างตรงไปตรงมา ออกแบบมาสำหรับผู้ที่มีอายุ 18 ปีขึ้นไปและเล่นโดยความสมัครใจเท่านั้น ทุกคนสามารถกด "ขอผ่าน" ได้ทุกเมื่อ'
      : 'This deck contains explicit questions about intimacy, desire, and sexual fantasies. Intended strictly for consenting adults aged 18+. Anyone may pass on any card at any time.'
    : lang === 'th'
      ? 'สำรับนี้มีคำถามจิตวิทยาเชิงลึกเกี่ยวกับความลับ ความกลัว และด้านมืดในจิตใจ โปรดเล่นด้วยความเคารพพื้นที่ปลอดภัยของกันและกัน และสามารถกด "ขอผ่าน" ได้เสมอ'
      : 'This deck explores deep psychological truths, hidden fears, and moral grey areas. Play with mutual trust and remember anyone can pass at any time.';

  const confirmLabel = lang === 'th' ? 'ฉันอายุ 18+ · เข้าสู่โหมดนี้' : 'I am 18+ · Enter Mode';
  const cancelLabel = lang === 'th' ? 'ย้อนกลับ' : 'Go Back';

  return (
    <View style={styles.backdrop}>
      <LinearGradient
        colors={
          isSex
            ? ['#2b0922', '#3d0c2e', '#1a0514']
            : ['#1a0b18', '#2a0f21', '#120712']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.badge}>
          <Icon name={isSex ? 'heart' : 'shield'} size={13} color="#ff5ca8" />
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            onPress={() => {
              tapMedium();
              onConfirm();
            }}
            style={({ pressed }) => [
              styles.confirmBtn,
              { backgroundColor: isSex ? '#db2777' : '#e11d48' },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            onPress={() => {
              tapLight();
              onCancel();
            }}
            style={({ pressed }) => [
              styles.cancelBtn,
              pressed && { backgroundColor: 'rgba(255,255,255,0.12)' },
            ]}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const makeStyles = (t: Typo, _p: Palette) =>
  StyleSheet.create({
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8, 5, 10, 0.78)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      zIndex: 50,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      borderRadius: radius.card,
      padding: 24,
      borderWidth: 1,
      borderColor: 'rgba(255, 92, 168, 0.4)',
      shadowColor: '#db2777',
      shadowOpacity: 0.35,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      paddingVertical: 5,
      paddingHorizontal: 11,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(255, 92, 168, 0.16)',
      borderWidth: 1,
      borderColor: 'rgba(255, 92, 168, 0.38)',
      marginBottom: 14,
    },
    badgeText: {
      fontFamily: t.font.sansBold,
      fontWeight: '700',
      fontSize: 10.5,
      color: '#ff85c0',
      letterSpacing: 0.4,
    },
    title: {
      fontFamily: t.font.serif,
      fontWeight: '700',
      fontSize: 24,
      lineHeight: t.line(24, 30),
      color: '#fdf2f8',
      marginBottom: 10,
    },
    body: {
      fontFamily: t.font.sans,
      fontSize: 13.5,
      lineHeight: t.line(13.5, 20),
      color: 'rgba(253, 242, 248, 0.8)',
      marginBottom: 22,
    },
    actions: {
      gap: 10,
    },
    confirmBtn: {
      paddingVertical: 14,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '700',
      fontSize: 15,
      color: '#ffffff',
    },
    cancelBtn: {
      paddingVertical: 12,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.14)',
    },
    cancelText: {
      fontFamily: t.font.sansMedium,
      fontWeight: '600',
      fontSize: 14,
      color: 'rgba(253, 242, 248, 0.78)',
    },
  });
