import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import SafeView from '../../components/common/SafeView';
import { MOCK_RESTAURANTS } from '../../constants/mockData';
import useCartStore from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatters';
import { FoodItem } from '../../types';

const { width } = Dimensions.get('window');

export const RestaurantDetail: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const restaurantId = route.params?.restaurantId;

  const restaurant = MOCK_RESTAURANTS.find((res) => res.id === restaurantId) || MOCK_RESTAURANTS[0];
  const { items, addToCart, getTotals } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Featured' | 'Veg' | 'NonVeg'>('All');
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItemCount = items.length;
  const { subtotal } = getTotals(restaurant.baseDeliveryFee);

  // Dynamic filter for food items
  const filteredFoodItems = restaurant.foodItems.filter((item) => {
    // 1. Text Search matching
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category matching
    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Featured') return !!item.isFeatured || (item.rating && item.rating >= 4.7);
    if (activeCategory === 'Veg') return !!item.isVeg;
    if (activeCategory === 'NonVeg') return !!item.isNonVeg;
    return true;
  });

  const handleAddToCart = (item: FoodItem) => {
    if (item.variants && item.variants.length > 0) {
      // Navigate to customization details if it has variants
      navigation.navigate('FoodDetails', { foodItemId: item.id, restaurantId: restaurant.id });
    } else {
      addToCart(item, 1);
    }
  };

  const menuCategories = [
    { key: 'All', label: 'All Menu', icon: '🍽️' },
    { key: 'Featured', label: 'Featured', icon: '⭐' },
    { key: 'Veg', label: 'Vegetarian', icon: '🟢' },
    { key: 'NonVeg', label: 'Non-Veg', icon: '🔴' },
  ];

  const offers = [
    { id: 'off_1', title: restaurant.promoTag || 'Free Item', desc: 'On orders over $15', icon: '🏷️' },
    { id: 'off_2', title: '$5 Off $35+', desc: 'Apply at checkout', icon: '🎁' },
    { id: 'off_3', title: 'Free Delivery', desc: 'Limited time promo', icon: '⚡' },
  ];

  return (
    <SafeView style={styles.container} edges={['top', 'bottom']}>
      {/* Scrollable Content */}
      <FlatList
        data={filteredFoodItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {/* Top Cover with absolute controls */}
            <View style={styles.coverContainer}>
              <Image source={{ uri: restaurant.coverImageUrl }} style={styles.coverImage} />
              
              {/* Overlaid Header Actions */}
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.actionCircleButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.actionButtonText}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionCircleButton}
                  onPress={() => setIsFavorite(!isFavorite)}
                >
                  <Text style={[styles.actionButtonText, isFavorite && styles.favoriteActive]}>
                    {isFavorite ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Floating circular logo overlapping bottom-left */}
              <View style={styles.logoWrapper}>
                <Image source={{ uri: restaurant.logoUrl }} style={styles.logoImage} />
              </View>
            </View>

            {/* Gap for floating logo */}
            <View style={styles.logoOffsetSpacer} />

            {/* Restaurant Info Panel */}
            <View style={styles.infoPanel}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.description}>{restaurant.description}</Text>
              <Text style={styles.addressText}>📍 {restaurant.address}</Text>

              {/* Stats row card */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>★ {restaurant.rating}</Text>
                  <Text style={styles.statLabel}>{restaurant.reviewCount}+ Ratings</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{restaurant.prepTimeRange}</Text>
                  <Text style={styles.statLabel}>Delivery</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {restaurant.distanceKm ? `${restaurant.distanceKm} km` : '1.2 km'}
                  </Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {restaurant.baseDeliveryFee === 0 ? 'Free' : `$${restaurant.baseDeliveryFee.toFixed(2)}`}
                  </Text>
                  <Text style={styles.statLabel}>Fee</Text>
                </View>
              </View>
            </View>

            {/* Horizontal Promo Offers */}
            <View style={styles.offersSection}>
              <Text style={styles.sectionHeaderTitle}>Available Offers</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.offersContainer}
              >
                {offers.map((off) => (
                  <View key={off.id} style={styles.offerCard}>
                    <Text style={styles.offerIcon}>{off.icon}</Text>
                    <View style={styles.offerTextCol}>
                      <Text style={styles.offerTitle}>{off.title}</Text>
                      <Text style={styles.offerDesc}>{off.desc}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Search inside menu */}
            <View style={styles.searchSection}>
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search in menu..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={COLORS.greyPlaceholder}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearSearchIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Menu Section & Tabs */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer}
              >
                {menuCategories.map((tab) => (
                  <TouchableOpacity
                    key={tab.key}
                    style={[
                      styles.tabPill,
                      activeCategory === tab.key && styles.tabPillActive,
                    ]}
                    onPress={() => setActiveCategory(tab.key as any)}
                  >
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                    <Text
                      style={[
                        styles.tabLabel,
                        activeCategory === tab.key && styles.tabLabelActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          // Check if item is in cart to display active status
          const cartItem = items.find((ci) => ci.foodItem.id === item.id);
          const quantityInCart = cartItem ? cartItem.quantity : 0;

          return (
            <View style={styles.foodItemCard}>
              <View style={styles.foodTextContainer}>
                <View style={styles.vegIndicatorRow}>
                  {item.isVeg && (
                    <View style={[styles.dotBorder, { borderColor: 'green' }]}>
                      <View style={[styles.dot, { backgroundColor: 'green' }]} />
                    </View>
                  )}
                  {item.isNonVeg && (
                    <View style={[styles.dotBorder, { borderColor: 'red' }]}>
                      <View style={[styles.dot, { backgroundColor: 'red' }]} />
                    </View>
                  )}
                  {item.isFeatured && <Text style={styles.featuredLabel}>Featured</Text>}
                  {item.rating && (
                    <Text style={styles.foodRating}>★ {item.rating.toFixed(1)}</Text>
                  )}
                </View>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDescription} numberOfLines={3}>
                  {item.description}
                </Text>
                <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
              </View>

              <View style={styles.foodImageContainer}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
                ) : (
                  <View style={styles.foodImagePlaceholder} />
                )}
                {/* Floating direct add to cart / count buttons */}
                <View style={styles.addBtnContainer}>
                  {quantityInCart > 0 ? (
                    <View style={styles.quantityControlPill}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => {
                          const cartItem = items.find((ci) => ci.foodItem.id === item.id);
                          if (cartItem) {
                            // Update or remove
                            const newQty = cartItem.quantity - 1;
                            const cartStore = useCartStore.getState();
                            cartStore.updateQuantity(cartItem.id, newQty);
                          }
                        }}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{quantityInCart}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => {
                          const cartItem = items.find((ci) => ci.foodItem.id === item.id);
                          if (cartItem) {
                            const newQty = cartItem.quantity + 1;
                            const cartStore = useCartStore.getState();
                            cartStore.updateQuantity(cartItem.id, newQty);
                          }
                        }}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      activeOpacity={0.9}
                      onPress={() => handleAddToCart(item)}
                    >
                      <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search query or filters.</Text>
          </View>
        }
      />

      {/* Floating View Cart bar */}
      {cartItemCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          activeOpacity={0.95}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartInfoCol}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.viewCartText}>View basket</Text>
          </View>
          <Text style={styles.cartTotalText}>{formatCurrency(subtotal)}</Text>
        </TouchableOpacity>
      )}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  coverContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  headerActions: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  actionCircleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  favoriteActive: {
    color: COLORS.error,
  },
  logoWrapper: {
    position: 'absolute',
    bottom: -32,
    left: 16,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoOffsetSpacer: {
    height: 36,
  },
  infoPanel: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 20,
    fontWeight: '400',
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: COLORS.border,
  },
  offersSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  offersContainer: {
    paddingHorizontal: 16,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  offerTextCol: {
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  offerDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    height: 44,
    paddingHorizontal: 14,
  },
  searchIcon: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
    padding: 0,
  },
  clearSearchIcon: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
    fontWeight: '700',
  },
  menuHeader: {
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabsContainer: {
    paddingHorizontal: 16,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabPillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  tabIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingBottom: 100, // Leave room for floating cart
  },
  foodItemCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  foodTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  vegIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dotBorder: {
    width: 14,
    height: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featuredLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  foodRating: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  foodDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  foodPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  foodImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  foodImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  foodImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  addBtnContainer: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    zIndex: 5,
  },
  addButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minWidth: 70,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quantityControlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    paddingHorizontal: 6,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 54,
    backgroundColor: COLORS.secondary, // Black color (Uber Eats style)
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cartInfoCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  viewCartText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cartTotalText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default RestaurantDetail;
