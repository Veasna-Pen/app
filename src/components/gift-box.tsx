import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SparkleStar } from '@/components/sparkle-star';

interface GiftBoxProps {
  width: number;
  sparkleAnim: Animated.Value;
  /** A size down: shorter face, smaller flaps and text. Used on Android. */
  compact?: boolean;
}

export const GiftBox: React.FC<GiftBoxProps> = ({
  width,
  sparkleAnim,
  compact = false,
}) => {
  return (
    <View style={[styles.boxBase, { width }]}>
      <View
        style={[styles.flapsContainer, compact && styles.flapsContainerCompact]}>
        <View style={[styles.leftFlapContainer, compact && styles.flapCompact]}>
          <LinearGradient
            colors={['#6FD3F7', '#00AEEF', '#0079A8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.flapGradient}
          />
        </View>

        <View style={styles.boxCavity} />

        <View style={[styles.rightFlapContainer, compact && styles.flapCompact]}>
          <LinearGradient
            colors={['#6FD3F7', '#00AEEF', '#0079A8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.flapGradient}
          />
        </View>
      </View>

      <LinearGradient
        colors={['#0BA0DA', '#0079AA', '#00587C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.boxFrontFace, compact && styles.boxFrontFaceCompact]}>
        <View style={styles.boxTopBevel} />

        <SparkleStar
          size={compact ? 14 : 16}
          color="#FFFFFF"
          animValue={sparkleAnim}
          style={[styles.sparkleBoxLeft, compact && styles.sparkleBoxLeftCompact]}
        />
        <SparkleStar
          size={compact ? 12 : 14}
          color="#FFE082"
          animValue={sparkleAnim}
          style={[styles.sparkleBoxRight, compact && styles.sparkleBoxRightCompact]}
        />

        <View style={styles.boxBannerContainer}>
          <LinearGradient
            colors={[
              'rgba(0, 45, 66, 0.34)',
              'rgba(0, 45, 66, 0.2)',
            ]}
            style={[styles.boxBannerInner, compact && styles.boxBannerInnerCompact]}>
            <Text
              style={[styles.bannerSubtitle, compact && styles.bannerSubtitleCompact]}>
              Bundle Deals
            </Text>
            <Text style={[styles.bannerTitle, compact && styles.bannerTitleCompact]}>
              PARTY READY SALE
            </Text>
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
    backgroundColor: 'rgba(0, 40, 60, 0.4)',
  },
  boxFrontFace: {
    width: '100%',
    height: 76,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
    shadowColor: '#003C55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(179, 230, 250, 0.45)',
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
    color: '#FFE600',
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 1,
    textShadowColor: 'rgba(255, 230, 0, 0.35)',
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

  // Compact size
  flapsContainerCompact: {
    height: 17,
  },
  flapCompact: {
    width: 42,
    height: 15,
  },
  boxFrontFaceCompact: {
    height: 64,
    borderRadius: 14,
    paddingVertical: 7,
  },
  boxBannerInnerCompact: {
    paddingVertical: 3,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  bannerSubtitleCompact: {
    fontSize: 9.5,
  },
  bannerTitleCompact: {
    fontSize: 13.5,
    letterSpacing: 1,
  },
  sparkleBoxLeftCompact: {
    top: 8,
    left: 10,
  },
  sparkleBoxRightCompact: {
    bottom: 8,
    right: 10,
  },
});
