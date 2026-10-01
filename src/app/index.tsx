import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { PRODUCTS } from '@/data/products';
import { SkincareColors } from '@/constants/skincare-theme';
import { useStore } from '@/context/store-context';
import { ProductCard } from '@/components/product-card';
import { CategoryPills } from '@/components/category-pills';

export default function HomeScreen() {
  const { cartCount, wishlist, openCart, openWelcomePromo, appliedVoucher } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      openWelcomePromo();
    }, 450);
    return () => clearTimeout(timer);
  }, [openWelcomePromo]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory.toLowerCase() === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredSerum = PRODUCTS[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Top Header Bar */}
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
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Feather name="x" size={16} color={SkincareColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Top Actions: Wishlist & Bag */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                // If wishlist has items, quick-filter or alert
                if (wishlist.length > 0) {
                  const firstWish = PRODUCTS.find((p) => wishlist.includes(p.id));
                  if (firstWish) {
                    router.push({
                      pathname: '/product/[id]',
                      params: { id: firstWish.id },
                    });
                  }
                }
              }}
              activeOpacity={0.75}>
              <Ionicons
                name={wishlist.length > 0 ? 'heart' : 'heart-outline'}
                size={20}
                color={wishlist.length > 0 ? '#E14D4D' : SkincareColors.primaryDark}
              />
              {wishlist.length > 0 && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>{wishlist.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={openCart}
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* Claim */}
          <TouchableOpacity
            style={styles.welcomePromoTicker}
            onPress={openWelcomePromo}
            activeOpacity={0.88}>
            <LinearGradient
              colors={['#1E1333', '#2F1E4F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.welcomePromoGradient}>
              <View style={styles.welcomeTickerLeft}>
                <View style={styles.partyTag}>
                  <Text style={styles.partyTagText}>BUNDLE DEALS</Text>
                </View>
                <Text style={styles.welcomeTickerText} numberOfLines={1}>
                  {appliedVoucher
                    ? '🎉 Extra 20% OFF Active + Free Shipping'
                    : 'Extra 20% off · Free shipping · US $1.79 Deal'}
                </Text>
              </View>
              <View style={styles.welcomeTickerBtn}>
                <Text style={styles.welcomeTickerBtnText}>
                  {appliedVoucher ? 'View' : 'Claim'}
                </Text>
                <Feather name="chevron-right" size={13} color="#000000" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bannerContainer}
            activeOpacity={0.92}
            onPress={() =>
              router.push({
                pathname: '/product/[id]',
                params: { id: featuredSerum.id },
              })
            }>
            <LinearGradient
              colors={['#EDE5F8', '#DDD2F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerGradient}>
              <View style={styles.bannerTextCol}>
                <View style={styles.saleBadge}>
                  <Text style={styles.saleTagText}>40% OFF · LIMITED EDIT</Text>
                </View>
                <Text style={styles.bannerTitle}>
                  Floral Organic{'\n'}Skin Care
                </Text>
                <View style={styles.bannerActionRow}>
                  <Text style={styles.bannerActionText}>Shop featured</Text>
                  <Feather name="arrow-right" size={13} color={SkincareColors.primaryDark} />
                </View>
              </View>

              <View style={styles.bannerImageCol}>
                <Image
                  source={featuredSerum.image}
                  style={styles.bannerBottle}
                  contentFit="cover"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <View style={styles.featuredSection}>
            <View style={styles.featuredHeaderRow}>
              <Text style={styles.featuredHeader}>Featured Products</Text>
              <Text style={styles.featuredCount}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
            {filteredProducts.length === 0 ? (
              <View style={styles.emptySearch}>
                <Feather name="search" size={28} color={SkincareColors.textMuted} style={{ marginBottom: 8 }} />
                <Text style={styles.emptyText}>No products found</Text>
                <TouchableOpacity
                  style={styles.clearFilterBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}>
                  <Text style={styles.resetFilterText}>Clear filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SkincareColors.background,
  },
  container: {
    flex: 1,
  },
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  bannerContainer: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ECE4F4',
    shadowColor: '#1A1428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 22,
    minHeight: 164,
  },
  bannerTextCol: {
    flex: 1.25,
    justifyContent: 'center',
  },
  saleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  saleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  bannerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  bannerActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: SkincareColors.primaryDark,
  },
  bannerImageCol: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBottle: {
    width: 110,
    height: 130,
    borderRadius: 16,
  },
  featuredSection: {
    marginTop: 4,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  featuredHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    letterSpacing: -0.2,
  },
  featuredCount: {
    fontSize: 12,
    color: SkincareColors.textMuted,
    fontWeight: '500',
  },
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
  welcomePromoTicker: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
    shadowColor: '#1A1428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomePromoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  welcomeTickerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  partyTag: {
    backgroundColor: 'rgba(255, 230, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE600',
  },
  partyTagText: {
    color: '#FFE600',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  welcomeTickerText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  welcomeTickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 2,
  },
  welcomeTickerBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
});
