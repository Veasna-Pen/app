import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { REVIEW_AVATARS } from '@/data/products';
import { SkincareColors } from '@/constants/skincare-theme';

interface AvatarStackProps {
  countLabel?: string;
  size?: number;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  countLabel = '1k+',
  size = 34,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarRow}>
        {REVIEW_AVATARS.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: index === 0 ? 0 : -10,
                zIndex: index,
              },
            ]}
            contentFit="cover"
            transition={200}
          />
        ))}
        <View
          style={[
            styles.badge,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -10,
              zIndex: REVIEW_AVATARS.length,
            },
          ]}>
          <Text style={styles.badgeText}>{countLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: SkincareColors.avatarBorder,
    backgroundColor: '#EAEAEA',
  },
  badge: {
    backgroundColor: SkincareColors.badgeDark,
    borderWidth: 1.5,
    borderColor: SkincareColors.avatarBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: SkincareColors.badgeDarkText,
    fontSize: 10,
    fontWeight: '700',
  },
});
