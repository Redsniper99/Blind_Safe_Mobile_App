import React from 'react';
import {View, StyleSheet, Image, Text, Button} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_API_KEY } from '../utils/environments';
import MapViewStyle from '../utils/map-config.json';

const MapViewComponent = ({ location, searchedLocation, destination, transportMethod, coordinates, handleTripleTap }) => {
    return (
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
                    strokeColor="#FFFFFF"
                    mode="TRANSIT"
                    transitOptions={{
                        modes: [transportMethod.toUpperCase()],
                        routingPreference: [''],
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
                <View>
                    <Button
                        onPress={handleTripleTap}
                        title="Object Detect"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>
            </View>
        </>
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

export default MapViewComponent;
