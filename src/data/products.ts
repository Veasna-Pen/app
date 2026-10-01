import { ImageSourcePropType } from 'react-native';
import { SkincareColors } from '@/constants/skincare-theme';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  volume: string;
  price: number;
  priceFormatted: string;
  category: string;
  bgColor: string;
  image: ImageSourcePropType;
  rating: number;
  reviewCount: string;
  keyBenefits: string[];
}

export interface Category {
  id: string;
  name: string;
  iconName: 'droplet' | 'sun' | 'feather' | 'wind';
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', iconName: 'feather' },
  { id: 'serum', name: 'Serum', iconName: 'droplet' },
  { id: 'cream', name: 'Cream', iconName: 'sun' },
  { id: 'cleanser', name: 'Cleanser', iconName: 'wind' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'floral-skin-serum',
    name: 'Floral Skin Serum',
    subtitle: 'Apply on freshly cleansed skin',
    description:
      'Apply on freshly cleansed skin, then gently massage into your face and neck using upward movement.\n\nFormulated with natural organic lavender and botanical active complexes to deeply hydrate, soothe sensitive tissues, and promote a radiant youthful glow.',
    volume: '120ml + 80ml',
    price: 147,
    priceFormatted: '$147',
    category: 'Serum',
    bgColor: SkincareColors.pastelLavender,
    image: require('@/assets/products/floral-serum.jpg'),
    rating: 4.9,
    reviewCount: '1.2k+',
    keyBenefits: [
      'Organic Lavender Extract',
      'Deep Cellular Moisture',
      'Soothes Irritation & Redness',
      'Cruelty-Free & Vegan',
    ],
  },
  {
    id: 'sensitive-skin-serum',
    name: 'Sensitive Skin Serum',
    subtitle: 'Gently massage into your face',
    description:
      'Gently massage into your face and neck morning and evening. Enriched with eucalyptus, calming chamomile, and pure plant lipids to strengthen skin resilience.',
    volume: '100ml',
    price: 125,
    priceFormatted: '$125',
    category: 'Serum',
    bgColor: SkincareColors.pastelMint,
    image: require('@/assets/products/sensitive-serum.jpg'),
    rating: 4.8,
    reviewCount: '980+',
    keyBenefits: [
      'Eucalyptus & Chamomile',
      'Restores Moisture Barrier',
      'Dermatologist Tested',
      'Fragrance-Free Formula',
    ],
  },
  {
    id: 'oily-skin-serum',
    name: 'Oily Skin Serum',
    subtitle: 'Balances natural oils & hydrates',
    description:
      'Lightweight oil-free serum powered by delicate peach blossom nectar and zinc PCA. Balances sebum production, unclogs pores, and gives a lasting soft-matte finish.',
    volume: '90ml',
    price: 132,
    priceFormatted: '$132',
    category: 'Serum',
    bgColor: SkincareColors.pastelPeach,
    image: require('@/assets/products/oily-serum.jpg'),
    rating: 4.9,
    reviewCount: '1.4k+',
    keyBenefits: [
      'Peach Blossom Nectar',
      'Sebum Control',
      'Non-Comedogenic',
      'Silky Matte Finish',
    ],
  },
  {
    id: 'floral-hydrating-cream',
    name: 'Floral Hydrating Cream',
    subtitle: 'Rich moisture lock barrier cream',
    description:
      'Rich, velvety cream infused with floral rose ceramides that lock in moisture for over 24 hours while defending against environmental pollutants.',
    volume: '60ml',
    price: 98,
    priceFormatted: '$98',
    category: 'Cream',
    bgColor: SkincareColors.pastelLavender,
    image: require('@/assets/products/floral-serum.jpg'),
    rating: 4.9,
    reviewCount: '850+',
    keyBenefits: [
      'Floral Ceramides',
      '24h Hydration Lock',
      'Deep Cell Nourishment',
    ],
  },
  {
    id: 'gentle-foam-cleanser',
    name: 'Gentle Foam Cleanser',
    subtitle: 'Purifying botanical micro-foam',
    description:
      'Gentle, sulfate-free cloud foam cleanses impurities, makeup, and dead skin cells without stripping your skin of vital moisture.',
    volume: '150ml',
    price: 64,
    priceFormatted: '$64',
    category: 'Cleanser',
    bgColor: SkincareColors.pastelMint,
    image: require('@/assets/products/sensitive-serum.jpg'),
    rating: 4.7,
    reviewCount: '620+',
    keyBenefits: [
      'Sulfate-Free Foam',
      'Maintains Healthy pH',
      'Botanical Cleansing Agents',
    ],
  },
];

export const REVIEW_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
];
