import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const FallDetection = () => {
  const [WristBandConnection, setWristBandConnection] = useState(false);
  const [emergencyServiceAlert, setEmergencyServiceAlert] = useState(false);
  const [guardianContact, setGuardianContact] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [message, setMessage] = useState('');

  const toggleEmergencyServiceAlert = () => {
    setEmergencyServiceAlert(!emergencyServiceAlert);
  };

  const navigation = useNavigation(); // Initialize navigation

  const handleSendMessage = () => {
    // Functionality to handle sending message
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/blindSafeLogo.png')} style={styles.logo} />
      <Text style={styles.title}>Fall Detection</Text>
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>Wrist-Band</Text>
        <Text style={[styles.alertText, { color: WristBandConnection ? 'green' : 'red' }]}>
          {WristBandConnection ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>Emergency Service Alert</Text>
        <TouchableOpacity onPress={toggleEmergencyServiceAlert}>
          <Switch
            value={emergencyServiceAlert}
            onValueChange={toggleEmergencyServiceAlert}
            thumbColor={emergencyServiceAlert ? '#174EA2' : '#070057'}
            trackColor={{ true: '#070057', false: '#174EA2' }}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Guardian Contact No"
          value={guardianContact}
          onChangeText={text => setGuardianContact(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact No"
          value={emergencyContact}
          onChangeText={text => setEmergencyContact(text)}
        />
      </View>
      
      <TextInput
        style={styles.messageInput}
        multiline
        placeholder="Type your message here..."
        value={message}
        onChangeText={text => setMessage(text)}
      />
      <TouchableOpacity onPress={handleSendMessage}>
        <Image source={require('../assets/mic.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
  <Image source={require('../assets/home.png')} style={styles.homeIcon} />
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    marginHorizontal: 40,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  title: {
    marginTop: -40,
    fontSize: 40,
    marginBottom: 50,
    fontWeight: 'bold',
  },
  alertContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  alertText: {
    fontSize: 15,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    backgroundColor: '#F6F6F6',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    
  },
  messageInput: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    backgroundColor: '#F6F6F6',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  icon: {
    marginTop: 40,
    width: 200,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  homeIcon: {
    marginTop: 80,
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',

  },
});

export default FallDetection;
