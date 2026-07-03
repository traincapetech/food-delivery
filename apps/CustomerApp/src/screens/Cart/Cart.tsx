import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import SafeView from '../../components/common/SafeView';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import useCartStore from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatters';

export const Cart: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, updateQuantity, removeFromCart, getTotals, clearCart } = useCartStore();

  const { subtotal, deliveryFee, taxAmount, totalAmount } = getTotals();

  if (items.length === 0) {
    return (
      <SafeView style={styles.container}>
        <Header title="Cart" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items from a restaurant to get started.</Text>
          <Button
            title="Browse Restaurants"
            onPress={() => navigation.navigate('Home')}
            style={styles.browseBtn}
          />
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Your Cart" rightAction={{ title: 'Clear', onPress: clearCart }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart items list */}
        <View style={styles.section}>
          {items.map((item) => {
            const itemBasePrice = item.variant ? item.variant.price : item.foodItem.price;
            const addonsPrice = item.addons.reduce((sum, a) => sum + a.price, 0);
            const singleItemTotal = itemBasePrice + addonsPrice;

            return (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.foodItem.name}</Text>
                  <Text style={styles.itemPrice}>{formatCurrency(singleItemTotal * item.quantity)}</Text>
                </View>

                {item.variant && (
                  <Text style={styles.itemDetail}>Size: {item.variant.name}</Text>
                )}
                {item.addons.length > 0 && (
                  <Text style={styles.itemDetail}>
                    Add-ons: {item.addons.map(a => a.name).join(', ')}
                  </Text>
                )}
                {item.notes ? (
                  <Text style={styles.itemNotes}>Note: "{item.notes}"</Text>
                ) : null}

                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>

                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Bill Details */}
        <View style={[styles.section, styles.billSection]}>
          <Text style={styles.billTitle}>Bill Details</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Subtotal</Text>
            <Text style={styles.billValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>{formatCurrency(deliveryFee)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Charges</Text>
            <Text style={styles.billValue}>{formatCurrency(taxAmount)}</Text>
          </View>

          <View style={styles.billDivider} />

          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer checkout bar */}
      <View style={styles.footer}>
        <Button
          title="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
        />
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: 16,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  itemNotes: {
    fontSize: 12,
    color: COLORS.warning,
    fontStyle: 'italic',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  removeText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 10,
    color: COLORS.textPrimary,
  },
  billSection: {
    paddingTop: 16,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  billDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  checkoutBtn: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 120,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  browseBtn: {
    width: '100%',
  },
});

export default Cart;
