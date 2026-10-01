import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SkincareColors } from '@/constants/skincare-theme';

interface EmptyStateProps {
  icon?: ComponentProps<typeof Feather>['name'];
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search',
  message = 'No products found',
  actionLabel = 'Clear filters',
  onAction,
}) => {
  return (
    <View style={styles.emptySearch}>
      <Feather name={icon} size={28} color={SkincareColors.textMuted} style={{ marginBottom: 8 }} />
      <Text style={styles.emptyText}>{message}</Text>
      {onAction && (
        <TouchableOpacity style={styles.clearFilterBtn} onPress={onAction}>
          <Text style={styles.resetFilterText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptySearch: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyText: {
    fontSize: 14,
    color: SkincareColors.textSecondary,
    marginBottom: 10,
  },
  clearFilterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SkincareColors.border,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: SkincareColors.primaryDark,
  },
});
