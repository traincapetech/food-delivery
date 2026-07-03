import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import SafeView from '../../components/common/SafeView';
import Header from '../../components/common/Header';
import useCartStore from '../../store/useCartStore';
import { MOCK_ADDRESSES } from '../../constants/mockData';
import { formatCurrency } from '../../utils/formatters';

const { width } = Dimensions.get('window');

export const Checkout: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, getTotals, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH' | 'WALLET'>('CARD');
  const [dropoffOption, setDropoffOption] = useState<'DOOR' | 'OUTSIDE' | 'HAND'>('DOOR');
  
  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Delivery instructions
  const [instructions, setInstructions] = useState('');

  // Checkout overlay states
  const [checkoutState, setCheckoutState] = useState<'idle' | 'processing' | 'success'>('idle');

  const activeAddress = MOCK_ADDRESSES.find((a) => a.isDefault) || MOCK_ADDRESSES[0];
  const { subtotal, deliveryFee: baseDeliveryFee, taxAmount: baseTax } = getTotals();

  // Dynamic calculations based on applied coupon
  let deliveryFee = baseDeliveryFee;
  let subtotalDiscount = 0;

  if (appliedCoupon === 'EATS50') {
    subtotalDiscount = subtotal * 0.5; // 50% discount on subtotal
  } else if (appliedCoupon === 'FREEDEL') {
    deliveryFee = 0; // Free delivery
  }

  const taxAmount = (subtotal - subtotalDiscount) * 0.08875; // 8.875% tax rate on final subtotal
  const totalAmount = Math.max(0, subtotal - subtotalDiscount + deliveryFee + taxAmount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const cleanedCode = couponInput.trim().toUpperCase();

    if (cleanedCode === 'EATS50') {
      setAppliedCoupon('EATS50');
      setCouponInput('');
    } else if (cleanedCode === 'FREEDEL') {
      setAppliedCoupon('FREEDEL');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try EATS50 or FREEDEL.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handlePlaceOrder = () => {
    // Start processing state
    setCheckoutState('processing');
  };

  // Handle mock payment states
  useEffect(() => {
    if (checkoutState === 'processing') {
      const timer = setTimeout(() => {
        setCheckoutState('success');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (checkoutState === 'success') {
      const timer = setTimeout(() => {
        // Clear local basket
        clearCart();
        // Redirect to Order Tracking screen
        setCheckoutState('idle');
        navigation.replace('OrderTracking', { orderId: 'ord_new_999' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [checkoutState]);

  return (
    <SafeView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Checkout" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Delivery Address & Dropoff section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Location</Text>
          <View style={styles.addressBox}>
            <View style={styles.addressRow}>
              <Text style={styles.addressIcon}>📍</Text>
              <View style={styles.addressTextCol}>
                <Text style={styles.addressTitle}>{activeAddress.title}</Text>
                <Text style={styles.addressBody} numberOfLines={2}>
                  {activeAddress.addressLine1}, {activeAddress.city}, {activeAddress.state} {activeAddress.postalCode}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.changeBtn} 
              onPress={() => navigation.navigate('Addresses')}
            >
              <Text style={styles.changeText}>Change Address</Text>
            </TouchableOpacity>
          </View>

          {/* Drop-off options pill switcher */}
          <Text style={styles.subSectionTitle}>Drop-off Option</Text>
          <View style={styles.dropoffPillsContainer}>
            <TouchableOpacity
              style={[styles.dropoffPill, dropoffOption === 'DOOR' && styles.dropoffPillActive]}
              onPress={() => setDropoffOption('DOOR')}
            >
              <Text style={[styles.dropoffPillText, dropoffOption === 'DOOR' && styles.dropoffPillTextActive]}>
                🚪 Leave at Door
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dropoffPill, dropoffOption === 'OUTSIDE' && styles.dropoffPillActive]}
              onPress={() => setDropoffOption('OUTSIDE')}
            >
              <Text style={[styles.dropoffPillText, dropoffOption === 'OUTSIDE' && styles.dropoffPillTextActive]}>
                🚗 Meet Outside
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dropoffPill, dropoffOption === 'HAND' && styles.dropoffPillActive]}
              onPress={() => setDropoffOption('HAND')}
            >
              <Text style={[styles.dropoffPillText, dropoffOption === 'HAND' && styles.dropoffPillTextActive]}>
                🤝 Hand to Me
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[styles.payRow, paymentMethod === 'CARD' && styles.payRowSelected]}
            onPress={() => setPaymentMethod('CARD')}
            activeOpacity={0.7}
          >
            <Text style={styles.payIcon}>💳</Text>
            <Text style={styles.payLabel}>Credit / Debit Card</Text>
            <View style={[styles.radioOuter, paymentMethod === 'CARD' && styles.radioActive]}>
              {paymentMethod === 'CARD' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payRow, paymentMethod === 'WALLET' && styles.payRowSelected]}
            onPress={() => setPaymentMethod('WALLET')}
            activeOpacity={0.7}
          >
            <Text style={styles.payIcon}>👛</Text>
            <Text style={styles.payLabel}>Wallet (Balance: $45.00)</Text>
            <View style={[styles.radioOuter, paymentMethod === 'WALLET' && styles.radioActive]}>
              {paymentMethod === 'WALLET' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payRow, paymentMethod === 'CASH' && styles.payRowSelected, styles.payRowLast]}
            onPress={() => setPaymentMethod('CASH')}
            activeOpacity={0.7}
          >
            <View style={styles.payRowInner}>
              <Text style={styles.payIcon}>💵</Text>
              <Text style={styles.payLabel}>Cash on Delivery</Text>
              <View style={[styles.radioOuter, paymentMethod === 'CASH' && styles.radioActive]}>
                {paymentMethod === 'CASH' && <View style={styles.radioInner} />}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Coupon Code input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Coupon</Text>
          
          {appliedCoupon ? (
            <View style={styles.appliedCouponCard}>
              <View style={styles.couponInfoCol}>
                <Text style={styles.couponAppliedLabel}>ACTIVE COUPON</Text>
                <Text style={styles.couponAppliedCode}>
                  {appliedCoupon} ({appliedCoupon === 'EATS50' ? '50% OFF subtotal' : 'Free Delivery'})
                </Text>
              </View>
              <TouchableOpacity style={styles.couponRemoveBtn} onPress={handleRemoveCoupon}>
                <Text style={styles.couponRemoveText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter promo code (e.g. EATS50)"
                value={couponInput}
                onChangeText={setCouponInput}
                placeholderTextColor={COLORS.greyPlaceholder}
                autoCapitalize="characters"
              />
              <TouchableOpacity 
                style={styles.couponApplyBtn} 
                onPress={handleApplyCoupon}
                disabled={couponInput.trim() === ''}
              >
                <Text style={styles.couponApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}

          {couponError && <Text style={styles.couponErrorText}>{couponError}</Text>}
        </View>

        {/* Delivery instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Add drop-off details, gate codes, etc."
            value={instructions}
            onChangeText={setInstructions}
            placeholderTextColor={COLORS.greyPlaceholder}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryItemRow}>
              <Text style={styles.summaryItemText}>
                {item.quantity}x {item.foodItem.name}
              </Text>
              <Text style={styles.summaryItemPrice}>
                {formatCurrency((item.variant ? item.variant.price : item.foodItem.price) * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Bill Breakdown */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalVal}>{formatCurrency(subtotal)}</Text>
          </View>
          {subtotalDiscount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.discountLabel}>Coupon Discount ({appliedCoupon})</Text>
              <Text style={styles.discountVal}>-{formatCurrency(subtotalDiscount)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalVal}>
              {deliveryFee === 0 ? (
                <Text style={styles.freeFeeText}>FREE</Text>
              ) : (
                formatCurrency(deliveryFee)
              )}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalVal}>{formatCurrency(taxAmount)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.finalTotalLabel}>Grand Total</Text>
            <Text style={styles.finalTotalVal}>{formatCurrency(totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Place Order Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeBtn} activeOpacity={0.9} onPress={handlePlaceOrder}>
          <Text style={styles.placeBtnText}>Place Order • {formatCurrency(totalAmount)}</Text>
        </TouchableOpacity>
      </View>

      {/* Processing & Success Modals */}
      <Modal visible={checkoutState !== 'idle'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {checkoutState === 'processing' && (
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                <Text style={styles.modalTitle}>Processing Payment...</Text>
                <Text style={styles.modalSubtitle}>Please do not close the app or go back.</Text>
              </View>
            )}
            {checkoutState === 'success' && (
              <View style={styles.modalContent}>
                <View style={styles.successBadge}>
                  <Text style={styles.successBadgeText}>✓</Text>
                </View>
                <Text style={styles.modalTitle}>Payment Successful!</Text>
                <Text style={styles.modalSubtitle}>Order placed. Redirecting to tracking...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 10,
  },
  addressBox: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  addressTextCol: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  addressBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
    fontWeight: '500',
  },
  changeBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  changeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  dropoffPillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropoffPill: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  dropoffPillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  dropoffPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dropoffPillTextActive: {
    color: COLORS.white,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  payRowLast: {
    paddingVertical: 14,
  },
  payRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  payRowSelected: {
    backgroundColor: COLORS.white,
  },
  payIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  payLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.secondary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontWeight: '600',
  },
  couponApplyBtn: {
    marginLeft: 10,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponApplyText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  appliedCouponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGreen,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  couponInfoCol: {
    flex: 1,
  },
  couponAppliedLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  couponAppliedCode: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  couponRemoveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  couponRemoveText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
  },
  couponErrorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  instructionsInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    height: 72,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  totalVal: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  discountLabel: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  discountVal: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  freeFeeText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  finalTotalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  bottomSpacer: {
    height: 48,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  placeBtn: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  placeBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  successBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 16,
  },
  successBadgeText: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
});

export default Checkout;
