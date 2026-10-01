import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SkincareColors } from '@/constants/skincare-theme';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  wishlistCount: number;
  cartCount: number;
  onWishlistPress: () => void;
  onCartPress: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  wishlistCount,
  cartCount,
  onWishlistPress,
  onCartPress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.searchBar}>
        <Feather
          name="search"
          size={18}
          color={SkincareColors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search skincare products..."
          placeholderTextColor={SkincareColors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="x" size={16} color={SkincareColors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onWishlistPress}
          activeOpacity={0.75}>
          <Ionicons
            name={wishlistCount > 0 ? 'heart' : 'heart-outline'}
            size={20}
            color={wishlistCount > 0 ? '#E14D4D' : SkincareColors.primaryDark}
          />
          {wishlistCount > 0 && (
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>{wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onCartPress}
          activeOpacity={0.75}>
          <Feather
            name="shopping-bag"
            size={19}
            color={SkincareColors.primaryDark}
          />
          {cartCount > 0 && (
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: SkincareColors.border,
    shadowColor: '#1A1428',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: SkincareColors.primaryDark,
    paddingVertical: 0,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SkincareColors.border,
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: SkincareColors.primaryDark,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  actionBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
