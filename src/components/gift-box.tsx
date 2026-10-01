import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SparkleStar } from '@/components/sparkle-star';

interface GiftBoxProps {
  width: number;
  sparkleAnim: Animated.Value;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ width, sparkleAnim }) => {
  return (
    <View style={[styles.boxBase, { width }]}>
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
  );
};

const styles = StyleSheet.create({
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
