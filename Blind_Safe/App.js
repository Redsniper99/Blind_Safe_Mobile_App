import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './screens/LoginScreen'; // Adjust import path
import SignUpScreen from './screens/SignUpScreen'; // Adjust import path
import MenuScreen from './screens/MenuScreen'; // Adjust import path
import FallDetection from './screens/FallDetection'; // Adjust import path
import HomePage from './screens/HomeScreen';
import MedicineDetector from './screens/MedicineDetector';
import InjuryScreen from './screens/injuryScreen';
import IdentifiedMedicine from './screens/IdentifiedMedicine';
import PublicTransportNavigation from './screens/PublicTransportNavigation';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="Menu" screenOptions={{headerShown:false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="FallDetection" component={FallDetection} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="MedicineDetector" component={MedicineDetector} />
          <Stack.Screen name="InjuryDetector" component={InjuryScreen} />
          <Stack.Screen name="IdentifiedMedicine" component={IdentifiedMedicine} />
          <Stack.Screen name="PublicTransport" component={PublicTransportNavigation} />

        </Stack.Navigator>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
