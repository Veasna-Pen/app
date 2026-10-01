import React from 'react';
import { View, Text } from 'react-native';

interface JaggedBadgeProps {
  text: string;
  size?: number;
  color?: string;
  textColor?: string;
}

export const JaggedBadge: React.FC<JaggedBadgeProps> = ({
  text,
  size = 46,
  color = '#4ADE80',
  textColor = '#052E16',
}) => {
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
