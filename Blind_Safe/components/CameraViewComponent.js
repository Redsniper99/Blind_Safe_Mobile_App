import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

const CameraViewComponent = ({handleTripleTap}) => {
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
                        <Text style={styles.text}> Flip Camera </Text>
                    </TouchableOpacity>
                    {isCameraReady && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                console.log("Picture Taken");
                                // Implement scanning or capturing functionality here
                            }}
                        >
                            <Text style={styles.text}> Scan </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Camera>
            <View style={styles.container}>
                <Text style={styles.text}>Obstacle Detection Running</Text>
                <Button
                    onPress={handleTripleTap}
                    title="Map View"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
    },
    text: {
        fontSize: 18,
        color: 'black',
    },
});

export default CameraViewComponent;
