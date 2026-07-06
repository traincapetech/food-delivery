// import React, { useState } from 'react';
// import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import COLORS from '../../constants/colors';
// import Button from '../../components/common/Button';
// import SafeView from '../../components/common/SafeView';
// import useAuthStore from '../../store/useAuthStore';

// const { width } = Dimensions.get('window');

// const SLIDES = [
//   {
//     emoji: '🍕',
//     title: 'All Your Favorites',
//     description: 'Order from the best local restaurants with easy, on-demand delivery.',
//   },
//   {
//     emoji: '📍',
//     title: 'Real-Time Tracking',
//     description: 'Follow your food with real-time updates from kitchen to doorstep.',
//   },
//   {
//     emoji: '💳',
//     title: 'Easy Payments',
//     description: 'Multiple secure checkout options including credit cards and wallet.',
//   },
// ];

// export const Onboarding: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const { setOnboarded } = useAuthStore();
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleNext = () => {
//     if (currentSlide < SLIDES.length - 1) {
//       setCurrentSlide(currentSlide + 1);
//     } else {
//       setOnboarded(true);
//       navigation.replace('Login');
//     }
//   };

//   return (
//     <SafeView style={styles.container} edges={['bottom']}>
//       <View style={styles.skipRow}>
//         <Button
//           title="Skip"
//           variant="text"
//           textStyle={{color:"#969696"}}
//           onPress={() => {
//             setOnboarded(true);
//             navigation.replace('Login');
//           }}
//         />
//       </View>

//       <View style={styles.slideContainer}>
//         <Text style={styles.slideEmoji}>{SLIDES[currentSlide].emoji}</Text>
//         <Text style={styles.slideTitle}>{SLIDES[currentSlide].title}</Text>
//         <Text style={styles.slideDesc}>{SLIDES[currentSlide].description}</Text>
//       </View>

//       <View style={styles.bottomSection}>
//         <View style={styles.dotsRow}>
//           {SLIDES.map((_, i) => (
//             <View
//               key={i}
//               style={[
//                 styles.dot,
//                 currentSlide === i ? styles.dotActive : null,
//               ]}
//             />
//           ))}
//         </View>

//         <Button
//           title={currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
//           onPress={handleNext}
//           style={styles.nextBtn}
//         />
//       </View>
//     </SafeView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: 'space-between',
//   },
//   skipRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     paddingVertical: 16,
//     paddingHorizontal:16
//   },
//   slideContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   slideEmoji: {
//     fontSize: 96,
//     marginBottom: 40,
//   },
//   slideTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: COLORS.textPrimary,
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   slideDesc: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     lineHeight: 24,
//     paddingHorizontal: 20,
//   },
//   bottomSection: {
//     marginBottom: 32,
//   },
//   dotsRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 32,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.border,
//     marginHorizontal: 4,
//   },
//   dotActive: {
//     width: 24,
//     backgroundColor: COLORS.secondary,
//   },
//   nextBtn: {
//     width: '95%',
//     margin:'auto'
//   },
// });

// export default Onboarding;



// imports

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import Bg1 from '../../constants/background.png';
import Bg2 from '../../constants/background2.png';
import Bg3 from '../../constants/background3.png';
import Button from '../../components/common/Button';
import SafeView from '../../components/common/SafeView';
import useAuthStore from '../../store/useAuthStore';


const { width } = Dimensions.get('window');


// static data
const SLIDES = [
  {
    image: Bg1,
    emoji: '🍕',
    title: 'All Your Favorites',
    description:
      'Order from the best local restaurants with easy, on-demand delivery.',
  },
  {
    image: Bg2,
    emoji: '📍',
    title: 'Real-Time Tracking',
    description:
      'Follow your food with real-time updates from kitchen to doorstep.',
  },
  {
    image: Bg3,
    emoji: '💳',
    title: 'Easy Payments',
    description:
      'Multiple secure checkout options including credit cards and wallet.',
  },
];


// component
export const Onboarding: React.FC = () => {


  // initialisations and hooks
  const navigation = useNavigation<any>();
  const { setOnboarded } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // function working: until currentSlide state has value less than 2, this fn simply increments the state by 1. when value is 2, if becomes false and control moves to else. setOnboarded is invoked to set "isOnboarded" as true and user is navigated to login screen.
  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setOnboarded(true);
      navigation.replace('Login');
    }
  };

  return (
    <>

      {/* makes the screen to take up complete height of device and render dark status bar contents */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* this helps to make an image as background. for 3 screens 3 differnet images are rendered  */}
      <ImageBackground
        source={SLIDES[currentSlide].image}
        style={styles.background}
        resizeMode="cover"
      >

        {/* skip text view */}
        <View style={styles.skipRow}>
          <Button
            title="Skip"
            variant="text"
            textStyle={{ color: '#969696' }}
            onPress={() => {
              setOnboarded(true);
              navigation.replace('Login');
            }}
          />
        </View>


        {/* complete view for content */}
        <View style={styles.slideContainer}>
          {/* emoji */}
          <Text style={styles.slideEmoji}>
            {SLIDES[currentSlide].emoji}
          </Text>
          {/* title of screen */}
          <Text style={styles.slideTitle}>
            {SLIDES[currentSlide].title}
          </Text>
          {/* small desc below title */}
          <Text style={styles.slideDesc}>
            {SLIDES[currentSlide].description}
          </Text>
        </View>

        {/* view for rendering progress dots and button */}
        <View style={styles.bottomSection}>
          {/* helps to render the 3 dots that show transition progress */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentSlide === i && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* button for going to next onboarding screen. changes text when all the screens are visited */}
          <Button
            title={
              currentSlide === SLIDES.length - 1
                ? 'Get Started'
                : 'Next'
            }
            onPress={handleNext}
            style={styles.nextBtn}
          />
        </View>
      </ImageBackground>
    </>
  );
};


// styles

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  slideEmoji: {
    fontSize: 96,
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDesc: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#bdbdbd",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.secondary,
  },
  nextBtn: {
    width: '95%',
    margin: 'auto',
  },
});

export default Onboarding;