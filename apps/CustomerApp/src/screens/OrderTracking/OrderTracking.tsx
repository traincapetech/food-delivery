import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import SafeView from '../../components/common/SafeView';
import Header from '../../components/common/Header';

const { width, height } = Dimensions.get('window');

// Status types
type TrackingStatus = 'PREPARING' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED';

interface StatusDetails {
  title: string;
  subtitle: string;
  timeRemaining: string;
  driverTop: string;
  driverLeft: string;
}

const STATUS_MAP: Record<TrackingStatus, StatusDetails> = {
  PREPARING: {
    title: 'Preparing your order',
    subtitle: 'Tavern & Pizzeria is preparing your food',
    timeRemaining: '25-30 min',
    driverTop: '30%',
    driverLeft: '28%',
  },
  PICKED_UP: {
    title: 'Order picked up',
    subtitle: 'Michael has picked up your order and is packaging it',
    timeRemaining: '15-20 min',
    driverTop: '30%',
    driverLeft: '28%',
  },
  ON_THE_WAY: {
    title: 'On the way to you',
    subtitle: 'Michael is riding towards your location',
    timeRemaining: '5-10 min',
    driverTop: '50%',
    driverLeft: '55%',
  },
  DELIVERED: {
    title: 'Order delivered',
    subtitle: 'Michael dropped off your order. Enjoy!',
    timeRemaining: 'Delivered',
    driverTop: '68%',
    driverLeft: '72%',
  },
};

export const OrderTracking: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const orderId = route.params?.orderId || 'ord_123';

  // Tracking states
  const [statusIndex, setStatusIndex] = useState(0);
  const statuses: TrackingStatus[] = ['PREPARING', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];
  const currentStatus = statuses[statusIndex];
  const details = STATUS_MAP[currentStatus];

  // Feedback notifications
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Animated driver coordinates
  const driverX = useRef(new Animated.Value(0)).current;
  const driverY = useRef(new Animated.Value(0)).current;

  // Auto-advance simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        } else {
          // Keep it at DELIVERED
          return prev;
        }
      });
    }, 8000); // Advance status every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 2500);
  };

  const handleBackToHome = () => {
    // Reset navigation stack to Home
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Track Order" showBackButton={true} onBackPress={handleBackToHome} />

      {/* Styled Mock Google Map */}
      <View style={styles.mapContainer}>
        {/* Abstract road lines to represent map */}
        <View style={[styles.roadLine, { top: '35%', width: '100%', height: 12 }]} />
        <View style={[styles.roadLine, { top: '70%', width: '100%', height: 12 }]} />
        <View style={[styles.roadLine, { left: '30%', height: '100%', width: 12 }]} />
        <View style={[styles.roadLine, { left: '75%', height: '100%', width: 12 }]} />
        <View style={[styles.roadLine, { left: '55%', top: '35%', height: '35%', width: 12 }]} />

        {/* Restaurant Pin (Burger Icon) */}
        <View style={[styles.markerContainer, { top: '28%', left: '23%' }]}>
          <View style={styles.restaurantMarker}>
            <Text style={styles.markerEmoji}>🍔</Text>
          </View>
          <Text style={styles.markerLabel}>Pizzeria</Text>
        </View>

        {/* User Pin (Home Icon) */}
        <View style={[styles.markerContainer, { top: '66%', left: '73%' }]}>
          <View style={styles.userMarker}>
            <Text style={styles.markerEmoji}>🏠</Text>
          </View>
          <Text style={styles.markerLabel}>You</Text>
        </View>

        {/* Driver Marker (Animated position based on status coordinates) */}
        <View style={[styles.driverMarkerContainer, { top: details.driverTop, left: details.driverLeft }]}>
          <View style={styles.driverMarkerPill}>
            <Text style={styles.driverMarkerEmoji}>🏍️</Text>
            <Text style={styles.driverMarkerText}>Michael</Text>
          </View>
          <View style={styles.driverPulse} />
        </View>

        {/* Map Overlay Badge */}
        <View style={styles.mapBadge}>
          <Text style={styles.mapBadgeText}>GPS Live Tracking Simulated</Text>
        </View>
      </View>

      {/* Slide-Up Details Panel */}
      <View style={styles.detailsPanel}>
        {/* Banner Notification for clicks */}
        {feedbackMsg && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedbackMsg}</Text>
          </View>
        )}

        {/* Estimated Arrival Time Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusHeaderLeft}>
            <Text style={styles.timeValue}>{details.timeRemaining}</Text>
            <Text style={styles.statusHeaderTitle}>{details.title}</Text>
            <Text style={styles.statusHeaderSubtitle}>{details.subtitle}</Text>
          </View>
          <View style={styles.estimatedTimeIconCircle}>
            <Text style={styles.estimatedTimeIcon}>⏱️</Text>
          </View>
        </View>

        {/* Custom Timeline Steps */}
        <View style={styles.timelineContainer}>
          {/* Step 1: Placed */}
          <View style={styles.timelineStep}>
            <View style={[styles.timelineBullet, styles.timelineBulletCompleted]}>
              <Text style={styles.timelineCheck}>✓</Text>
            </View>
            <Text style={styles.timelineLabelActive}>Placed</Text>
          </View>
          <View style={[styles.timelineLine, statusIndex >= 0 && styles.timelineLineCompleted]} />

          {/* Step 2: Preparing */}
          <View style={styles.timelineStep}>
            <View
              style={[
                styles.timelineBullet,
                statusIndex >= 0 && styles.timelineBulletCompleted,
                statusIndex === 0 && styles.timelineBulletActive,
              ]}
            >
              {statusIndex > 0 ? (
                <Text style={styles.timelineCheck}>✓</Text>
              ) : (
                <Text style={styles.timelineStepIcon}>🍳</Text>
              )}
            </View>
            <Text style={statusIndex >= 0 ? styles.timelineLabelActive : styles.timelineLabelInactive}>
              Preparing
            </Text>
          </View>
          <View style={[styles.timelineLine, statusIndex >= 2 && styles.timelineLineCompleted]} />

          {/* Step 3: On the Way */}
          <View style={styles.timelineStep}>
            <View
              style={[
                styles.timelineBullet,
                statusIndex >= 2 && styles.timelineBulletCompleted,
                statusIndex === 2 && styles.timelineBulletActive,
              ]}
            >
              {statusIndex > 2 ? (
                <Text style={styles.timelineCheck}>✓</Text>
              ) : (
                <Text style={styles.timelineStepIcon}>🏍️</Text>
              )}
            </View>
            <Text style={statusIndex >= 2 ? styles.timelineLabelActive : styles.timelineLabelInactive}>
              On Way
            </Text>
          </View>
          <View style={[styles.timelineLine, statusIndex >= 3 && styles.timelineLineCompleted]} />

          {/* Step 4: Delivered */}
          <View style={styles.timelineStep}>
            <View
              style={[
                styles.timelineBullet,
                statusIndex === 3 && styles.timelineBulletCompleted,
                statusIndex === 3 && styles.timelineBulletActive,
              ]}
            >
              <Text style={styles.timelineStepIcon}>🎁</Text>
            </View>
            <Text style={statusIndex === 3 ? styles.timelineLabelActive : styles.timelineLabelInactive}>
              Delivered
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.detailsScroll}>
          {/* Restaurant Card Info */}
          <View style={styles.infoCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80' }}
              style={styles.cardAvatar}
            />
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTypeLabel}>RESTAURANT</Text>
              <Text style={styles.cardName}>Tavern & Pizzeria</Text>
              <Text style={styles.cardSubText}>Order ID: {orderId}</Text>
            </View>
            <View style={styles.orderNumberBadge}>
              <Text style={styles.orderNumberText}>#EAT-9034</Text>
            </View>
          </View>

          {/* Driver Contact Card */}
          <View style={styles.driverCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfoCol}>
              <Text style={styles.cardTypeLabel}>COURIER</Text>
              <Text style={styles.driverName}>Michael</Text>
              <Text style={styles.driverRating}>★ 4.9 • Suzuki Motorcycle (NY-8924)</Text>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => triggerFeedback('Calling Michael at +1 (555) 019-2834...')}
              >
                <Text style={styles.actionBtnIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.chatBtn]}
                onPress={() => triggerFeedback('Opening chat room with Michael...')}
              >
                <Text style={styles.actionBtnIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Back Home CTA Button */}
          <TouchableOpacity style={styles.homeBtn} activeOpacity={0.9} onPress={handleBackToHome}>
            <Text style={styles.homeBtnText}>Back to Home Feed</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1.1,
    backgroundColor: '#EAECEE',
    position: 'relative',
    overflow: 'hidden',
  },
  roadLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  restaurantMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerEmoji: {
    fontSize: 18,
  },
  markerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  driverMarkerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  driverMarkerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  driverMarkerEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  driverMarkerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  driverPulse: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  mapBadge: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  mapBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  detailsPanel: {
    flex: 1.3,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
  },
  feedbackBanner: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    zIndex: 50,
  },
  feedbackText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusHeaderLeft: {
    flex: 1,
    paddingRight: 16,
  },
  timeValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  statusHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statusHeaderSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
    fontWeight: '500',
  },
  estimatedTimeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimatedTimeIcon: {
    fontSize: 22,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 22,
  },
  timelineStep: {
    alignItems: 'center',
    width: 55,
  },
  timelineBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  timelineBulletCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timelineBulletActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  timelineCheck: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
  timelineStepIcon: {
    fontSize: 13,
  },
  timelineLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  timelineLabelInactive: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  timelineLine: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  timelineLineCompleted: {
    backgroundColor: COLORS.primary,
  },
  detailsScroll: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  cardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  cardTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  cardTypeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  cardSubText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  orderNumberBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  driverAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  driverInfoCol: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  driverRating: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 14,
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  chatBtn: {
    marginRight: 0,
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  actionBtnIcon: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  homeBtn: {
    backgroundColor: COLORS.secondary,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  homeBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default OrderTracking;
