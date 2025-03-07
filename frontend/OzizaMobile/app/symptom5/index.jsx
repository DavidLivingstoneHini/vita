import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
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

const SypmtomChecker5 = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { condition, symptomsList, age, sex } = params;

    const parsedCondition = condition ? JSON.parse(condition) : null;

    // State to track the selected response
    const [selectedResponse, setSelectedResponse] = useState(null);

    const handlePrevious = () => {
        router.back();
    };

    const handleContactDoctor = () => {
        router.push("/findoctor");
    };

    // Function to handle button selection
    const handleResponseSelection = (response) => {
        setSelectedResponse(response);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Symptom Checker</Text>
            </View>

            <Text style={styles.conditionTitle}>{parsedCondition.name}</Text>
            <Text style={styles.sectionTitle}>Symptoms</Text>
            <Text style={styles.sectionText}>Cough, Fever, Headache</Text>

            <Text style={styles.sectionTitle}>How Common</Text>
            <Text style={styles.sectionText}>Very common</Text>

            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.sectionText}>
                The common cold is a viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way.
            </Text>

            <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Risk Factors</Text>
            <Text style={styles.sectionText}>
                Risk factors for the common cold include close contact with someone who has a cold, weakened immune system, and time of year (more common in winter).
            </Text>

            <Text style={styles.sectionTitle}>Do you think you have this condition?</Text>
            <View style={styles.responseButtons}>
                {/* Yes Button */}
                <TouchableOpacity
                    style={[styles.responseButton, selectedResponse === 'Yes' && styles.selectedResponseButton]}
                    onPress={() => handleResponseSelection('Yes')}
                >
                    <Text style={[styles.responseButtonText, selectedResponse === 'Yes' && styles.selectedResponseText]}>Yes</Text>
                </TouchableOpacity>

                {/* No Button */}
                <TouchableOpacity
                    style={[styles.responseButton, selectedResponse === 'No' && styles.selectedResponseButton]}
                    onPress={() => handleResponseSelection('No')}
                >
                    <Text style={[styles.responseButtonText, selectedResponse === 'No' && styles.selectedResponseText]}>No</Text>
                </TouchableOpacity>

                {/* Maybe Button */}
                <TouchableOpacity
                    style={[styles.responseButton, selectedResponse === 'Maybe' && styles.selectedResponseButton]}
                    onPress={() => handleResponseSelection('Maybe')}
                >
                    <Text style={[styles.responseButtonText, selectedResponse === 'Maybe' && styles.selectedResponseText]}>Maybe</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.contactDoctorButton} onPress={handleContactDoctor}>
                <Text style={styles.contactDoctorText}>Contact a Doctor</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
        </ScrollView>
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
    conditionTitle: {
        fontSize: responsiveFontSize(20),
        fontWeight: '700',
        marginTop: height * 0.02,
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    sectionTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginBottom: height * 0.01,
    },
    sectionText: {
        fontSize: responsiveFontSize(15),
        marginBottom: height * 0.03,
    },
    readMoreButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        width: '40%',
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginBottom: height * 0.03,
    },
    readMoreText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
    responseButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.02,
    },
    responseButton: {
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        width: width * 0.3,
    },
    selectedResponseButton: {
        backgroundColor: '#032825',
        borderColor: '#032825',
    },
    responseButtonText: {
        fontSize: responsiveFontSize(15),
        color: '#000',
    },
    selectedResponseText: {
        color: 'white',
    },
    contactDoctorButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        marginHorizontal: width * 0.09,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    contactDoctorText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
    previousButton: {
        backgroundColor: '#265664',
        borderRadius: 8,
        width: '50%',
        paddingVertical: height * 0.02,
        alignItems: 'center',
    },
    previousButtonText: {
        fontSize: responsiveFontSize(16),
        color: 'white',
    },
});

export default SypmtomChecker5;
