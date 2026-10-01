import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { SkincareColors } from '@/constants/skincare-theme';
import { useStore } from '@/context/store-context';

export const ToastBanner: React.FC = () => {
  const { toastMessage } = useStore();
  const insets = useSafeAreaInsets();

  if (!toastMessage) return null;

  return (
    <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="none">
      <View style={styles.toast}>
        <Feather name="check-circle" size={16} color="#4ADE80" style={styles.icon} />
        <Text style={styles.text}>{toastMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SkincareColors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#1A1428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    marginRight: 7,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
