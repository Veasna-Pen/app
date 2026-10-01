import { useStore } from '@/context/store-context';
import { WELCOME_DEALS } from '@/data/products';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SparkleStar } from '@/components/sparkle-star';
import { DealCard } from '@/components/deal-card';
import { GiftBox } from '@/components/gift-box';
import { useModalAnimation } from '@/hooks/use-modal-animation';
import { usePromoCarousel } from '@/hooks/use-promo-carousel';

export const WelcomePromoModal: React.FC = () => {
  const { isWelcomePromoOpen, closeWelcomePromo, claimWelcomeDeal } = useStore();
  const insets = useSafeAreaInsets();

  const { fadeAnim, scaleAnim, animatedClose } = useModalAnimation(isWelcomePromoOpen);
  const {
    layout,
    activeIndex,
    currentDeal,
    scrollRef,
    scrollX,
    sparkleAnim,
    handleScroll,
    handleMomentumScrollEnd,
    scrollToIndex,
    onCarouselLayout,
  } = usePromoCarousel(isWelcomePromoOpen);

  const {
    isCompact,
    isSmallHeight,
    cardWidth,
    cardHeight,
    snapInterval,
    horizontalInset,
    boxWidth,
    boxCompact,
    buttonWidth,
    imageWrapperHeight,
  } = layout;

  const handleClose = () => {
    animatedClose(closeWelcomePromo);
  };

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
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdropBg} />
        </TouchableWithoutFeedback>

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
                style={styles.carouselScroll}
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
                {WELCOME_DEALS.map((deal, idx) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    index={idx}
                    isActive={idx === activeIndex}
                    isCompact={isCompact}
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    imageWrapperHeight={imageWrapperHeight}
                    scrollX={scrollX}
                    snapInterval={snapInterval}
                    onPress={() => scrollToIndex(idx)}
                  />
                ))}
              </Animated.ScrollView>
            </View>

            <GiftBox
              width={boxWidth}
              compact={boxCompact}
              sparkleAnim={sparkleAnim}
            />
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
    backgroundColor: 'rgba(4, 18, 28, 0.78)',
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
  // Without an explicit width the centring wrapper sizes the scroll view to its
  // content on web, so it never scrolls and the active card sits off-centre.
  carouselScroll: {
    width: '100%',
  },
  carouselScrollContent: {
    paddingVertical: 4,
    gap: 10,
    alignItems: 'center',
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
});
