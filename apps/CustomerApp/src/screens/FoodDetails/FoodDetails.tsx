import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
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
import { FoodItemVariant, AddonItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const { width } = Dimensions.get('window');

// Data Mappers for Ingredients and Nutrition
const getIngredients = (foodItemId: string): string[] => {
  switch (foodItemId) {
    case 'food_1':
      return ['San Marzano Tomatoes', 'Fresh Mozzarella', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Handmade Wheat Crust'];
    case 'food_2':
      return ['Wild Forest Mushrooms', 'White Truffle Oil', 'Fresh Rosemary', 'Fontina Cheese', 'Garlic White Sauce', 'Wheat Crust'];
    case 'food_3':
      return ['Angus Beef Patty', 'Cheddar Cheese', 'Iceberg Lettuce', 'Roma Tomato', 'Pickles', 'Signature Sauce', 'Brioche Bun'];
    case 'food_4':
      return ['Bluefin Tuna Nigiri', 'Atlantic Salmon Nigiri', 'Spicy Tuna Roll', 'Sushi Rice', 'Nori Seaweed', 'Wasabi', 'Pickled Ginger'];
    case 'food_5':
      return ['Romaine Lettuce', 'Fresh Avocado', 'Sourdough Croutons', 'Parmesan Cheese', 'Caesar Dressing', 'Lemon Wedges'];
    case 'food_6':
      return ['Red Velvet Sponge', 'Cream Cheese Frosting', 'Vanilla Extract', 'Powdered Cocoa', 'Organic Sugar'];
    case 'food_7':
      return ['Slow-Roasted Pork Carnitas', 'Corn Tortillas', 'Diced Onion', 'Fresh Cilantro', 'Lime Wedges', 'Salsa Verde'];
    default:
      return ['Organic Ingredients', 'Fresh Herbs', 'Spices', 'House Sauce'];
  }
};

const getNutrition = (foodItemId: string) => {
  switch (foodItemId) {
    case 'food_1':
      return { calories: '720 kcal', protein: '28g', carbs: '92g', fat: '24g' };
    case 'food_2':
      return { calories: '850 kcal', protein: '26g', carbs: '94g', fat: '32g' };
    case 'food_3':
      return { calories: '640 kcal', protein: '34g', carbs: '45g', fat: '36g' };
    case 'food_4':
      return { calories: '480 kcal', protein: '30g', carbs: '62g', fat: '8g' };
    case 'food_5':
      return { calories: '320 kcal', protein: '8g', carbs: '14g', fat: '22g' };
    case 'food_6':
      return { calories: '380 kcal', protein: '4g', carbs: '48g', fat: '18g' };
    case 'food_7':
      return { calories: '510 kcal', protein: '24g', carbs: '38g', fat: '19g' };
    default:
      return { calories: '450 kcal', protein: '15g', carbs: '50g', fat: '16g' };
  }
};

export const FoodDetails: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { foodItemId, restaurantId } = route.params;

  const restaurant = MOCK_RESTAURANTS.find((res) => res.id === restaurantId) || MOCK_RESTAURANTS[0];
  const item = restaurant.foodItems.find((f) => f.id === foodItemId) || restaurant.foodItems[0];

  const { addToCart } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<FoodItemVariant | undefined>(
    item.variants && item.variants.length > 0 ? item.variants[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<AddonItem[]>([]);
  const [notes, setNotes] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleAddon = (addon: AddonItem) => {
    const isSelected = selectedAddons.some((a) => a.id === addon.id);
    if (isSelected) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateItemPrice = () => {
    const basePrice = selectedVariant ? selectedVariant.price : item.price;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return (basePrice + addonsTotal) * quantity;
  };

  const handleAddToCart = () => {
    // Animate Add to Basket button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.94,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      addToCart(item, quantity, selectedVariant, selectedAddons, notes);
      navigation.goBack();
    });
  };

  const ingredientsList = getIngredients(item.id);
  const nutritionStats = getNutrition(item.id);

  return (
    <SafeView style={styles.container} edges={['top', 'bottom']}>
      {/* Cover Header Actions */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backCircleButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIconText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Large Food Image */}
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}

        {/* Animated Details Section */}
        <Animated.View
          style={[
            styles.body,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Badge indicator & Title */}
          <View style={styles.badgeRow}>
            {item.isVeg && (
              <View style={[styles.dietBadge, styles.vegBadge]}>
                <Text style={styles.dietBadgeText}>🟢 Vegetarian</Text>
              </View>
            )}
            {item.isNonVeg && (
              <View style={[styles.dietBadge, styles.nonVegBadge]}>
                <Text style={styles.dietBadgeText}>🔴 Non-Veg</Text>
              </View>
            )}
            {item.isFeatured && (
              <View style={[styles.dietBadge, styles.featuredBadge]}>
                <Text style={styles.dietBadgeText}>⭐ Popular</Text>
              </View>
            )}
          </View>

          <View style={styles.titlePriceRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {/* Ingredients list */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Ingredients</Text>
            <View style={styles.ingredientsContainer}>
              {ingredientsList.map((ing, index) => (
                <View key={index} style={styles.ingredientChip}>
                  <Text style={styles.ingredientChipText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Nutrition Table */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Nutrition Stats</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionBox}>
                <Text style={styles.nutritionValue}>{nutritionStats.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionBox}>
                <Text style={styles.nutritionValue}>{nutritionStats.protein}</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionBox}>
                <Text style={styles.nutritionValue}>{nutritionStats.carbs}</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionBox}>
                <Text style={styles.nutritionValue}>{nutritionStats.fat}</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>

          {/* Variants Options */}
          {item.variants && item.variants.length > 0 && (
            <View style={styles.optionSection}>
              <View style={styles.optionSectionHeader}>
                <Text style={styles.optionTitle}>Select Size</Text>
                <View style={styles.requiredPill}>
                  <Text style={styles.requiredText}>REQUIRED</Text>
                </View>
              </View>
              {item.variants.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.optionRow}
                  onPress={() => setSelectedVariant(v)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.optionLabel}>{v.name}</Text>
                  <View style={styles.optionPriceRow}>
                    <Text style={styles.optionPrice}>${v.price.toFixed(2)}</Text>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedVariant?.id === v.id && styles.radioOuterActive,
                      ]}
                    >
                      {selectedVariant?.id === v.id && <View style={styles.radioInner} />}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Addons Options */}
          {item.addonGroups && item.addonGroups.length > 0 && (
            item.addonGroups.map((group) => (
              <View key={group.id} style={styles.optionSection}>
                <View style={styles.optionSectionHeader}>
                  <Text style={styles.optionTitle}>{group.name}</Text>
                  <Text style={styles.optionalText}>OPTIONAL</Text>
                </View>
                {group.items.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <TouchableOpacity
                      key={addon.id}
                      style={styles.optionRow}
                      onPress={() => toggleAddon(addon)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.optionLabel}>{addon.name}</Text>
                      <View style={styles.optionPriceRow}>
                        <Text style={styles.optionPrice}>+${addon.price.toFixed(2)}</Text>
                        <View
                          style={[
                            styles.checkboxOuter,
                            isSelected && styles.checkboxOuterActive,
                          ]}
                        >
                          {isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}

          {/* Special Instructions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Special Instructions</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="E.g. No onions, extra napkins, allergy details..."
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={COLORS.greyPlaceholder}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer controls with Animating Button */}
      <View style={styles.footer}>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ flex: 1, transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.9}
            onPress={handleAddToCart}
          >
            <Text style={styles.addBtnText}>
              Add to basket • {formatCurrency(calculateItemPrice())}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  backCircleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 16,
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.surface,
  },
  body: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dietBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  vegBadge: {
    backgroundColor: COLORS.lightGreen,
  },
  nonVegBadge: {
    backgroundColor: '#FFEBEB',
  },
  featuredBadge: {
    backgroundColor: '#FFF8E5',
  },
  dietBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 16,
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
    fontWeight: '400',
  },
  sectionContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ingredientChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nutritionValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nutritionLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  optionSection: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
  },
  optionSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  requiredPill: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  requiredText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
  optionalText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  optionPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginRight: 12,
    fontWeight: '500',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.secondary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOuterActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
  },
  checkboxCheck: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 12,
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    height: 80,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 4,
  },
  quantityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default FoodDetails;
