import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { WelcomeDeal } from '@/data/products';
import { JaggedBadge } from '@/components/jagged-badge';

interface DealCardProps {
  deal: WelcomeDeal;
  index: number;
  isActive: boolean;
  isCompact: boolean;
  cardWidth: number;
  cardHeight: number;
  imageWrapperHeight: number;
  scrollX: Animated.Value;
  snapInterval: number;
  onPress: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  index,
  isActive,
  isCompact,
  cardWidth,
  cardHeight,
  imageWrapperHeight,
  scrollX,
  snapInterval,
  onPress,
}) => {
  const inputRange = [
    (index - 1) * snapInterval,
    index * snapInterval,
    (index + 1) * snapInterval,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.88, 1, 0.88],
    extrapolate: 'clamp',
  });

  const backdropInputRange = [
    (index - 0.75) * snapInterval,
    (index - 0.18) * snapInterval,
    index * snapInterval,
    (index + 0.18) * snapInterval,
    (index + 0.75) * snapInterval,
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

  return (
    <TouchableOpacity
      key={deal.id}
      activeOpacity={0.92}
      style={{ zIndex: isActive ? 20 : 1 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${deal.name}, ${deal.promoPriceFormatted}, was ${deal.originalPriceFormatted}`}>
      <Animated.View
        style={[
          styles.productCard,
          {
            width: cardWidth,
            height: cardHeight,
          },
          isActive
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
        <View
          style={[
            styles.cardImgWrapper,
            { height: imageWrapperHeight },
          ]}>
          <Image
            source={deal.image}
            style={styles.cardImg}
            contentFit="cover"
            transition={200}
            priority="high"
            cachePolicy="memory-disk"
            accessibilityLabel={deal.name}
          />
        </View>

        <View style={styles.cardDiscountBadge}>
          <JaggedBadge
            text={deal.discountBadge}
            size={isCompact ? 42 : 46}
          />
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
        </View>

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
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
  },
  productCardActive: {
    borderColor: '#C084FC',
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
  cardDiscountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 15,
  },
  // Clips the photo to the card's top corners (card radius minus its border);
  // the card itself can't clip without also cutting off its iOS shadow.
  cardImgWrapper: {
    width: '100%',
    borderTopLeftRadius: 16.5,
    borderTopRightRadius: 16.5,
    overflow: 'hidden',
    backgroundColor: '#F5F3FF',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  cardPriceRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
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
});
