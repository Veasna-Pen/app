import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface SparkleStarProps {
  size?: number;
  color?: string;
  style?: object;
  animValue?: Animated.Value;
}

export const SparkleStar: React.FC<SparkleStarProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
  animValue,
}) => {
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

const styles = StyleSheet.create({
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
});
