import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getSymptoms } from '../../services/api';
import { useLocalSearchParams } from 'expo-router';

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

const SypmtomChecker2 = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { age, sex } = params;

    const [symptomInput, setSymptomInput] = useState('');
    const [symptomsList, setSymptomsList] = useState([]);
    const [suggestedSymptoms, setSuggestedSymptoms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSymptoms = async () => {
            if (symptomInput.trim().length > 0) {  // Changed from > 2 to > 0
                setIsLoading(true);
                setError(null);
                try {
                    const data = await getSymptoms(symptomInput);
                    // Filter for exact matches first
                    const exactMatches = data.filter(s =>
                        s.name.toLowerCase() === symptomInput.toLowerCase()
                    );
                    // If exact match found, use only that
                    if (exactMatches.length > 0) {
                        setSuggestedSymptoms(exactMatches);
                    } else {
                        setSuggestedSymptoms(data);
                    }
                } catch (err) {
                    setError('Failed to fetch symptoms. Please try again.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestedSymptoms([]);
            }
        };

        const debounceTimer = setTimeout(fetchSymptoms, 300);
        return () => clearTimeout(debounceTimer);
    }, [symptomInput]);

    const addSymptom = (symptom) => {
        try {
            // If symptom is an object (from search), use it directly
            if (typeof symptom === 'object') {
                setSymptomsList([...symptomsList, {
                    id: symptom.id.toString(),
                    name: symptom.name
                }]);
                setSymptomInput('');
            }
            // If it's text input, create a new symptom object
            else if (symptomInput.trim()) {
                const newSymptom = {
                    id: Date.now().toString(),
                    name: symptomInput.trim(),
                };
                setSymptomsList([...symptomsList, newSymptom]);
                setSymptomInput('');
            }
        } catch (error) {
            console.error('Error adding symptom:', error);
            setError('Failed to add symptom. Please try again.');
        }
    };

    const handleAddFromList = (symptom) => {
        addSymptom(symptom);
    };

    const handleFinish = () => {
        if (symptomsList.length === 0) {
            setError('Please add at least one symptom');
            return;
        }
        router.push({
            pathname: "/symptom3",
            params: {
                symptomsList: JSON.stringify(symptomsList),
                age,
                sex
            },
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Symptom Checker</Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a symptom"
                    placeholderTextColor="#808080"
                    value={symptomInput}
                    onChangeText={setSymptomInput}
                />
                <TouchableOpacity
                    style={[styles.addButton, !symptomInput.trim() && styles.disabledButton]}
                    onPress={() => addSymptom(symptomInput)}
                    disabled={!symptomInput.trim()}
                >
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            {isLoading && (
                <ActivityIndicator size="small" color="#032825" style={styles.loadingIndicator} />
            )}

            {symptomInput.trim().length > 0 && !isLoading && suggestedSymptoms.length > 0 && (
                <View style={styles.searchResults}>
                    {suggestedSymptoms.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.searchResultItem,
                                item.name.toLowerCase() === symptomInput.toLowerCase() && styles.exactMatchItem
                            ]}
                            onPress={() => handleAddFromList(item)}
                        >
                            <Text style={styles.searchResultText}>{item.name}</Text>
                            {item.name.toLowerCase() === symptomInput.toLowerCase() && (
                                <Text style={styles.exactMatchBadge}>Exact Match</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <Text style={styles.infoText}>
                For better results, type your primary symptoms first, then add additional symptoms.
            </Text>

            <Text style={styles.subTitle}>Recently searched symptoms:</Text>

            <View style={styles.symptomsList}>
                {symptomsList.slice(0, 5).map((item) => (
                    <View style={styles.symptomItem} key={item.id}>
                        <Text style={styles.symptomText}>{item.name}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.finishButton, symptomsList.length === 0 && styles.disabledButton]}
                onPress={handleFinish}
                disabled={symptomsList.length === 0}
            >
                <Text style={styles.finishButtonText}>Continue</Text>
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
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: width * 0.03,
        borderRadius: 5,
        marginVertical: height * 0.01,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: responsiveFontSize(14),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.02,
        marginBottom: height * 0.02,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: width * 0.03,
        fontSize: responsiveFontSize(16),
        flex: 1,
    },
    addButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        marginLeft: width * 0.02,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    addButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(14),
    },
    loadingIndicator: {
        marginVertical: height * 0.01,
    },
    searchResults: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        maxHeight: height * 0.3,
        marginBottom: height * 0.02,
    },
    searchResultItem: {
        padding: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchResultText: {
        fontSize: responsiveFontSize(16),
    },
    infoText: {
        fontSize: responsiveFontSize(14),
        backgroundColor: '#D9D9D9',
        paddingVertical: height * 0.03,
        paddingHorizontal: width * 0.03,
        color: '#000000',
        marginBottom: height * 0.03,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginBottom: height * 0.02,
    },
    symptomsList: {
        marginBottom: height * 0.02,
    },
    symptomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    symptomText: {
        fontSize: responsiveFontSize(16),
    },
    finishButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    finishButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
    exactMatchItem: {
        backgroundColor: '#e8f5e9', // Light green background for exact matches
    },
    exactMatchBadge: {
        fontSize: responsiveFontSize(12),
        color: '#2e7d32', // Dark green text
        marginTop: height * 0.005,
        fontStyle: 'italic',
    },
});

export default SypmtomChecker2;