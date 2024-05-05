import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { DeprecatedViewPropTypes } from "deprecated-react-native-prop-types";
import { Camera } from "expo-camera";
import axios from "axios";
import * as Speech from "expo-speech";
import { State, TapGestureHandler } from "react-native-gesture-handler";

export default function InjuryDetector(props) {
  const [startCamera, setStartCamera] = useState(false);
  const cameraRef = useRef(null);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    Speech.speak(
      "Welcome to the Injury Detection page. Injury scanner will start when you thriple tap the screen",
      { rate: 1 }
    );
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

  // Real-time video streaming
  // const sendFrameToBackend = async (uri) => {
  //   try {
  //     const response = await axios.post(
  //       "http://192.168.8.160:5000/injury-detection",
  //       uri
  //     );
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   let isMounted = true;
  //   const sendFrames = async () => {
  //     if (cameraRef.current) {
  //       const { uri } = await cameraRef.current.recordAsync({quality: '360p'});
  //       if (isMounted) {
  //         sendFrameToBackend(uri);
  //         setTimeout(sendFrames, 1000);
  //       }
  //     }
  //   };

  //   if (startCamera) {
  //     sendFrames();
  //   }

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [startCamera]);

  // //sattic test
  const handleDoubleTap = async (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setTapCount(tapCount + 1);
      if (tapCount === 2) {
        handleInjuryDetection();
        setTapCount(0);
        console.log("pressed");
        Speech.speak("Injury detection started", { rate: 1 });
      }
    }
  };
  const handleInjuryDetection = async () => {
    try {
      const response = await axios.post(
        "http://192.168.8.160:5000/injury-detection"
      );
      console.log(response.data);
      Speech.speak(response.data, { rate: 1 });
    } catch (error) {
      Speech.speak(
        "An error occurred while processing your request. Please try again later.",
        { rate: 1 }
      );
    }
  };

  return (
    <TapGestureHandler onHandlerStateChange={handleDoubleTap}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.heading}>Injury Detection</Text>
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
        <TouchableOpacity
          onPress={() => navigation.navigate("Menu")}
          style={styles.homeIconContainer}
        >
          <Image
            source={require("../assets/home.png")}
            style={styles.homeIcon}
          />
        </TouchableOpacity>
      </View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  homeIconContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  homeIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
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
    position: "absolute",
    top: "15%",
    left: "5%",
  },
  cameraContainer: {
    width: "95%",
    height: "65%",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  microphone: {
    position: "absolute",
    bottom: 10,
    width: "25%",
    height: "25%",
    resizeMode: "contain",
  },
});
