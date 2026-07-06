import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface PulsingDotProps {
  size?: number;
  color?: string;
  pulseColor?: string;
  duration?: number;
}

export const PulsingDot: React.FC<PulsingDotProps> = ({
  size = 12,
  color = '#06C167',        // solid green
  pulseColor = '#06C167',   // ripple color (light green via opacity)
  duration = 1000,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      scaleAnim.setValue(0);
      opacityAnim.setValue(1);

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => animate()); // loop
    };

    animate();
  }, [scaleAnim, opacityAnim, duration]);

  const ripplScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3], // ripple grows to 3x dot size
  });

  return (
    <View style={[styles.container, { width: size * 3, height: size * 3 }]}>
      {/* Expanding ripple */}
      <Animated.View
        style={[
          styles.ripple,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: pulseColor,
            opacity: opacityAnim,
            transform: [{ scale: ripplScale }],
          },
        ]}
      />
      {/* Solid center dot */}
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
  },
  dot: {
    position: 'absolute',
  },
});

export default PulsingDot;