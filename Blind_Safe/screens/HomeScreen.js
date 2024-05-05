import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Vibration } from 'react-native';
import * as Speech from 'expo-speech';

const HomePage = ({ navigation }) => {
  useEffect(() => {
    // Speak welcome message when component mounts
    speakWelcomeMessage();
  }, []);

  const speakWelcomeMessage = () => {
    Speech.speak('Welcome to Blind Safe, your essential companion for the visually impaired, offering enhanced safety and independence with innovative features.', {
      language: 'en',
      onDone: () => {
        // Set a delay of 2 seconds before navigating to the menu page
        setTimeout(() => {
          navigation.navigate('Menu');
          Vibration.vibrate(100);
        }, 2000); // Adjust the delay as needed
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/blindSafeLogo2.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.description}>
        Welcome to Blind Safe, your essential companion for the visually impaired, offering enhanced safety and
        independence with innovative features.
      </Text>
      <View style={styles.containerFooter}>
        <Text style={styles.bottomTitle}>Developed by</Text>
        <Text style={styles.bottomTitlesub}>Smart Technology Solution</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFooter: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  bottomTitlesub: {
    position: 'absolute',
    bottom: 0,
    color: '#070057',
    fontSize: 12,
    opacity: 0.6,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {},
  logo: {
    marginTop: 100,
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#070057',
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    marginHorizontal: 40,
    textAlign: 'center',
    opacity: 0.6,
  },
  bottomTitle: {
    position: 'absolute',
    bottom: 20,
    fontSize: 10,
    opacity: 0.6,
  },
});

export default HomePage;
