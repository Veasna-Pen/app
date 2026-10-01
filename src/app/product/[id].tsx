import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { PRODUCTS, Product } from '@/data/products';
import { SkincareColors } from '@/constants/skincare-theme';
import { useStore } from '@/context/store-context';
import { AvatarStack } from '@/components/avatar-stack';

interface SizeOption {
  id: string;
  size: string;
  label: string;
  price: number;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const {
    addToCart,
    cartCount,
    openCart,
    isWishlisted,
    toggleWishlist,
  } = useStore();

  const product =
    PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const favorited = isWishlisted(product.id);

  // Dynamic size options derived from product
  const sizeOptions: SizeOption[] = useMemo(() => [
    {
      id: 'travel',
      size: '50ml',
      label: 'Travel',
      price: Math.max(48, Math.round(product.price * 0.65)),
    },
    {
      id: 'standard',
      size: product.volume,
      label: 'Full Ritual',
      price: product.price,
    },
    {
      id: 'reserve',
      size: '200ml',
      label: 'Studio Duo',
      price: Math.round(product.price * 1.45),
    },
  ], [product]);

  const [selectedSize, setSelectedSize] = useState<SizeOption>(sizeOptions[1]);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<'ritual' | 'conscious' | null>(null);

  const toggleSection = (section: 'ritual' | 'conscious') => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleAddToCart = () => {
    const customizedProduct: Product = {
      ...product,
      volume: selectedSize.size,
      price: selectedSize.price,
      priceFormatted: `$${selectedSize.price}`,
    };
    addToCart(customizedProduct, quantity);
  };

  return (
    <View style={styles.container}>
      {/* Top Minimal Navigation Bar */}
      <SafeAreaView edges={['top']} style={styles.navHeaderSafeArea}>
        <View style={styles.navHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="arrow-left" size={20} color={SkincareColors.primaryDark} />
          </TouchableOpacity>

          <View style={styles.navTitleContainer}>
            <Text style={styles.navCategory}>
              {product.category.toUpperCase()} · LAB N°01
            </Text>
          </View>

          <View style={styles.navActionRow}>
            <TouchableOpacity
              style={[styles.navButton, favorited && styles.navButtonActive]}
              onPress={() => toggleWishlist(product.id)}
              activeOpacity={0.75}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={18}
                color={favorited ? SkincareColors.saleRed : SkincareColors.primaryDark}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={openCart}
              activeOpacity={0.75}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="shopping-bag" size={18} color={SkincareColors.primaryDark} />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Main Continuous Editorial Scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Studio Gallery Frame */}
        <View style={styles.galleryWrapper}>
          <View style={[styles.galleryCanvas, { backgroundColor: product.bgColor }]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.45)', 'rgba(235, 228, 245, 0.9)']}
              style={StyleSheet.absoluteFill}
            />

            {/* Micro Studio Badges */}
            <View style={styles.studioBadgeTop}>
              <View style={styles.microPill}>
                <Text style={styles.microPillText}>100% BOTANICAL</Text>
              </View>
              <View style={styles.microPill}>
                <Text style={styles.microPillText}>CLINICALLY PROVEN</Text>
              </View>
            </View>

            {/* Product Centerpiece */}
            <View style={styles.bottleContainer}>
              <Image
                source={product.image}
                style={styles.productImage}
                contentFit="contain"
                transition={300}
              />
            </View>

            {/* Bottom Format Badge */}
            <View style={styles.studioBadgeBottom}>
              <Text style={styles.studioBadgeText}>FLORAL ESSENCE · {selectedSize.size}</Text>
            </View>
          </View>
        </View>

        {/* Product Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrowText}>
              FORMULA NO. 01 · {product.category.toUpperCase()}
            </Text>
            <View style={styles.originTag}>
              <Text style={styles.originTagText}>PURE CONCENTRATE</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productSubtitle}>{product.subtitle}</Text>

          {/* Minimalist Social Proof Pill */}
          <View style={styles.socialProofBar}>
            <View style={styles.ratingScoreWrap}>
              <Ionicons name="star" size={13} color={SkincareColors.ratingGold} />
              <Text style={styles.ratingScoreText}>{product.rating}</Text>
              <Text style={styles.ratingReviewCount}>({product.reviewCount})</Text>
            </View>
            <View style={styles.socialProofDivider} />
            <AvatarStack countLabel={product.reviewCount} size={28} />
          </View>

          {/* Editorial Narrative */}
          <Text style={styles.narrativeText}>{product.description}</Text>

          {/* Size & Format Selector */}
          <View style={styles.selectorSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>SELECT FORMAT</Text>
              <Text style={styles.selectedSizeHint}>{selectedSize.size}</Text>
            </View>

            <View style={styles.sizeOptionsRow}>
              {sizeOptions.map((opt) => {
                const isSelected = opt.id === selectedSize.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.sizeCard, isSelected && styles.sizeCardActive]}
                    onPress={() => setSelectedSize(opt)}
                    activeOpacity={0.8}>
                    <Text
                      style={[
                        styles.sizeCardVolume,
                        isSelected && styles.sizeCardVolumeActive,
                      ]}>
                      {opt.size}
                    </Text>
                    <Text
                      style={[
                        styles.sizeCardLabel,
                        isSelected && styles.sizeCardLabelActive,
                      ]}>
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.sizeCardPrice,
                        isSelected && styles.sizeCardPriceActive,
                      ]}>
                      ${opt.price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Architectural Formula Matrix (2x2 Spec Grid) */}
          <View style={styles.matrixContainer}>
            <View style={styles.matrixRow}>
              <View style={[styles.matrixCell, styles.matrixBorderRight, styles.matrixBorderBottom]}>
                <Text style={styles.matrixCellLabel}>SKIN TYPE</Text>
                <Text style={styles.matrixCellValue}>All Types · Sensitive</Text>
              </View>
              <View style={[styles.matrixCell, styles.matrixBorderBottom]}>
                <Text style={styles.matrixCellLabel}>TEXTURE</Text>
                <Text style={styles.matrixCellValue}>Silky Essence</Text>
              </View>
            </View>
            <View style={styles.matrixRow}>
              <View style={[styles.matrixCell, styles.matrixBorderRight]}>
                <Text style={styles.matrixCellLabel}>KEY EXTRACT</Text>
                <Text style={styles.matrixCellValue}>Organic Lavender</Text>
              </View>
              <View style={styles.matrixCell}>
                <Text style={styles.matrixCellLabel}>FINISH</Text>
                <Text style={styles.matrixCellValue}>Dewy · Non-greasy</Text>
              </View>
            </View>
          </View>

          {/* Key Targeted Benefits */}
          {product.keyBenefits && product.keyBenefits.length > 0 && (
            <View style={styles.benefitsSection}>
              <Text style={styles.sectionLabel}>TARGETED BENEFITS</Text>
              <View style={styles.benefitsWrap}>
                {product.keyBenefits.map((benefit, i) => (
                  <View key={i} style={styles.benefitTag}>
                    <Feather
                      name="check"
                      size={12}
                      color={SkincareColors.primaryDark}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.benefitTagText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Expandable Editorial Accordions */}
          <View style={styles.accordionContainer}>
            {/* The Application Ritual */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection('ritual')}
              activeOpacity={0.7}>
              <View style={styles.accordionTitleRow}>
                <Feather name="moon" size={14} color={SkincareColors.primaryDark} style={{ marginRight: 8 }} />
                <Text style={styles.accordionTitle}>The Application Ritual</Text>
              </View>
              <Feather
                name={expandedSection === 'ritual' ? 'minus' : 'plus'}
                size={16}
                color={SkincareColors.primaryDark}
              />
            </TouchableOpacity>
            {expandedSection === 'ritual' && (
              <View style={styles.accordionBody}>
                <View style={styles.ritualStep}>
                  <Text style={styles.ritualStepNum}>01</Text>
                  <Text style={styles.ritualStepText}>
                    Cleanse face and neck with lukewarm water. Pat skin dry.
                  </Text>
                </View>
                <View style={styles.ritualStep}>
                  <Text style={styles.ritualStepNum}>02</Text>
                  <Text style={styles.ritualStepText}>
                    Dispense 3 to 4 drops of nectar onto the fingertips.
                  </Text>
                </View>
                <View style={styles.ritualStep}>
                  <Text style={styles.ritualStepNum}>03</Text>
                  <Text style={styles.ritualStepText}>
                    Press gently into your complexion with upward soothing sweeps.
                  </Text>
                </View>
              </View>
            )}

            {/* Conscious Formulation & Ethics */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection('conscious')}
              activeOpacity={0.7}>
              <View style={styles.accordionTitleRow}>
                <Feather name="shield" size={14} color={SkincareColors.primaryDark} style={{ marginRight: 8 }} />
                <Text style={styles.accordionTitle}>Conscious Formula & Ethics</Text>
              </View>
              <Feather
                name={expandedSection === 'conscious' ? 'minus' : 'plus'}
                size={16}
                color={SkincareColors.primaryDark}
              />
            </TouchableOpacity>
            {expandedSection === 'conscious' && (
              <View style={styles.accordionBody}>
                <Text style={styles.consciousText}>
                  Formulated without parabens, sulfates, silicones, or synthetic dyes. Hand-harvested organic botanical actives encased in 100% recyclable frosted laboratory glass.
                </Text>
              </View>
            )}
          </View>

          {/* Customer Voice Card */}
          <View style={styles.reviewCard}>
            <View style={styles.reviewStarRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name="star" size={11} color={SkincareColors.ratingGold} style={{ marginRight: 2 }} />
              ))}
              <Text style={styles.reviewVerified}>Verified Buyer</Text>
            </View>
            <Text style={styles.reviewQuote}>
              &ldquo;A revelation for sensitive, reactive skin. Hydrates instantly without heaviness, and the subtle floral aroma feels like a daily sanctuary.&rdquo;
            </Text>
            <Text style={styles.reviewAuthor}>Eleanor V. · Stockholm</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Minimalist Purchase Dock */}
      <SafeAreaView edges={['bottom']} style={styles.dockSafeArea}>
        <View style={styles.dockContainer}>
          {/* Price & Shipping Info */}
          <View style={styles.dockPriceCol}>
            <View style={styles.dockPriceRow}>
              <Text style={styles.dockPrice}>${selectedSize.price * quantity}</Text>
              {quantity > 1 && (
                <Text style={styles.dockSinglePrice}>(${selectedSize.price} each)</Text>
              )}
            </View>
            <Text style={styles.dockShipping}>Complimentary Delivery</Text>
          </View>

          {/* Quantity Stepper & Add to Bag */}
          <View style={styles.dockActionRow}>
            <View style={styles.dockStepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                activeOpacity={0.7}>
                <Feather name="minus" size={13} color={SkincareColors.primaryDark} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => q + 1)}
                activeOpacity={0.7}>
                <Feather name="plus" size={13} color={SkincareColors.primaryDark} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addToBagBtn}
              onPress={handleAddToCart}
              activeOpacity={0.88}>
              <Feather name="shopping-bag" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.addToBagText}>Add To Bag</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SkincareColors.background,
  },
  navHeaderSafeArea: {
    backgroundColor: SkincareColors.background,
    borderBottomWidth: 1,
    borderBottomColor: SkincareColors.borderLight,
    zIndex: 10,
  },
  navHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SkincareColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navButtonActive: {
    backgroundColor: SkincareColors.saleRedSubtle,
    borderColor: '#FDCED0',
  },
  navTitleContainer: {
    alignItems: 'center',
  },
  navCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: SkincareColors.textSecondary,
    letterSpacing: 1.2,
  },
  navActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: SkincareColors.primaryDark,
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
  },
  galleryWrapper: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  galleryCanvas: {
    width: '100%',
    height: 330,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SkincareColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  studioBadgeTop: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  microPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  microPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    letterSpacing: 0.6,
  },
  bottleContainer: {
    width: '75%',
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  studioBadgeBottom: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  studioBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    letterSpacing: 0.8,
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  eyebrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: SkincareColors.textMuted,
    letterSpacing: 0.9,
  },
  originTag: {
    backgroundColor: SkincareColors.surfaceSubtle,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  originTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 13,
    color: SkincareColors.textSecondary,
    marginBottom: 14,
  },
  socialProofBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: SkincareColors.border,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  ratingScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
  },
  ratingReviewCount: {
    fontSize: 11,
    color: SkincareColors.textSecondary,
  },
  socialProofDivider: {
    width: 1,
    height: 16,
    backgroundColor: SkincareColors.border,
    marginHorizontal: 10,
  },
  narrativeText: {
    fontSize: 13,
    lineHeight: 21,
    color: SkincareColors.textSecondary,
    marginBottom: 20,
  },
  selectorSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SkincareColors.textMuted,
    letterSpacing: 0.8,
  },
  selectedSizeHint: {
    fontSize: 12,
    fontWeight: '600',
    color: SkincareColors.primaryDark,
  },
  sizeOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: SkincareColors.border,
    alignItems: 'center',
  },
  sizeCardActive: {
    borderColor: SkincareColors.primaryDark,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  sizeCardVolume: {
    fontSize: 13,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    marginBottom: 2,
  },
  sizeCardVolumeActive: {
    color: SkincareColors.primaryDark,
  },
  sizeCardLabel: {
    fontSize: 10,
    color: SkincareColors.textMuted,
    marginBottom: 4,
  },
  sizeCardLabelActive: {
    color: SkincareColors.textSecondary,
    fontWeight: '600',
  },
  sizeCardPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: SkincareColors.textSecondary,
  },
  sizeCardPriceActive: {
    color: SkincareColors.primaryDark,
  },
  matrixContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SkincareColors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  matrixRow: {
    flexDirection: 'row',
  },
  matrixCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  matrixBorderRight: {
    borderRightWidth: 1,
    borderRightColor: SkincareColors.border,
  },
  matrixBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: SkincareColors.border,
  },
  matrixCellLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: SkincareColors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  matrixCellValue: {
    fontSize: 12,
    fontWeight: '600',
    color: SkincareColors.primaryDark,
  },
  benefitsSection: {
    marginBottom: 20,
  },
  benefitsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  benefitTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SkincareColors.border,
  },
  benefitTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: SkincareColors.primaryDark,
  },
  accordionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SkincareColors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: SkincareColors.borderLight,
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF9FB',
    borderBottomWidth: 1,
    borderBottomColor: SkincareColors.borderLight,
  },
  ritualStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ritualStepNum: {
    fontSize: 11,
    fontWeight: '700',
    color: SkincareColors.textMuted,
    width: 22,
  },
  ritualStepText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: SkincareColors.textSecondary,
  },
  consciousText: {
    fontSize: 12,
    lineHeight: 18,
    color: SkincareColors.textSecondary,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: SkincareColors.border,
  },
  reviewStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewVerified: {
    fontSize: 10,
    color: SkincareColors.textMuted,
    fontWeight: '600',
    marginLeft: 6,
  },
  reviewQuote: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    color: SkincareColors.primaryDark,
    marginBottom: 6,
  },
  reviewAuthor: {
    fontSize: 11,
    fontWeight: '600',
    color: SkincareColors.textSecondary,
  },
  dockSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 249, 251, 0.96)',
    borderTopWidth: 1,
    borderTopColor: SkincareColors.borderLight,
  },
  dockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  dockPriceCol: {
    justifyContent: 'center',
  },
  dockPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  dockPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
  },
  dockSinglePrice: {
    fontSize: 11,
    color: SkincareColors.textMuted,
  },
  dockShipping: {
    fontSize: 10,
    color: SkincareColors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  dockActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dockStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SkincareColors.border,
    borderRadius: 18,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9FB',
  },
  stepperValue: {
    fontSize: 12,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    paddingHorizontal: 8,
  },
  addToBagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SkincareColors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
  },
  addToBagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
