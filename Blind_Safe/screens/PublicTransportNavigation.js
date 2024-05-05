import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    TextInput,
    Button, Animated, Vibration, TouchableWithoutFeedback,
} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import * as Location from "expo-location";
import MapViewStyle from "../utils/map-config.json";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import {GOOGLE_API_KEY} from "../utils/environments";
import MapViewDirections from "react-native-maps-directions";

const PublicTransportNavigation = () => {
    const [stage, setStage] = useState(0);
    const [destination, setDestination] = useState("");
    const [transportMethod, setTransportMethod] = useState("");
    const [coordinates, setCoordinates] = useState([]);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [location, setLocation] = useState(null);
    const [searchedLocation, setSearchedLocation] = useState(null);

    const micAnimation = new Animated.Value(1);

    const playVoice = () => {
        let introMessage = "You are now in Public Transport Navigation Page."

        if (stage === 0) {
            introMessage = "Where do you want to go?";
        } else if (stage === 1) {
            introMessage = "What is your preferred transport method?";
        } else if (stage === 2) {
            introMessage = "You are now in Public Transport Navigation Page.";
        }
        // Function to trigger the microphone animation
        const triggerAnimation = () => {
            animateMic();
        };

        // Start the microphone animation
        triggerAnimation();

        // Start speech synthesis
        Speech.speak(introMessage, {language: 'en', onDone: () => clearTimeout(micAnimationLoop)});
    };

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

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    useEffect(() => {
        if (stage === 0 || stage === 1) {
            handleSpeechInput(
                stage === 0
                    ? "Where do you want to go?"
                    : "What is your preferred transport method?"
            );
        }
    }, [stage]);

    const handleSpeechInput = async (question) => {
        try {
            await Speech.speak(question, {language: "en"});
            await Voice.start("en-US");
            Voice.onSpeechResults = onSpeechResults;
            setWaitingForInput(true);
        } catch (error) {
            console.error(error);
        }
    };

    const onSpeechResults = (event) => {
        const result = event.value[0];
        if (stage === 0) {
            setDestination(result);
            setStage(1);
        } else if (stage === 1) {
            setTransportMethod(result);
            setStage(2);
        }
        Voice.stop();
        setWaitingForInput(false);
    };

    const handleTextChange = (text) => {
        if (stage === 0) {
            setDestination(text);
        } else if (stage === 1) {
            setTransportMethod(text);
        }
    };

    const handleSubmit = () => {
        if (stage === 0) {
            setStage(1);
        } else if (stage === 1 && transportMethod.trim() !== "") {
            setStage(2);
        }
    };

    return (
        <TouchableWithoutFeedback onLongPress={onLongPress}>

            <View style={styles.container}>
                {(stage === 0 || stage === 1) && (
                    <Image
                        source={require("../assets/blindSafeLogo.png")}
                        style={styles.appLogo}
                    />
                )}
                {waitingForInput && <ActivityIndicator size="large" color="#0000ff"/>}
                {stage === 0 && (

                    <View style={styles.stageContainer}>
                        <Text style={styles.question}>Where do you want to go?</Text>
                        <GooglePlacesAutocomplete
                            styles={{
                                container: {
                                    flex: 0,
                                    width: 300,
                                    marginBottom: 10,
                                    top: 0,
                                    paddingHorizontal: 10,
                                },
                            }}
                            enablePoweredByContainer={false}
                            placeholder="Search"
                            fetchDetails={true}
                            onPress={(data, details, flag = null) => {
                                const location = {
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                };
                                setDestination(details.name)
                                setSearchedLocation(location);
                            }}
                            query={{
                                key: GOOGLE_API_KEY,
                                language: "en",
                            }}
                        />
                        <Button title="Submit" onPress={handleSubmit}/>
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
                    </View>
                )}
                {stage === 1 && (
                    <View style={styles.stageContainer}>
                        <Text style={styles.question}>
                            What is your preferred transport method?
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleTextChange}
                            value={transportMethod}
                            placeholder="Enter transport method"
                        />
                        <Button title="Submit" onPress={handleSubmit}/>
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
                    </View>
                )}
                {stage === 2 && (
                    <>
                        <Image
                            source={require("../assets/blindSafeLogo.png")}
                            style={styles.appHeader}
                        />
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            location={location}
                            region={{
                                latitude: location?.latitude,
                                longitude: location?.longitude,
                                latitudeDelta: 0.0422,
                                longitudeDelta: 0.0421,
                            }}
                            initialRegion={{
                                latitude: location?.latitude,
                                longitude: location?.longitude,
                                latitudeDelta: 0.0422,
                                longitudeDelta: 0.0421,
                            }}
                            customMapStyle={MapViewStyle}
                        >
                            <Marker
                                coordinate={{
                                    latitude: location?.latitude,
                                    longitude: location?.longitude,
                                }}
                            >
                                <Image
                                    source={require("../assets/user.png")}
                                    style={{width: 40, height: 40}}
                                />
                            </Marker>

                            {searchedLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: searchedLocation.latitude,
                                        longitude: searchedLocation.longitude,
                                    }}
                                />
                            )}
                            {coordinates.length > 0 && (
                                <Polyline
                                    coordinates={coordinates}
                                    strokeColor="#000"
                                    strokeWidth={6}
                                />
                            )}
                            <MapViewDirections
                                origin={location}
                                destination={searchedLocation}
                                apikey={GOOGLE_API_KEY}
                                strokeWidth={4}
                                strokeColor="pink"
                                mode="transit"
                                transitOptions={{
                                    modes: ["TRANSIT","WALKING"],
                                    routingPreference: 'fewer_transfers',
                                    departureTime: new Date(Date.now()),
                                }}
                            />

                        </MapView>
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Destination: </Text>
                                <Text style={styles.infoText}>{destination}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Transport Method: </Text>
                                <Text style={styles.infoText}>{transportMethod}</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </TouchableWithoutFeedback>

    );
};

const styles = StyleSheet.create({
    infoContainer: {
        marginTop: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        width: '90%',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 18,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    stageContainer: {
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        height: 40,
        width: 200,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    map: {
        flex: 1,
        width: "100%",
    },
    appHeader: {
        width: 200,
        height: 30,
        marginTop: 50,
        marginBottom: 20,
    },
    appLogo: {
        width: 200,
        height: 30,
        position: "absolute",
        top: 50,
    },
    question: {
        fontSize: 20,
        marginBottom: 20,
    },
    microphone: {
        position: 'absolute',
        top: 300,
        width: 108,
        height: 129,
        resizeMode: 'contain',
    },
});

export default PublicTransportNavigation;
