import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/context/store-context';
import { SkincareColors } from '@/constants/skincare-theme';

export const CartModal: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    cartSubtotal,
    discountAmount,
    cartTotal,
    hasFreeShipping,
    appliedVoucher,
    removeVoucher,
    updateQuantity,
    clearCart,
  } = useStore();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={isCartOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={closeCart}>
      <Pressable style={styles.backdrop} onPress={closeCart}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
          onPress={(e) => e.stopPropagation()}>
          <View style={styles.handleContainer}>
            <View style={styles.sheetHandle} />
          </View>

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Shopping Bag</Text>
              <Text style={styles.subtitle}>
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCart}
              activeOpacity={0.7}>
              <Feather name="x" size={18} color={SkincareColors.primaryDark} />
            </TouchableOpacity>
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Feather name="shopping-bag" size={30} color={SkincareColors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Your bag is empty</Text>
              <Text style={styles.emptySubtitle}>
                Explore our floral organic collection and add your favorite skincare
                items.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}>
              {cart.map((item) => (
                <View key={item.product.id} style={styles.cartCard}>
                  <View
                    style={[
                      styles.imageWrapper,
                      { backgroundColor: item.product.bgColor },
                    ]}>
                    <Image
                      source={item.product.image}
                      style={styles.image}
                      contentFit="cover"
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.productVolume}>{item.product.volume}</Text>
                    <Text style={styles.productPrice}>${item.product.price}</Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product.id, -1)}
                      activeOpacity={0.7}>
                      <Feather
                        name={item.quantity === 1 ? 'trash-2' : 'minus'}
                        size={12}
                        color={SkincareColors.primaryDark}
                      />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product.id, 1)}
                      activeOpacity={0.7}>
                      <Feather name="plus" size={12} color={SkincareColors.primaryDark} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {cart.length > 0 && (
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>${cartSubtotal}</Text>
              </View>

              {appliedVoucher && (
                <>
                  <View style={styles.discountRow}>
                    <View style={styles.discountTagRow}>
                      <Text style={styles.discountTagText}>
                        {appliedVoucher.label} ({appliedVoucher.code})
                      </Text>
                      <TouchableOpacity
                        onPress={removeVoucher}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                        <Feather name="x" size={13} color="#E54848" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.discountValueText}>-${discountAmount}</Text>
                  </View>

                  <View style={styles.shippingRow}>
                    <Text style={styles.shippingLabel}>Shipping</Text>
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>
                        {hasFreeShipping ? 'FREE' : '$5.00'}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              <View
                style={[
                  styles.totalRow,
                  appliedVoucher
                    ? {
                        marginTop: 6,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: SkincareColors.borderLight,
                      }
                    : null,
                ]}>
                <Text
                  style={[
                    styles.totalLabel,
                    appliedVoucher
                      ? { fontWeight: '700', color: SkincareColors.primaryDark }
                      : null,
                  ]}>
                  Total
                </Text>
                <Text
                  style={[
                    styles.totalValue,
                    appliedVoucher ? { fontSize: 18, fontWeight: '800' } : null,
                  ]}>
                  ${cartTotal}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => {
                  alert('Thank you! Checkout completed successfully.');
                  clearCart();
                  closeCart();
                }}
                activeOpacity={0.88}>
                <Text style={styles.checkoutBtnText}>Checkout (${cartTotal})</Text>
                <Feather name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 15, 30, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: SkincareColors.borderLight,
    shadowColor: '#1A1428',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 14,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4DFEC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
  },
  subtitle: {
    fontSize: 12,
    color: SkincareColors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF9FB',
    borderWidth: 1,
    borderColor: SkincareColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    maxHeight: 320,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 9,
    borderWidth: 1,
    borderColor: SkincareColors.border,
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: SkincareColors.primaryDark,
  },
  productVolume: {
    fontSize: 11,
    color: SkincareColors.textMuted,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FB',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: SkincareColors.border,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SkincareColors.borderLight,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    paddingHorizontal: 8,
  },
  footer: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: SkincareColors.borderLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    color: SkincareColors.textSecondary,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SkincareColors.primaryDark,
    borderRadius: 24,
    paddingVertical: 14,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAF9FB',
    borderWidth: 1,
    borderColor: SkincareColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: SkincareColors.primaryDark,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: SkincareColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  discountTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FDF0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C3F6D4',
    gap: 6,
  },
  discountTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  discountValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  shippingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  shippingLabel: {
    fontSize: 13,
    color: SkincareColors.textSecondary,
  },
  freeBadge: {
    backgroundColor: '#E8FDF0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
});
