// imports

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import useAuthStore from '../../store/useAuthStore';
import PulsingDot from '../../components/common/PulsingDot';


// component
export const Splash: React.FC = () => {

  // hooks and inits
  const navigation = useNavigation<any>();
  const { isAuthenticated, isOnboarded } = useAuthStore();


  // useffect for quickly navigating to onboarding. comment the code to make this screen persistent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Home');
      } else if (isOnboarded) {
        navigation.replace('Login');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded, navigation]);

  return (

    // complete view
    <View style={styles.container}>

      {/* makes the screen to take up complete height of device and render dark status bar contents */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* plate image */}
      <View><Image source={require("../../constants/plate.png")} /></View>

      {/* flex component for logo and small desc below it */}
      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.logoText}>FoodExpress</Text>
        </View>
        <Text style={styles.descText}>Delivering freshness to your door</Text>
      </View>


      {/* flex component for pulsing green dot and "ready to serve" text */}
      <View style={{ marginBottom: 100, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#c7d4c9", paddingVertical: 6, borderRadius: 100, gap: 12, paddingHorizontal: 40 }}>
        <PulsingDot size={12} color="#06C167" pulseColor="#8FE3B8" duration={1000} />
        <Text style={styles.serveStyle}>ready to serve</Text>
      </View>

      {/* footer */}
      <View>
        <Text style={{ ...styles.descText, opacity: 0.3, marginBottom: 10 }}>© 2026 FoodExpress Inc.</Text>
      </View>
    </View>
  );
};


// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Black premium look
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 110,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 46,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  descText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.secondary,
    letterSpacing: 0.8,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  loader: {
    // marginTop: 40,
  },
  serveStyle: {
    textTransform: "uppercase",
    color: COLORS.primary,
    fontWeight: '500',
    letterSpacing: 1.5,
    fontSize: 12
  }
});


// exports
export default Splash;