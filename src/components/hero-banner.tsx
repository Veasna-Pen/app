import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { SkincareColors } from '@/constants/skincare-theme';

interface HeroBannerProps {
  saleLabel?: string;
  title?: string;
  actionLabel?: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  saleLabel = '40% OFF · LIMITED EDIT',
  title = 'Floral Organic\nSkin Care',
  actionLabel = 'Shop featured',
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.bannerContainer}
      activeOpacity={0.92}
      onPress={onPress}>
      <LinearGradient
        colors={['#EDE5F8', '#DDD2F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerGradient}>
        <View style={styles.bannerTextCol}>
          <View style={styles.saleBadge}>
            <Text style={styles.saleTagText}>{saleLabel}</Text>
          </View>
          <Text style={styles.bannerTitle}>{title}</Text>
          <View style={styles.bannerActionRow}>
            <Text style={styles.bannerActionText}>{actionLabel}</Text>
            <Feather name="arrow-right" size={13} color={SkincareColors.primaryDark} />
          </View>
        </View>

        <View style={styles.bannerImageCol}>
          <Image
            source={image}
            style={styles.bannerBottle}
            contentFit="cover"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});
