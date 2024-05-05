import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";
import * as Speech from "expo-speech";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";

export default function MedicineDetector({ navigation }) {
  const [startCamera, setStartCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    Speech.speak(
      "Welcome to the Medicine Detection page. Medicine scanner will start when you double tap the screen",
      { rate: 1 }
    );
  }, []);

  useEffect(() => {
    __startCamera();
  }, []);

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const [injuryDetected, setInjuryDetected] = useState(false);

  useEffect(() => {
    handleInjuryDetection();
  }, []);

  const handleInjuryDetection = async () => {
    try {
      const response = await axios.post(
        "http://192.168.8.160:5000/injury-detection"
      );
      // Handle response
      console.log(response.data);
      setInjuryDetected(true);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  const handleEditPress = () => {
    // Navigate to another screen when edit button is pressed
    navigation.navigate('IdentifiedMedicine'); // Replace 'EditScreen' with the name of your screen
  };

  const handleEditLongPress = () => {
    // Your long press functionality here
    console.log('Edit button long pressed');
    // For example, you can display an alert
    Alert.alert('Edit button long pressed');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Edit Icon */}
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleEditLongPress();
          }
        }}>
        <TouchableOpacity onPress={handleEditPress} style={styles.editIconContainer}>
          <Image source={require('../assets/edit.png')} style={styles.editIcon} />
        </TouchableOpacity>
      </LongPressGestureHandler>

      {/* Title Container */}
      <View style={styles.titleContainer}>
        <Text style={styles.heading}>Medicine Detection</Text>
      </View>

      {/* App logo */}
      <Image
        source={require("../assets/blindSafeLogo.png")}
        style={styles.appLogo}
      />

      {/* Camera Module */}
      {startCamera ? (
        <View style={styles.cameraContainer}>
          <Camera style={{ flex: 1, width: "100%" }} ref={cameraRef} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
      )}

      {/* Home Icon */}
      <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={styles.homeIconContainer}>
        <Image source={require('../assets/home.png')} style={styles.homeIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  editIconContainer: {
    position: 'absolute',
    top: "15%",
    right: "5%",
  },
  editIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: "15%",
    left: "5%",
  },
  homeIconContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  homeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  appLogo: {
    width: "50%",
    height: "20%",
    position: "absolute",
    top: 0,
  },
  heading: {
    color: "#070057",
    fontSize: 32,
    fontWeight: "bold",
  },
  cameraContainer: {
    width: "90%",
    height: "50%",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  microphone: {
    position: "absolute",
    bottom: 10,
    width: "25%",
    height: "25%",
    resizeMode: "contain",
  },
});
