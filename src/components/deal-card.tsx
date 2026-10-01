import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      onPress={onPress}>
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
});
