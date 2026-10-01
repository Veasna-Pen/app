import { useStore } from '@/context/store-context';
import { WELCOME_DEALS } from '@/data/products';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Responsive dimensions for Android & iOS
  const isCompact = screenHeight < 740 || screenWidth < 370;
  const isSmallHeight = screenHeight < 680;

  const cardWidth = Math.min(
    236,
    Math.max(200, Math.round(screenWidth * (screenWidth < 360 ? 0.72 : 0.64)))
  );
  const cardHeight = isCompact ? 218 : 236;
  const cardGap = 10;
  const snapInterval = cardWidth + cardGap;
  const horizontalInset = Math.max(0, (screenWidth - cardWidth) / 2);
  const boxWidth = Math.min(screenWidth * 0.9, isCompact ? 306 : 332);
  const buttonWidth = Math.min(boxWidth, isCompact ? 276 : 295);
  const imageWrapperHeight = isCompact ? 88 : 100;

  const [activeIndex, setActiveIndex] = useState(1); // Default to Center Deal (Deluxe Serum)
  const scrollRef = useRef<ScrollView>(null);
  const hasInitializedScroll = useRef(false);

  // Animations
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const [sparkleAnim] = useState(() => new Animated.Value(0));
  const [scrollX] = useState(() => new Animated.Value(1 * snapInterval));

  useEffect(() => {
    if (isWelcomePromoOpen) {
      scrollX.setValue(1 * snapInterval);
      hasInitializedScroll.current = false;
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

      // Native initial scroll to center deal (index 1) on both Android & iOS
      const timer = setTimeout(() => {
        if (!hasInitializedScroll.current) {
          hasInitializedScroll.current = true;
          scrollRef.current?.scrollTo({
            x: 1 * snapInterval,
            animated: false,
          });
        }
      }, 60);

      return () => {
        clearTimeout(timer);
        sparkleLoop.stop();
      };
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
    }
  }, [isWelcomePromoOpen, fadeAnim, scaleAnim, sparkleAnim, snapInterval, scrollX]);

  const onCarouselLayout = useCallback(() => {
    if (!hasInitializedScroll.current) {
      hasInitializedScroll.current = true;
      scrollRef.current?.scrollTo({
        x: 1 * snapInterval,
        animated: false,
      });
    }
  }, [snapInterval]);

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
      const index = Math.round(offsetX / snapInterval);
      if (index >= 0 && index < WELCOME_DEALS.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [snapInterval, activeIndex]
  );

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      if (index >= 0 && index < WELCOME_DEALS.length) {
        setActiveIndex(index);
      }
    },
    [snapInterval]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollRef.current?.scrollTo({
        x: index * snapInterval,
        animated: true,
      });
    },
    [snapInterval]
  );

  const handleShopNow = () => {
    claimWelcomeDeal(currentDeal);
  };

  if (!isWelcomePromoOpen) return null;

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

        {/* Top-Right Small Close Button near Status Bar */}
        <Animated.View
          style={[
            styles.closeBtnContainer,
            {
              top: insets.top > 0 ? insets.top + 8 : 16,
              right: 18,
              opacity: fadeAnim,
            },
          ]}>
          <TouchableOpacity
            style={styles.closeBtnTopRight}
            onPress={handleClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Feather name="x" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Foreground Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              paddingTop: Math.max(
                insets.top + (isSmallHeight ? 4 : 8),
                isSmallHeight ? 12 : 20
              ),
              paddingBottom: Math.max(
                insets.bottom + (isSmallHeight ? 6 : 10),
                isSmallHeight ? 10 : 16
              ),
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          pointerEvents="box-none">
          {/* Headline Section */}
          <View
            style={[
              styles.headlineContainer,
              { marginBottom: isSmallHeight ? 3 : 6 },
            ]}>
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
            <Text
              style={[
                styles.yellowHeadline,
                isCompact && styles.yellowHeadlineCompact,
              ]}>
              Extra 20% off
            </Text>
            <Text
              style={[
                styles.whiteHeadline,
                isCompact && styles.whiteHeadlineCompact,
              ]}>
              Free shipping
            </Text>
          </View>

          <View style={styles.showcaseWrapper}>
            <View
              style={[styles.carouselWrapper, { height: cardHeight + 8 }]}>
              <Animated.ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.98}
                snapToInterval={snapInterval}
                snapToAlignment="start"
                disableIntervalMomentum={Platform.OS === 'android'}
                bounces={false}
                overScrollMode="never"
                onLayout={onCarouselLayout}
                contentOffset={{ x: 1 * snapInterval, y: 0 }}
                contentContainerStyle={[
                  styles.carouselScrollContent,
                  { paddingHorizontal: horizontalInset },
                ]}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  {
                    useNativeDriver: false,
                    listener: handleScroll,
                  }
                )}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}>
                {WELCOME_DEALS.map((deal, idx) => {
                  const inputRange = [
                    (idx - 1) * snapInterval,
                    idx * snapInterval,
                    (idx + 1) * snapInterval,
                  ];

                  const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.88, 1, 0.88],
                    extrapolate: 'clamp',
                  });

                  const backdropInputRange = [
                    (idx - 0.75) * snapInterval,
                    (idx - 0.18) * snapInterval,
                    idx * snapInterval,
                    (idx + 0.18) * snapInterval,
                    (idx + 0.75) * snapInterval,
                  ];

                  const backdropOpacity = scrollX.interpolate({
                    inputRange: backdropInputRange,
                    outputRange: [1, 0, 0, 0, 1],
                    extrapolate: 'clamp',
                  });

                  const translateX = scrollX.interpolate({
                    inputRange,
                    outputRange: [-12, 0, 12],
                    extrapolate: 'clamp',
                  });

                  const rotate = scrollX.interpolate({
                    inputRange,
                    outputRange: ['-2.5deg', '0deg', '2.5deg'],
                    extrapolate: 'clamp',
                  });

                  const translateY = scrollX.interpolate({
                    inputRange,
                    outputRange: [4, 0, 4],
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
                          {
                            width: cardWidth,
                            height: cardHeight,
                          },
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
                          <JaggedBadge
                            text={deal.discountBadge}
                            size={isCompact ? 42 : 46}
                          />
                        </View>

                        <View
                          style={[
                            styles.cardImgWrapper,
                            { height: imageWrapperHeight },
                          ]}
                          accessibilityLabel={deal.name}>
                          <LinearGradient
                            colors={['#F5F3FF', '#EDE9FE']}
                            style={styles.cardImgGradient}>
                            <Image
                              source={deal.image}
                              style={styles.cardImg}
                              contentFit="contain"
                              transition={200}
                              priority="high"
                              cachePolicy="memory-disk"
                              accessibilityLabel={deal.name}
                            />
                          </LinearGradient>
                        </View>

                        <View style={styles.cardFeatureRow}>
                          <View style={styles.featureIconCircle}>
                            <Ionicons
                              name="sparkles"
                              size={10}
                              color="#0D9488"
                            />
                          </View>
                          <Text style={styles.featureText} numberOfLines={1}>
                            {deal.featureDesc}
                          </Text>
                        </View>

                        <View style={styles.cardPriceRow}>
                          <View style={styles.priceCol}>
                            <Text
                              style={[
                                styles.cardPriceMain,
                                isCompact && styles.cardPriceMainCompact,
                              ]}>
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

                        {/* Backdrop overlay for left & right inactive cards instead of opacity reduction */}
                        <Animated.View
                          style={[
                            styles.cardBackdropOverlay,
                            { opacity: backdropOpacity },
                          ]}
                          pointerEvents="none">
                          <LinearGradient
                            colors={[
                              'rgba(15, 8, 28, 0.44)',
                              'rgba(30, 14, 52, 0.58)',
                            ]}
                            style={styles.cardBackdropGradient}
                          />
                        </Animated.View>
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
                    colors={[
                      'rgba(255,255,255,0.26)',
                      'rgba(255,255,255,0.09)',
                    ]}
                    style={styles.boxBannerInner}>
                    <Text style={styles.bannerSubtitle}>Bundle Deals</Text>
                    <Text style={styles.bannerTitle}>PARTY READY SALE</Text>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.shopNowBtn,
              {
                width: buttonWidth,
                height: isCompact ? 46 : 52,
                marginTop: isSmallHeight ? 8 : 12,
              },
            ]}
            onPress={handleShopNow}
            activeOpacity={0.88}>
            <View style={styles.shopNowInner}>
              <Text
                style={[
                  styles.shopNowText,
                  isCompact && { fontSize: 15.5 },
                ]}>
                Shop now
              </Text>
              <View style={styles.shopNowBadge}>
                <Text style={styles.shopNowBadgeText}>
                  {currentDeal.promoPriceFormatted}
                </Text>
                <Feather name="arrow-right" size={14} color="#052E16" />
              </View>
            </View>
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
    backgroundColor: 'rgba(12, 8, 22, 0.76)',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  headlineContainer: {
    alignItems: 'center',
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
  yellowHeadlineCompact: {
    fontSize: 26,
    letterSpacing: -0.4,
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
  whiteHeadlineCompact: {
    fontSize: 20,
    marginTop: 0,
    letterSpacing: -0.2,
  },
  showcaseWrapper: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
  },
  carouselWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  carouselScrollContent: {
    paddingVertical: 4,
    gap: 10,
    alignItems: 'center',
  },
  productCard: {
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
    borderRadius: 14,
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
    borderRadius: 14,
    padding: 4,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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
  cardPriceMainCompact: {
    fontSize: 18,
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
  cardBackdropOverlay: {
    position: 'absolute',
    top: -1.5,
    left: -1.5,
    right: -1.5,
    bottom: -1.5,
    borderRadius: 18,
    overflow: 'hidden',
    zIndex: 30,
  },
  cardBackdropGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
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
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
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
  closeBtnContainer: {
    position: 'absolute',
    zIndex: 99,
  },
  closeBtnTopRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'center',
    alignItems: 'center',
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
