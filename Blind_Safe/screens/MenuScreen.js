import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Vibration, Text, Button, TouchableWithoutFeedback, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';

const MenuScreen = () => {
  const [swipedDirection, setSwipedDirection] = useState(null);
  const [arrowSizes, setArrowSizes] = useState({
    up: 20,
    down: 20,
    left: 20,
    right: 20,
  });
  
  const navigation = useNavigation();
  
  // Initialize Animated.Value for the microphone animation
  const micAnimation = new Animated.Value(1); // Start with the original size
  
  const playVoice = () => {
    const introMessage = "Welcome to the Menu Screen. This screen provides various functionalities accessible through swiping gestures. Swipe up for Fall Detection, swipe down for Wound Detection, swipe right for Medicine Identification, and swipe left for Transport Navigator. If you want to re-listen to the instructions, perform a long press gesture anywhere on the screen.";
  
    // Function to trigger the microphone animation
    const triggerAnimation = () => {
      animateMic();
      // Repeat the animation every 1000ms (1 second) until speech synthesis is done
      micAnimationLoop = setTimeout(triggerAnimation, 1000);
    };
  
    // Start the microphone animation
    triggerAnimation();
  
    // Start speech synthesis
    Speech.speak(introMessage, { language: 'en', onDone: () => clearTimeout(micAnimationLoop) });
  };
  
  
  
  // Function to animate the microphone
  const animateMic = () => {
    Animated.sequence([
      Animated.timing(micAnimation, {
        toValue: 1.2, // Increase the size
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(micAnimation, {
        toValue: 1, // Decrease back to the original size
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const onLongPress = () => {
    Vibration.vibrate(100);
    playVoice();
  };
  
  const handleSwipe = (direction) => {
    console.log('Swipe Direction:', direction);
    Vibration.vibrate(100);

    if (direction === 'up') {
      navigation.navigate('FallDetection');
    }
    if (direction === 'down') {
      navigation.navigate('InjuryDetector');
    }
    if (direction === 'left') {
      navigation.navigate('');
    }
    if (direction === 'right') {
      navigation.navigate('MedicineDetector');
    }
    
    // Update the size of the arrow corresponding to the swipe direction
    setArrowSizes((prevSizes) => ({
      ...prevSizes,
      [direction]: 30, // Adjust size as needed
    }));

    // Reset arrow sizes after a delay (for example, 500 milliseconds)
    setTimeout(() => {
      setArrowSizes((prevSizes) => ({
        ...prevSizes,
        [direction]: 20, // Adjust size as needed
      }));
    }, 500); // Adjust delay as needed
  };

  const onGestureEvent = (event) => {
    const { translationX, translationY, state } = event.nativeEvent;

    if (state === State.ACTIVE) {
      const swipeThreshold = 50;

      if (Math.abs(translationX) > swipeThreshold || Math.abs(translationY) > swipeThreshold) {
        let direction;
        if (Math.abs(translationX) > Math.abs(translationY)) {
          direction = translationX > 0 ? 'right' : 'left';
        } else {
          direction = translationY > 0 ? 'down' : 'up';
        }
        setSwipedDirection(direction);
        handleSwipe(direction);
      }
    }
  };

  useEffect(() => {
    // Play the voice when component mounts
    playVoice();
  }, []);

  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <View style={styles.fullScreenContainer}>
            <View style={styles.joystickContainer}>
              <TouchableOpacity style={styles.joystickButtonUp} onPress={() => handleSwipe('up')}>
                <Image source={require('../assets/fall.png')} style={styles.icon} />
                <Text style={styles.functionName}>Fall Detector</Text>
              </TouchableOpacity>

              <View style={styles.sideButtonsContainer}>
                <TouchableOpacity style={styles.joystickButton} onPress={() => handleSwipe('left')}>
                  <Image source={require('../assets/navigator.png')} style={styles.icon} />
                  <Text style={styles.functionName}>Transport Navigator</Text>
                </TouchableOpacity>

                <View style={styles.centralButton}>
                  <Image source={require('../assets/blindSafeLogo2.png')} style={styles.logo} />
                  {/* Arrowheads */}
                  <View style={styles.arrowContainer}>
                    <Image source={require('../assets/up.png')} style={[styles.arrow, styles.arrowTop, { width: arrowSizes.up, height: arrowSizes.up }]} />
                    <Image source={require('../assets/down.png')} style={[styles.arrow, styles.arrowBottom, { width: arrowSizes.down, height: arrowSizes.down }]} />
                    <Image source={require('../assets/left.png')} style={[styles.arrow, styles.arrowLeft, { width: arrowSizes.left, height: arrowSizes.left }]} />
                    <Image source={require('../assets/right.png')} style={[styles.arrow, styles.arrowRight, { width: arrowSizes.right, height: arrowSizes.right }]} />
                  </View>
                </View>

                <TouchableOpacity style={styles.joystickButton} onPress={() => handleSwipe('right')}>
                  <Image source={require('../assets/medicine.png')} style={styles.icon} />
                  <Text style={styles.functionName}>Medicine Detector</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.joystickButton} onPress={() => handleSwipe('down')}>
                <Image source={require('../assets/wound.png')} style={styles.icon} />
                <Text style={styles.functionName}>Wound Detector</Text>
              </TouchableOpacity>
            </View>
          </View>
        </PanGestureHandler>

        <Image
          source={require('../assets/blindSafeLogo.png')}
          style={styles.appLogo}
        />

        {/* Animated microphone image */}
        <Animated.Image
          source={require('../assets/mic.png')}
          style={[
            styles.microphone,
            {
              transform: [
                {
                  scale: micAnimation, // Apply the animated scale
                },
              ],
            },
          ]}
        />

        <TouchableOpacity onPress={() => console.log('Navigate to home')}>
          <Image source={require('../assets/home.png')} style={styles.homeIcon} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fullScreenContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogo: {
    width: 257,
    height: 100,
    marginBottom: 20,
    marginTop: 10,
    position: 'absolute',
    top: 50,
  },
  joystickContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  joystickButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    margin: 10,
  },
  joystickButtonUp: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    margin: 10,
    marginBottom: 20,
  },
  sideButtonsContainer: {
    flexDirection: 'row',
  },
  centralButton: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    opacity: 1,
  },
  arrowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    resizeMode: 'contain',
  },
  arrowTop: {
    position: 'absolute',
    top: -30,
  },
  arrowBottom: {
    position: 'absolute',
    bottom: -30,
  },
  arrowLeft: {
    position: 'absolute',
    left: -30,
  },
  arrowRight: {
    position: 'absolute',
    right: -30,
  },
  functionName: {
    marginTop: 10,
    fontSize: 10,
    color: '#070057',
    textAlign: 'center',
  },
  microphone: {
    position: 'absolute',
    bottom: 100,
    width: 108,
    height: 129,
    resizeMode: 'contain',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  homeIcon: {
    marginBottom: 20,
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default MenuScreen;
