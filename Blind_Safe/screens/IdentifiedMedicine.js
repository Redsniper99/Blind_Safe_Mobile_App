import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IdentifiedMedicine = () => {

  const navigation = useNavigation();
  
  const [prescriptionDrugs, setPrescriptionDrugs] = useState([]);
  const [newMedicineName, setNewMedicineName] = useState('');
  const [newMorningDosage, setNewMorningDosage] = useState('');
  const [newNoonDosage, setNewNoonDosage] = useState('');
  const [newNightDosage, setNewNightDosage] = useState('');

  const addMedicine = () => {
    const newMedicine = {
      name: newMedicineName,
      morningDosage: newMorningDosage,
      noonDosage: newNoonDosage,
      nightDosage: newNightDosage
    };
    setPrescriptionDrugs([...prescriptionDrugs, newMedicine]);
    setNewMedicineName('');
    setNewMorningDosage('');
    setNewNoonDosage('');
    setNewNightDosage('');
  };

  const deleteMedicine = (index) => {
    const updatedMedicines = prescriptionDrugs.filter((_, i) => i !== index);
    setPrescriptionDrugs(updatedMedicines);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/blindSafeLogo.png')}
          style={styles.logo}
        />
      </View>

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>List of prescription drugs</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Name</Text>
            <Text style={styles.tableHeader}>Morning</Text>
            <Text style={styles.tableHeader}>Noon</Text>
            <Text style={styles.tableHeader}>Night</Text>
            <Text style={styles.tableHeader}></Text>
          </View>
          {prescriptionDrugs.map((medicine, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableData}>{medicine.name}</Text>
              <Text style={styles.tableData}>{medicine.morningDosage}</Text>
              <Text style={styles.tableData}>{medicine.noonDosage}</Text>
              <Text style={styles.tableData}>{medicine.nightDosage}</Text>
              <TouchableOpacity onPress={() => deleteMedicine(index)}>
                <Image source={require('../assets/delete.png')} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.inputLabel}>Medicine Name:</Text>
        <TextInput
          style={styles.input}
          value={newMedicineName}
          onChangeText={setNewMedicineName}
        />

        <View style={styles.dosageContainer}>
          <Text style={styles.inputLabel}>Dosage</Text>
          <Text style={styles.subInputLabel}>Morning:</Text>
          <TextInput
            style={styles.input}
            value={newMorningDosage}
            onChangeText={setNewMorningDosage}
          />
          <Text style={styles.subInputLabel}>Noon:</Text>
          <TextInput
            style={styles.input}
            value={newNoonDosage}
            onChangeText={setNewNoonDosage}
          />
          <Text style={styles.subInputLabel}>Night:</Text>
          <TextInput
            style={styles.input}
            value={newNightDosage}
            onChangeText={setNewNightDosage}
          />
        </View>

        <TouchableOpacity onPress={addMedicine} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Medicine</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.homeIconContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={styles.homeIconContainer}>
        <Image source={require('../assets/home.png')} style={styles.homeIcon} />
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom:-30,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    paddingVertical: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 15,
    textAlign: 'center',
    color: '#7C7C7C',
  },
  tableData: {
    flex: 1,
    marginLeft: 15,
  },
  inputLabel: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#7C7C7C',
  },
  subInputLabel: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7C7C7C',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    padding: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#070057',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  homeIconContainer: {
    marginBottom: 20,
  },
  homeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  dosageContainer: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    padding: 10,
    marginBottom: 20,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    marginleft: 10,
    marginRight: 10,
    resizeMode: 'contain',
  },
});

export default IdentifiedMedicine;
