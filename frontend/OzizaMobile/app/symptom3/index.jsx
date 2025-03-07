import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    const newSize = size * scaleFactor;
    return Math.ceil(newSize);
};

const getSafeAreaTop = () => {
    if (Platform.OS === 'ios') {
        return 40;
    }
    return 20;
};

const SypmtomChecker3 = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { symptomsList: symptomsListString, age, sex } = params;

    // Parse the symptomsList from a string to an array
    const initialSymptomsList = symptomsListString ? JSON.parse(symptomsListString) : [];
    const [symptomsList, setSymptomsList] = useState(initialSymptomsList);

    const deleteSymptom = (id) => {
        const updatedList = symptomsList.filter((symptom) => symptom.id !== id);
        setSymptomsList(updatedList); // Update the state
    };

    const handlePrevious = () => {
        router.back();
    };

    const handleContinue = () => {
        router.push({
            pathname: "/symptom4",
            params: { symptomsList: JSON.stringify(symptomsList), age, sex },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Symptom Checker</Text>
            </View>

            <Text style={styles.subTitle}>My Symptoms</Text>
            <FlatList
                data={symptomsList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.symptomItem}>
                        <Text style={styles.symptomText}>{item.name}</Text>
                        <TouchableOpacity onPress={() => deleteSymptom(item.id)}>
                            <Icon name="delete" size={responsiveFontSize(24)} color="#ff0000" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button1} onPress={handlePrevious}>
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: getSafeAreaTop(),
        paddingHorizontal: width * 0.04,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.02,
    },
    title: {
        fontSize: responsiveFontSize(20),
        fontWeight: '800',
        marginLeft: width * 0.02,
    },
    subTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: '600',
        marginTop: height * 0.03,
        marginBottom: height * 0.02,
    },
    symptomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.04,
        borderBottomWidth: 1,
        backgroundColor: "#E2E4EA",
        borderBottomColor: '#ccc',
    },
    symptomText: {
        fontSize: responsiveFontSize(16),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.01,
        paddingBottom: height * 0.04,
        marginTop: height * 0.16,
    },
    button: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        width: width * 0.40,
    },
    button1: {
        backgroundColor: '#265664',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        width: width * 0.43,
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
});

export default SypmtomChecker3;