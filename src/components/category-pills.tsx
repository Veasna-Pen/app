import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CATEGORIES } from '@/data/products';
import { SkincareColors } from '@/constants/skincare-theme';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Check All Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
            (selectedCategory === 'all' && cat.id === 'all');

          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.pill, isSelected && styles.pillActive]}
              onPress={() =>
                onSelectCategory(cat.id === 'all' ? 'all' : cat.name)
              }
              activeOpacity={0.8}>
              <View style={styles.iconWrap}>
                <Feather
                  name={cat.iconName}
                  size={14}
                  color={
                    isSelected
                      ? '#FFFFFF'
                      : SkincareColors.textSecondary
                  }
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isSelected && styles.labelActive,
                ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: SkincareColors.border,
  },
  pillActive: {
    backgroundColor: SkincareColors.primaryDark,
    borderColor: SkincareColors.primaryDark,
  },
  iconWrap: {
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: SkincareColors.textSecondary,
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
