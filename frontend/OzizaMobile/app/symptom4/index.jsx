import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { submitSymptoms } from '../../services/api';

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
    const [conditions, setConditions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const diagnose = async () => {
            try {
                if (!symptomsList) {
                    throw new Error('No symptoms provided');
                }

                const parsedSymptoms = JSON.parse(symptomsList);
                if (!Array.isArray(parsedSymptoms)) {
                    throw new Error('Invalid symptoms format');
                }

                const symptomIds = parsedSymptoms.map(s => s.id).filter(id => id !== undefined);
                if (symptomIds.length === 0) {
                    throw new Error('No valid symptom IDs found');
                }

                const response = await submitSymptoms(symptomIds);

                // Handle different response structures
                const potentialDiseases = response.data?.potential_diseases || response.potential_diseases || [];

                if (potentialDiseases.length === 0) {
                    throw new Error('No matching conditions found for your symptoms');
                }

                setConditions(potentialDiseases);
            } catch (err) {
                setError(err.message || 'Failed to analyze symptoms');
                setConditions([]);
            } finally {
                setIsLoading(false);
            }
        };

        diagnose();
    }, [symptomsList]);

    const getMatchStrength = (confidence) => {
        if (!confidence) return 'Unknown';
        if (confidence > 75) return 'Strong match';
        if (confidence > 50) return 'Moderate match';
        return 'Weak match';
    };

    const handlePrevious = () => {
        router.back();
    };

    const handleContinue = (condition) => {
        try {
            if (!condition) {
                throw new Error('No condition selected');
            }

            router.push({
                pathname: "/symptom5",
                params: {
                    condition: JSON.stringify(condition),
                    symptomsList,
                    age,
                    sex
                },
            });
        } catch (error) {
            setError(error.message || "Failed to proceed");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#032825" />
                <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
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

    const parsedSymptomsList = symptomsList ? JSON.parse(symptomsList) : [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePrevious}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Symptom Checker</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.subTitle}>Conditions that match your symptoms</Text>

                {conditions.length > 0 ? (
                    <View style={styles.conditionsList}>
                        {conditions.map((item, index) => (
                            <TouchableOpacity
                                key={item?.disease?.id || index}
                                style={styles.conditionItem}
                                onPress={() => handleContinue(item?.disease)}
                            >
                                <View style={styles.conditionContent}>
                                    <Text style={styles.conditionName}>
                                        {item?.disease?.name || 'Unknown Condition'}
                                    </Text>
                                    <MatchStrengthIndicator strength={getMatchStrength(item?.confidence_score)} />
                                    <Text style={styles.confidenceText}>
                                        {item?.confidence_score ? Math.round(item.confidence_score) : 'N/A'}% confidence
                                    </Text>
                                </View>
                                <Icon name="chevron-right" size={responsiveFontSize(24)} color="#000" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noResultsText}>No matching conditions found</Text>
                )}

                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>Gender: {sex || 'Not specified'}</Text>
                    <Text style={styles.infoText}>Age: {age || 'Not specified'}</Text>
                </View>

                <View style={styles.symptomsSection}>
                    <Text style={styles.subTitle}>My Symptoms</Text>
                    <Text style={styles.symptomsText}>
                        {parsedSymptomsList.length > 0
                            ? parsedSymptomsList.map(s => s?.name).filter(Boolean).join(', ')
                            : 'No symptoms'}
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button1} onPress={handlePrevious}>
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                    {conditions.length > 0 && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleContinue(conditions[0]?.disease)}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    )}
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
        backgroundColor: '#E9EBF4',
        borderRadius: 8,
        marginBottom: height * 0.015,
    },
    conditionContent: {
        flex: 1,
    },
    conditionName: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
    },
    confidenceText: {
        fontSize: responsiveFontSize(14),
        color: '#666',
        marginTop: height * 0.005,
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
        backgroundColor: '#4CAF50',
    },
    unfilledBox: {
        backgroundColor: '#E0E0E0',
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
        marginTop: height * 0.02,
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
    noResultsText: {
        fontSize: responsiveFontSize(16),
        textAlign: 'center',
        marginVertical: height * 0.02,
        color: '#666',
    },
});

export default SypmtomChecker4;