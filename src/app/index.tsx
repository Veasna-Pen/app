import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PRODUCTS } from '@/data/products';
import { SkincareColors } from '@/constants/skincare-theme';
import { useStore } from '@/context/store-context';
import { useProductFilter } from '@/hooks/use-product-filter';
import { SearchHeader } from '@/components/search-header';
import { PromoTicker } from '@/components/promo-ticker';
import { HeroBanner } from '@/components/hero-banner';
import { CategoryPills } from '@/components/category-pills';
import { ProductCard } from '@/components/product-card';
import { EmptyState } from '@/components/empty-state';

export default function HomeScreen() {
  const { cartCount, wishlist, openCart, openWelcomePromo, appliedVoucher } = useStore();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    clearFilters,
  } = useProductFilter();

  useEffect(() => {
    const timer = setTimeout(() => {
      openWelcomePromo();
    }, 450);
    return () => clearTimeout(timer);
  }, [openWelcomePromo]);

  const featuredSerum = PRODUCTS[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          wishlistCount={wishlist.length}
          cartCount={cartCount}
          onWishlistPress={() => {
            if (wishlist.length > 0) {
              Alert.alert('Not Available', 'Product details are not available.');
            }
          }}
          onCartPress={openCart}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          <PromoTicker
            hasVoucher={!!appliedVoucher}
            onPress={openWelcomePromo}
          />

          <HeroBanner
            image={featuredSerum.image}
            onPress={() =>
              Alert.alert('Not Available', 'Product details are not available.')
            }
          />

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
              <EmptyState onAction={clearFilters} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
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
});
