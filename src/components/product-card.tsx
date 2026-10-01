import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/data/products';
import { SkincareColors } from '@/constants/skincare-theme';
import { useStore } from '@/context/store-context';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useStore();
  const favorited = isWishlisted(product.id);

  const handlePress = () => {
    Alert.alert('Not Available', 'Product details are not available.');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}>
      <View style={[styles.imageContainer, { backgroundColor: product.bgColor }]}>
        <Image
          source={product.image}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {product.subtitle}
        </Text>
        <Text style={styles.price}>{product.priceFormatted}</Text>
      </View>

      <TouchableOpacity
        style={[styles.heartButton, favorited && styles.heartButtonActive]}
        onPress={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={17}
          color={favorited ? SkincareColors.saleRed : SkincareColors.primaryDark}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: SkincareColors.border,
    shadowColor: '#1A1428',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  imageContainer: {
    width: 74,
    height: 74,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: SkincareColors.primaryDark,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 12,
    color: SkincareColors.textSecondary,
    fontWeight: '400',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
  },
  heartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF9FB',
    borderWidth: 1,
    borderColor: SkincareColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  heartButtonActive: {
    backgroundColor: SkincareColors.saleRedSubtle,
    borderColor: '#FDCED0',
  },
});
