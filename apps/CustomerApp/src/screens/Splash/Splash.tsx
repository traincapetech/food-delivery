import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import useAuthStore from '../../store/useAuthStore';

export const Splash: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isAuthenticated, isOnboarded } = useAuthStore();

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
    <View style={styles.container}>
      {/* <Text style={styles.emoji}>🥑</Text> */}
      <View style={{flexDirection:"column", alignItems:"center"}}>
        <View style={{flexDirection:"row"}}>
          <Text style={styles.logoText}>Food</Text>
      <Text style={{...styles.logoText,color:"#06C167"}}>Express</Text>
        </View>
        <Text style={styles.descText}>Delivering freshness to your door</Text>
      </View>
      <View style={{marginBottom:100}}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      <Text style={styles.serveStyle}>ready to serve</Text>
      </View>
      <View>
        <Text style={{...styles.descText,opacity:0.3}}>© 2026 FoodExpress Inc.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary, // Black premium look
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop:110,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
  },
  descText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  loader: {
    marginTop: 40,
  },
  serveStyle:{
    textTransform:"uppercase",
    color:'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1.5,
    fontSize:12
  }
});

export default Splash;
