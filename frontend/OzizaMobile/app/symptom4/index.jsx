import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
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

// Visual Indicator Component
const MatchStrengthIndicator = ({ strength }) => {
    const filledBoxes = {
        'Strong match': 4,
        'Moderate match': 3,
        'Weak match': 2,
    }[strength] || 0;

    return (
        <View style={styles.matchStrengthContainer}>
            <View style={styles.matchbox}>
                <View style={styles.matchStrengthBoxRow}>
                    {[...Array(4)].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.matchStrengthBox,
                                index < filledBoxes ? styles.filledBox : styles.unfilledBox,
                            ]}
                        />
                    ))}
                </View>
                <Text style={styles.matchStrengthText}>{strength}</Text>
            </View>
        </View>
    );
};

const SypmtomChecker4 = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { symptomsList, age, sex } = params;

    const parsedSymptomsList = symptomsList ? JSON.parse(symptomsList) : [];

    const conditions = [
        { id: '1', name: 'Common Cold', matchStrength: 'Strong match' },
        { id: '2', name: 'Flu', matchStrength: 'Moderate match' },
        { id: '3', name: 'Allergies', matchStrength: 'Weak match' },
    ];

    const handlePrevious = () => {
        router.back();
    };

    const handleContinue = (condition) => {
        router.push({
            pathname: "/symptom5",
            params: { condition: JSON.stringify(condition), symptomsList, age, sex },
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

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.subTitle}>Conditions that match your symptoms</Text>

                {/* Conditions List */}
                <View style={styles.conditionsList}>
                    {conditions.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.conditionItem} // Updated style to look like buttons
                            onPress={() => handleContinue(item)}
                        >
                            <View style={styles.conditionContent}>
                                <Text style={styles.conditionName}>{item.name}</Text>
                                <MatchStrengthIndicator strength={item.matchStrength} />
                            </View>
                            <Icon name="chevron-right" size={responsiveFontSize(24)} color="#000" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>Gender: {sex}</Text>
                    <Text style={styles.infoText}>Age: {age}</Text>
                </View>

                {/* Symptoms Section */}
                <View style={styles.symptomsSection}>
                    <Text style={styles.subTitle}>My Symptoms</Text>
                    <Text style={styles.symptomsText}>
                        {parsedSymptomsList.map((symptom) => symptom.name).join(', ')}
                    </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button1} onPress={handlePrevious}>
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleContinue(conditions[0])}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingTop: getSafeAreaTop(),
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.02,
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
    scrollContainer: {
        paddingHorizontal: width * 0.01,
        paddingBottom: height * 0.02,
    },
    subTitle: {
        fontSize: responsiveFontSize(15),
        color: '#061102',
        marginTop: height * 0.02,
        marginBottom: height * 0.02,
    },
    conditionsList: {
        marginBottom: height * 0.02,
    },
    conditionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.03,
        backgroundColor: '#E9EBF4',  // Background color to make it look like a button
        borderRadius: 8,             // Rounded corners
        marginBottom: height * 0.015,  // Space between items
    },
    conditionContent: {
        flex: 1,
    },
    conditionName: {
        fontSize: responsiveFontSize(16),
    },
    matchStrengthContainer: {
        marginTop: height * 0.01,
    },
    matchbox: {
        flexDirection: 'column',
    },
    matchStrengthText: {
        fontSize: responsiveFontSize(14),
        color: '#061102',
        marginTop: height * 0.005,
    },
    matchStrengthBoxRow: {
        flexDirection: 'row',
    },
    matchStrengthBox: {
        width: width * 0.05,
        height: height * 0.01,
        borderRadius: 4,
        marginRight: width * 0.01,
    },
    filledBox: {
        backgroundColor: '#4CAF50', // Light green
    },
    unfilledBox: {
        backgroundColor: '#E0E0E0', // Gray
    },
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.03,
        marginTop: height * 0.03,
    },
    infoText: {
        fontSize: responsiveFontSize(16),
    },
    symptomsSection: {
        marginTop: height * 0.02,
        marginBottom: height * 0.03,
        paddingHorizontal: width * 0.01,
    },
    symptomsText: {
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

export default SypmtomChecker4;
