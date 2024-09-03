import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

const CameraViewComponent = ({ handleTripleTap }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [isCameraReady, setIsCameraReady] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleCameraReady = () => {
        setIsCameraReady(true);
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/blindSafeLogo.png")}
                style={styles.appLogo}
            />
            <Camera
                style={styles.camera}
                type={type}
                onCameraReady={handleCameraReady}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}
                    >
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    {isCameraReady && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                console.log("Picture Taken");
                                // Implement scanning or capturing functionality here
                            }}
                        >
                            <Text style={styles.text}>Scan</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Camera>
            <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>Obstacle Detection Running</Text>
                <Button
                    onPress={handleTripleTap}
                    title="Map View"
                    color="#841584"
                    accessibilityLabel="Navigate to Map View"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    appLogo: {
        width: 200,
        height: 50,
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
        top: 100,
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    text: {
        fontSize: 18,
        color: 'black',
    },
    bottomContainer: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    bottomText: {
        fontSize: 20,
        marginBottom: 10,
    },
});

export default CameraViewComponent;
