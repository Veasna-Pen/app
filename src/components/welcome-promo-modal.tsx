import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/context/store-context';
import { WELCOME_DEALS } from '@/data/products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = Math.min(236, Math.round(SCREEN_WIDTH * 0.64));
const CARD_HEIGHT = 236;
const CARD_GAP = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const HORIZONTAL_INSET = (SCREEN_WIDTH - CARD_WIDTH) / 2;

// 12-pointed scalloped starburst discount badge
const JaggedBadge: React.FC<{
  text: string;
  size?: number;
  color?: string;
  textColor?: string;
}> = ({ text, size = 46, color = '#4ADE80', textColor = '#052E16' }) => {
  const boxSize = size * 0.82;
  const radius = 5;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 3,
      }}>
      <View
        style={{
          position: 'absolute',
          width: boxSize,
          height: boxSize,
          borderRadius: radius,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: boxSize,
          height: boxSize,
          borderRadius: radius,
          backgroundColor: color,
          transform: [{ rotate: '30deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: boxSize,
          height: boxSize,
          borderRadius: radius,
          backgroundColor: color,
          transform: [{ rotate: '60deg' }],
        }}
      />
      <Text
        style={{
          color: textColor,
          fontWeight: '900',
          fontSize: size * 0.27,
          zIndex: 3,
          letterSpacing: -0.5,
        }}>
        {text}
      </Text>
    </View>
  );
};

// 4-Point Sparkling Star with soft pulsing glow
const SparkleStar: React.FC<{
  size?: number;
  color?: string;
  style?: object;
  animValue?: Animated.Value;
}> = ({ size = 20, color = '#FFFFFF', style, animValue }) => {
  const scale = animValue
    ? animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.85, 1.2, 0.85],
      })
    : 1;

  const rotate = animValue
    ? animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
      })
    : '0deg';

  return (
    <Animated.View
      style={[
        styles.sparkleContainer,
        { width: size, height: size },
        { transform: [{ scale }, { rotate }] },
        style,
      ]}
      pointerEvents="none">
      <View
        style={[
          styles.sparkleBeam,
          {
            width: size * 0.22,
            height: size,
            borderRadius: size * 0.11,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.sparkleBeam,
          {
            width: size,
            height: size * 0.22,
            borderRadius: size * 0.11,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.sparkleCore,
          {
            width: size * 0.38,
            height: size * 0.38,
            borderRadius: (size * 0.38) / 2,
            backgroundColor: '#FFFFFF',
            shadowColor: color,
          },
        ]}
      />
    </Animated.View>
  );
};

export const WelcomePromoModal: React.FC = () => {
  const { isWelcomePromoOpen, closeWelcomePromo, claimWelcomeDeal } = useStore();
  const insets = useSafeAreaInsets();

  const [activeIndex, setActiveIndex] = useState(1); // Default to Center Deal (Deluxe Serum)
  const scrollRef = useRef<ScrollView>(null);

  // Animations
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const [sparkleAnim] = useState(() => new Animated.Value(0));
  const [scrollX] = useState(() => new Animated.Value(1 * SNAP_INTERVAL));

  useEffect(() => {
    if (isWelcomePromoOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 75,
          useNativeDriver: true,
        }),
      ]).start();

      const sparkleLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      sparkleLoop.start();

      // Native initial scroll to center deal
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: 1 * SNAP_INTERVAL,
          animated: false,
        });
      }, 40);

      return () => {
        clearTimeout(timer);
        sparkleLoop.stop();
      };
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
    }
  }, [isWelcomePromoOpen, fadeAnim, scaleAnim, sparkleAnim]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      closeWelcomePromo();
    });
  };

  const currentDeal = useMemo(
    () => WELCOME_DEALS[activeIndex] ?? WELCOME_DEALS[0],
    [activeIndex]
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SNAP_INTERVAL);
      if (index >= 0 && index < WELCOME_DEALS.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [activeIndex]
  );

  const scrollToIndex = useCallback((index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({
      x: index * SNAP_INTERVAL,
      animated: true,
    });
  }, []);

  const handleShopNow = () => {
    claimWelcomeDeal(currentDeal);
  };

  if (!isWelcomePromoOpen) return null;

  const boxWidth = Math.min(SCREEN_WIDTH * 0.88, 330);

  return (
    <Modal
      visible={isWelcomePromoOpen}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent>
      <View style={styles.modalRoot}>
        {/* Backdrop tap-to-dismiss */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdropBg} />
        </TouchableWithoutFeedback>

        {/* Foreground Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              paddingTop: Math.max(insets.top + 8, 22),
              paddingBottom: Math.max(insets.bottom + 12, 18),
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          pointerEvents="box-none">
          {/* Headline Section */}
          <View style={styles.headlineContainer}>
            <SparkleStar
              size={18}
              color="#FFE57F"
              animValue={sparkleAnim}
              style={styles.sparkleHeadLeft}
            />
            <SparkleStar
              size={20}
              color="#FFFFFF"
              animValue={sparkleAnim}
              style={styles.sparkleHeadRight}
            />
            <Text style={styles.yellowHeadline}>Extra 20% off</Text>
            <Text style={styles.whiteHeadline}>Free shipping</Text>
          </View>

          <View style={styles.showcaseWrapper}>
            <View style={styles.carouselWrapper}>
              <Animated.ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="start"
                contentOffset={{ x: 1 * SNAP_INTERVAL, y: 0 }}
                contentContainerStyle={[
                  styles.carouselScrollContent,
                  { paddingHorizontal: HORIZONTAL_INSET },
                ]}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  {
                    useNativeDriver: false,
                    listener: handleScroll,
                  }
                )}
                scrollEventThrottle={16}>
                {WELCOME_DEALS.map((deal, idx) => {
                  const inputRange = [
                    (idx - 1) * SNAP_INTERVAL,
                    idx * SNAP_INTERVAL,
                    (idx + 1) * SNAP_INTERVAL,
                  ];

                  const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.85, 1, 0.85],
                    extrapolate: 'clamp',
                  });

                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.15, 1, 0.15],
                    extrapolate: 'clamp',
                  });

                  const translateX = scrollX.interpolate({
                    inputRange,
                    outputRange: [-16, 0, 16],
                    extrapolate: 'clamp',
                  });

                  const rotate = scrollX.interpolate({
                    inputRange,
                    outputRange: ['-3deg', '0deg', '3deg'],
                    extrapolate: 'clamp',
                  });

                  const translateY = scrollX.interpolate({
                    inputRange,
                    outputRange: [6, 0, 6],
                    extrapolate: 'clamp',
                  });

                  const isCurrent = idx === activeIndex;

                  return (
                    <TouchableOpacity
                      key={deal.id}
                      activeOpacity={0.92}
                      style={{ zIndex: isCurrent ? 20 : 1 }}
                      onPress={() => scrollToIndex(idx)}>
                      <Animated.View
                        style={[
                          styles.productCard,
                          isCurrent
                            ? styles.productCardActive
                            : styles.productCardInactive,
                          {
                            transform: [
                              { translateX },
                              { translateY },
                              { scale },
                              { rotate },
                            ],
                            opacity,
                          },
                        ]}>
                        <View style={styles.cardHeader}>
                          <View style={styles.categoryPill}>
                            <Text style={styles.heroSubLabel} numberOfLines={1}>
                              {deal.subtitle}
                            </Text>
                          </View>
                          <Text style={styles.heroTagline} numberOfLines={1}>
                            {deal.name}
                          </Text>
                        </View>

                        <View style={styles.cardDiscountBadge}>
                          <JaggedBadge text={deal.discountBadge} size={46} />
                        </View>

                        <View style={styles.cardImgWrapper}>
                          <LinearGradient
                            colors={['#F5F3FF', '#EDE9FE']}
                            style={styles.cardImgGradient}>
                            <Image
                              source={deal.image}
                              style={styles.cardImg}
                              contentFit="cover"
                            />
                          </LinearGradient>
                        </View>

                        <View style={styles.cardFeatureRow}>
                          <View style={styles.featureIconCircle}>
                            <Ionicons name="sparkles" size={10} color="#0D9488" />
                          </View>
                          <Text style={styles.featureText} numberOfLines={1}>
                            {deal.featureDesc}
                          </Text>
                        </View>

                        <View style={styles.cardPriceRow}>
                          <View style={styles.priceCol}>
                            <Text style={styles.cardPriceMain}>
                              {deal.promoPriceFormatted}
                            </Text>
                            <Text style={styles.cardPriceOriginal}>
                              {deal.originalPriceFormatted}
                            </Text>
                          </View>
                          <View style={styles.saveTag}>
                            <Text style={styles.saveTagText}>
                              SAVE {deal.discountBadge.replace('-', '')}
                            </Text>
                          </View>
                        </View>
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </Animated.ScrollView>
            </View>

            <View style={[styles.boxBase, { width: boxWidth }]}>
              <View style={styles.flapsContainer}>
                <View style={styles.leftFlapContainer}>
                  <LinearGradient
                    colors={['#C084FC', '#9333EA', '#6B21A8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.flapGradient}
                  />
                </View>

                <View style={styles.boxCavity} />

                <View style={styles.rightFlapContainer}>
                  <LinearGradient
                    colors={['#C084FC', '#9333EA', '#6B21A8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.flapGradient}
                  />
                </View>
              </View>

              <LinearGradient
                colors={['#8B5CF6', '#7C3AED', '#5B21B6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.boxFrontFace}>
                <View style={styles.boxTopBevel} />

                {/* Box front face sparkling accents - safely isolated from sliding cards */}
                <SparkleStar
                  size={16}
                  color="#FFFFFF"
                  animValue={sparkleAnim}
                  style={styles.sparkleBoxLeft}
                />
                <SparkleStar
                  size={14}
                  color="#FFE082"
                  animValue={sparkleAnim}
                  style={styles.sparkleBoxRight}
                />

                <View style={styles.boxBannerContainer}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.26)', 'rgba(255,255,255,0.09)']}
                    style={styles.boxBannerInner}>
                    <Text style={styles.bannerSubtitle}>Bundle Deals</Text>
                    <Text style={styles.bannerTitle}>PARTY READY SALE</Text>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>
          </View>

          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={handleShopNow}
            activeOpacity={0.88}>
            <View style={styles.shopNowInner}>
              <Text style={styles.shopNowText}>Shop now</Text>
              <View style={styles.shopNowBadge}>
                <Text style={styles.shopNowBadgeText}>
                  {currentDeal.promoPriceFormatted}
                </Text>
                <Feather name="arrow-right" size={14} color="#052E16" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Feather name="x" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backdropBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(12, 8, 22, 0.66)',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 16,
    width: '100%',
    position: 'relative',
  },
  yellowHeadline: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFE600',
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 230, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  whiteHeadline: {
    fontSize: 25,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  showcaseWrapper: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
  },
  carouselWrapper: {
    width: '100%',
    height: 244,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  carouselScrollContent: {
    paddingVertical: 4,
    gap: CARD_GAP,
    alignItems: 'center',
  },
  productCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
  },
  productCardActive: {
    shadowColor: '#3B0764',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  productCardInactive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 4,
    paddingRight: 48,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginBottom: 2,
  },
  heroSubLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.5,
  },
  heroTagline: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1A1428',
    marginTop: 1,
    letterSpacing: -0.2,
  },
  cardDiscountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 15,
  },
  cardImgWrapper: {
    width: '100%',
    height: 98,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  cardImgGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  cardFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
    paddingHorizontal: 2,
  },
  featureIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 8.5,
    color: '#475569',
    fontWeight: '600',
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#F3F0F8',
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  cardPriceMain: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1428',
    letterSpacing: -0.3,
  },
  cardPriceOriginal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  saveTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  saveTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.3,
  },
  boxBase: {
    marginTop: 4,
    zIndex: 8,
    alignItems: 'center',
  },
  flapsContainer: {
    width: '96%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 20,
    zIndex: 7,
  },
  leftFlapContainer: {
    width: 50,
    height: 18,
    transform: [{ rotate: '-18deg' }, { skewY: '8deg' }],
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  rightFlapContainer: {
    width: 50,
    height: 18,
    transform: [{ rotate: '18deg' }, { skewY: '-8deg' }],
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  flapGradient: {
    flex: 1,
  },
  boxCavity: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(40, 10, 70, 0.4)',
  },
  boxFrontFace: {
    width: '100%',
    height: 76,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
    shadowColor: '#4A0E78',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(216, 180, 254, 0.4)',
  },
  boxTopBevel: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
  },
  boxBannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxBannerInner: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#4ADE80',
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 1,
    textShadowColor: 'rgba(74, 222, 128, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  shopNowBtn: {
    backgroundColor: '#4ADE80',
    width: 285,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 7,
  },
  shopNowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  shopNowText: {
    color: '#052E16',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  shopNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
  },
  shopNowBadgeText: {
    color: '#052E16',
    fontSize: 13,
    fontWeight: '900',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  sparkleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleBeam: {
    position: 'absolute',
  },
  sparkleCore: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 2,
  },
  sparkleHeadLeft: {
    position: 'absolute',
    top: -4,
    left: 20,
    zIndex: 10,
  },
  sparkleHeadRight: {
    position: 'absolute',
    top: -4,
    right: 20,
    zIndex: 10,
  },
  sparkleBoxLeft: {
    position: 'absolute',
    top: 10,
    left: 12,
    zIndex: 10,
  },
  sparkleBoxRight: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    zIndex: 10,
  },
});
