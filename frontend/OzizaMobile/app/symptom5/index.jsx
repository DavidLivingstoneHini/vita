import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDiseaseDetails } from '../../services/api';

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
    const [diseaseDetails, setDiseaseDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedResponse, setSelectedResponse] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const parsedCondition = JSON.parse(condition);
                const details = await getDiseaseDetails(parsedCondition.id);
                setDiseaseDetails({
                    ...details,
                    name: parsedCondition.name,
                });
            } catch (err) {
                setError('Failed to load disease details. Please try again.');
                console.error('Error fetching disease details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [condition]);

    const handlePrevious = () => {
        router.back();
    };

    const handleContactDoctor = () => {
        router.push("/findoctor");
    };

    const handleResponseSelection = (response) => {
        setSelectedResponse(response);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#032825" />
                <Text style={styles.loadingText}>Loading condition details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Symptom Checker</Text>
                </View>

                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.retryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePrevious}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Symptom Checker</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.conditionTitle}>{diseaseDetails?.name}</Text>

                <Text style={styles.sectionTitle}>Symptoms</Text>
                <Text style={styles.sectionText}>
                    {diseaseDetails?.common_symptoms || 'Not specified'}
                </Text>

                <Text style={styles.sectionTitle}>How Common</Text>
                <Text style={styles.sectionText}>
                    {diseaseDetails?.prevalence || 'Not specified'}
                </Text>

                <Text style={styles.sectionTitle}>Overview</Text>
                <Text style={styles.sectionText}>
                    {diseaseDetails?.description || 'No description available'}
                </Text>

                <Text style={styles.sectionTitle}>Treatment</Text>
                <Text style={styles.sectionText}>
                    {diseaseDetails?.treatment || 'No treatment information available'}
                </Text>

                <Text style={styles.sectionTitle}>Risk Factors</Text>
                <Text style={styles.sectionText}>
                    {diseaseDetails?.risk_factors || 'No risk factors specified'}
                </Text>

                <Text style={styles.sectionTitle}>Do you think you have this condition?</Text>
                <View style={styles.responseButtons}>
                    <TouchableOpacity
                        style={[styles.responseButton, selectedResponse === 'Yes' && styles.selectedResponseButton]}
                        onPress={() => handleResponseSelection('Yes')}
                    >
                        <Text style={[styles.responseButtonText, selectedResponse === 'Yes' && styles.selectedResponseText]}>Yes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.responseButton, selectedResponse === 'No' && styles.selectedResponseButton]}
                        onPress={() => handleResponseSelection('No')}
                    >
                        <Text style={[styles.responseButtonText, selectedResponse === 'No' && styles.selectedResponseText]}>No</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.responseButton, selectedResponse === 'Maybe' && styles.selectedResponseButton]}
                        onPress={() => handleResponseSelection('Maybe')}
                    >
                        <Text style={[styles.responseButtonText, selectedResponse === 'Maybe' && styles.selectedResponseText]}>Maybe</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.contactDoctorButton}
                    onPress={handleContactDoctor}
                >
                    <Text style={styles.contactDoctorText}>Contact a Doctor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.previousButton}
                    onPress={handlePrevious}
                >
                    <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: getSafeAreaTop(),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    scrollContent: {
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.02,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: height * 0.02,
        fontSize: responsiveFontSize(16),
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
        lineHeight: responsiveFontSize(20),
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
        alignSelf: 'center',
    },
    previousButtonText: {
        fontSize: responsiveFontSize(16),
        color: 'white',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.05,
    },
    errorText: {
        fontSize: responsiveFontSize(16),
        color: '#D32F2F',
        textAlign: 'center',
        marginBottom: height * 0.03,
    },
    retryButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
    },
    retryButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
});

export default SypmtomChecker5;