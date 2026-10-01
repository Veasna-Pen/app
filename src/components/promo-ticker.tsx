import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PromoTickerProps {
  hasVoucher: boolean;
  onPress: () => void;
}

export const PromoTicker: React.FC<PromoTickerProps> = ({
  hasVoucher,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.welcomePromoTicker}
      onPress={onPress}
      activeOpacity={0.88}>
      <LinearGradient
        colors={['#06202E', '#0B3A52']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.welcomePromoGradient}>
        <View style={styles.welcomeTickerLeft}>
          <View style={styles.partyTag}>
            <Text style={styles.partyTagText}>BUNDLE DEALS</Text>
          </View>
          <Text style={styles.welcomeTickerText} numberOfLines={1}>
            {hasVoucher
              ? '🎉 Extra 20% OFF Active + Free Shipping'
              : 'Extra 20% off · Free shipping · US $1.79 Deal'}
          </Text>
        </View>
        <View style={styles.welcomeTickerBtn}>
          <Text style={styles.welcomeTickerBtnText}>
            {hasVoucher ? 'View' : 'Claim'}
          </Text>
          <Feather name="chevron-right" size={13} color="#000000" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  welcomePromoTicker: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
    shadowColor: '#0B2231',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomePromoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  welcomeTickerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  partyTag: {
    backgroundColor: 'rgba(255, 230, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE600',
  },
  partyTagText: {
    color: '#FFE600',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  welcomeTickerText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  welcomeTickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 2,
  },
  welcomeTickerBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
});
