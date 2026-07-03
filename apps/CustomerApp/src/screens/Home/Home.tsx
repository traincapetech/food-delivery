import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import SafeView from '../../components/common/SafeView';
import { MOCK_RESTAURANTS, MOCK_CATEGORIES, MOCK_ADDRESSES } from '../../constants/mockData';

const { width } = Dimensions.get('window');

const PROMO_BANNERS = [
  {
    id: 'promo_1',
    title: 'Free Delivery',
    subtitle: 'From selected top local spots',
    code: 'FREEDEL',
    color: '#06C167',
    emoji: '🎁',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'promo_2',
    title: '50% Off Burgers',
    subtitle: 'Craving delicious craft burgers?',
    code: 'BURGER50',
    color: '#FF7A00',
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'promo_3',
    title: 'Sushi Special',
    subtitle: 'Get up to $10 cashback tonight',
    code: 'SUSHITREAT',
    color: '#000000',
    emoji: '🍣',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
  },
];

export const Home: React.FC = () => {
  const navigation = useNavigation<any>();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [favorites, setFavorites] = useState<string[]>([]);
  const activeAddress = MOCK_ADDRESSES.find((a) => a.isDefault) || MOCK_ADDRESSES[0];

  // Extract all food items across restaurants for "Recommended Foods"
  const recommendedFoods = MOCK_RESTAURANTS.flatMap((r) =>
    r.foodItems.map((f) => ({
      ...f,
      restaurantName: r.name,
      restaurantId: r.id,
    }))
  );

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.starIcon}>★</Text>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <SafeView style={styles.container} edges={['top']}>
      {/* Top Toggle Switcher & Location Bar */}
      <View style={styles.header}>
        <View style={styles.modeSwitcherContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              deliveryMode === 'delivery' && styles.modeButtonActive,
            ]}
            onPress={() => setDeliveryMode('delivery')}
          >
            <Text
              style={[
                styles.modeButtonText,
                deliveryMode === 'delivery' && styles.modeButtonTextActive,
              ]}
            >
              Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              deliveryMode === 'pickup' && styles.modeButtonActive,
            ]}
            onPress={() => setDeliveryMode('pickup')}
          >
            <Text
              style={[
                styles.modeButtonText,
                deliveryMode === 'pickup' && styles.modeButtonTextActive,
              ]}
            >
              Pickup
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.addressSelector}
            onPress={() => navigation.navigate('Addresses')}
          >
            <Text style={styles.deliverToText}>
              {deliveryMode === 'delivery' ? 'Deliver now • ' : 'Pick up at • '}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {activeAddress.title || activeAddress.addressLine1}
            </Text>
            <Text style={styles.chevronIcon}> ▾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Restaurant', { restaurantId: 'res_1' })}
        >
          <View style={styles.searchInner}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Food, groceries, drinks...</Text>
          </View>
          <View style={styles.filterBtn}>
            <Text style={styles.filterIcon}>🎛️</Text>
          </View>
        </TouchableOpacity>

        {/* Offer Banner Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerCarousel}
          snapToInterval={width - 32}
          decelerationRate="fast"
        >
          {PROMO_BANNERS.map((banner) => (
            <TouchableOpacity
              key={banner.id}
              style={[styles.bannerCard, { backgroundColor: banner.color }]}
              activeOpacity={0.95}
              onPress={() => navigation.navigate('Restaurant', { restaurantId: 'res_1' })}
            >
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <View style={styles.promoCodePill}>
                  <Text style={styles.promoCodeText}>Code: {banner.code}</Text>
                </View>
              </View>
              <View style={styles.bannerImageCol}>
                <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Food Categories */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {MOCK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Restaurant', { restaurantId: 'res_1' })}
            >
              <View style={styles.categoryCircle}>
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Restaurants */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContainer}
        >
          {MOCK_RESTAURANTS.filter((r) => r.isFeatured).map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.featuredCard}
              activeOpacity={0.95}
              onPress={() => navigation.navigate('Restaurant', { restaurantId: restaurant.id })}
            >
              <View style={styles.cardImageContainer}>
                <Image source={{ uri: restaurant.coverImageUrl }} style={styles.cardImage} />
                {restaurant.promoTag && (
                  <View style={styles.promoBadge}>
                    <Text style={styles.promoBadgeText}>{restaurant.promoTag}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => toggleFavorite(restaurant.id)}
                >
                  <Text style={[styles.heartIcon, favorites.includes(restaurant.id) && styles.heartIconActive]}>
                    {favorites.includes(restaurant.id) ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  {renderRatingStars(restaurant.rating)}
                </View>
                <Text style={styles.restaurantCategories} numberOfLines={1}>
                  {restaurant.categories.join(' • ')}
                </Text>
                <Text style={styles.restaurantInfo}>
                  {restaurant.prepTimeRange} • {restaurant.baseDeliveryFee === 0 ? 'Free delivery' : `$${restaurant.baseDeliveryFee.toFixed(2)} delivery`} • {restaurant.distanceKm ? `${restaurant.distanceKm} km` : '1.2 km'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Restaurants */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContainer}
        >
          {MOCK_RESTAURANTS.filter((r) => r.rating >= 4.6).map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.popularCard}
              activeOpacity={0.95}
              onPress={() => navigation.navigate('Restaurant', { restaurantId: restaurant.id })}
            >
              <View style={styles.popularImageContainer}>
                <Image source={{ uri: restaurant.coverImageUrl }} style={styles.popularImage} />
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => toggleFavorite(restaurant.id)}
                >
                  <Text style={[styles.heartIcon, favorites.includes(restaurant.id) && styles.heartIconActive]}>
                    {favorites.includes(restaurant.id) ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.popularDetails}>
                <Text style={styles.popularName} numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <View style={styles.popularMetaRow}>
                  {renderRatingStars(restaurant.rating)}
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.popularInfoText}>
                    {restaurant.distanceKm ? `${restaurant.distanceKm} km` : '1.5 km'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Foods */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recommended Dishes</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContainer}
        >
          {recommendedFoods.map((food) => (
            <TouchableOpacity
              key={food.id}
              style={styles.foodCard}
              activeOpacity={0.95}
              onPress={() =>
                navigation.navigate('FoodDetails', {
                  foodItemId: food.id,
                  restaurantId: food.restaurantId,
                })
              }
            >
              <View style={styles.foodImageContainer}>
                <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
                <View style={styles.foodAddButton}>
                  <Text style={styles.foodAddText}>+</Text>
                </View>
              </View>
              <View style={styles.foodDetails}>
                <Text style={styles.foodName} numberOfLines={1}>
                  {food.name}
                </Text>
                <Text style={styles.foodRestaurant} numberOfLines={1}>
                  From {food.restaurantName}
                </Text>
                <Text style={styles.foodPrice}>${food.price.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby Restaurants (Vertical List) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>All Nearby Restaurants</Text>
        </View>
        <View style={styles.nearbyListContainer}>
          {MOCK_RESTAURANTS.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.nearbyCard}
              activeOpacity={0.95}
              onPress={() => navigation.navigate('Restaurant', { restaurantId: restaurant.id })}
            >
              <Image source={{ uri: restaurant.coverImageUrl }} style={styles.nearbyImage} />
              {restaurant.promoTag && (
                <View style={styles.nearbyPromoBadge}>
                  <Text style={styles.nearbyPromoText}>{restaurant.promoTag}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.nearbyHeartButton}
                onPress={() => toggleFavorite(restaurant.id)}
              >
                <Text style={[styles.heartIcon, favorites.includes(restaurant.id) && styles.heartIconActive]}>
                  {favorites.includes(restaurant.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
              <View style={styles.nearbyDetails}>
                <View style={styles.nearbyHeaderRow}>
                  <Text style={styles.nearbyName}>{restaurant.name}</Text>
                  {renderRatingStars(restaurant.rating)}
                </View>
                <Text style={styles.nearbyCategories} numberOfLines={1}>
                  {restaurant.categories.join(' • ')}
                </Text>
                <Text style={styles.nearbyMeta}>
                  {restaurant.prepTimeRange} • {restaurant.baseDeliveryFee === 0 ? 'Free delivery' : `$${restaurant.baseDeliveryFee.toFixed(2)} delivery`} • {restaurant.distanceKm ? `${restaurant.distanceKm} km` : '1.0 km'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scrollFooterSpacer} />
      </ScrollView>

      {/* Sticky Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.tabIcon, styles.tabIconActive]}>🏠</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Favorites')}>
          <Text style={styles.tabIcon}>❤️</Text>
          <Text style={styles.tabLabel}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.tabIcon}>🛒</Text>
          <Text style={styles.tabLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 4,
    marginBottom: 10,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  modeButtonTextActive: {
    color: COLORS.white,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliverToText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    maxWidth: '65%',
  },
  chevronIcon: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  notificationBtn: {
    padding: 4,
  },
  notificationIcon: {
    fontSize: 20,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80, // To avoid getting cut off by the sticky bottom nav
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    marginHorizontal: 16,
    height: 48,
    paddingLeft: 16,
    paddingRight: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 14,
  },
  bannerCarousel: {
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 20,
  },
  bannerCard: {
    width: width - 48,
    height: 125,
    borderRadius: 16,
    marginRight: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerTextCol: {
    flex: 1.2,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginVertical: 4,
    fontWeight: '500',
  },
  promoCodePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  promoCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerImageCol: {
    flex: 0.8,
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    opacity: 0.85,
  },
  bannerEmoji: {
    position: 'absolute',
    fontSize: 36,
    right: 4,
    bottom: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  categoriesContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  horizontalListContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 24,
  },
  featuredCard: {
    width: 270,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
    height: 140,
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  promoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  promoBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heartIcon: {
    fontSize: 16,
  },
  heartIconActive: {
    opacity: 1,
  },
  cardDetails: {
    padding: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  starIcon: {
    color: COLORS.star,
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  restaurantCategories: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  restaurantInfo: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 6,
    fontWeight: '600',
  },
  popularCard: {
    width: 190,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  popularImageContainer: {
    height: 105,
    width: '100%',
    position: 'relative',
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
  popularDetails: {
    padding: 10,
  },
  popularName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  popularMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dotSeparator: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 4,
  },
  popularInfoText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  foodCard: {
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  foodImageContainer: {
    height: 95,
    width: '100%',
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodAddButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  foodAddText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
  foodDetails: {
    padding: 8,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  foodRestaurant: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  foodPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  nearbyListContainer: {
    paddingHorizontal: 16,
  },
  nearbyCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  nearbyImage: {
    width: '100%',
    height: 165,
  },
  nearbyPromoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  nearbyPromoText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  nearbyHeartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyDetails: {
    padding: 14,
  },
  nearbyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  nearbyCategories: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  nearbyMeta: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 6,
    fontWeight: '600',
  },
  scrollFooterSpacer: {
    height: 80,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  tabIconActive: {
    color: COLORS.textPrimary,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
  },
});

export default Home;
