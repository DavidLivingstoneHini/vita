import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView, ActivityIndicator, FlatList } from 'react-native';
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

const SymptomChecker2 = () => {
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
            if (symptomInput.trim().length > 0) {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await getSymptoms(symptomInput);
                    const exactMatches = data.filter(s =>
                        s.name.toLowerCase() === symptomInput.toLowerCase()
                    );
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
            if (typeof symptom === 'object') {
                // Check if symptom already exists in the list
                if (!symptomsList.some(item => item.id === symptom.id)) {
                    setSymptomsList([...symptomsList, {
                        id: symptom.id.toString(),
                        name: symptom.name
                    }]);
                    setSymptomInput('');
                } else {
                    setError('This symptom is already added');
                }
            }
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

    const removeSymptom = (id) => {
        setSymptomsList(symptomsList.filter(item => item.id !== id));
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

    const renderSymptomItem = ({ item }) => (
        <View style={styles.symptomItem}>
            <Text style={styles.symptomText} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
            </Text>
            <TouchableOpacity onPress={() => removeSymptom(item.id)}>
                <Icon name="close" size={responsiveFontSize(18)} color="#999" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
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
                        returnKeyType="done"
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
                        <FlatList
                            data={suggestedSymptoms}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
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
                            )}
                            keyboardShouldPersistTaps="always"
                            nestedScrollEnabled
                        />
                    </View>
                )}

                <Text style={styles.infoText}>
                    For better results, type your primary symptoms first, then add additional symptoms.
                </Text>

                {symptomsList.length > 0 && (
                    <>
                        <Text style={styles.subTitle}>Your symptoms:</Text>
                        <View style={styles.symptomsListContainer}>
                            <FlatList
                                data={symptomsList}
                                renderItem={renderSymptomItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                contentContainerStyle={styles.symptomsListContent}
                            />
                        </View>
                    </>
                )}

                <TouchableOpacity
                    style={[styles.finishButton, symptomsList.length === 0 && styles.disabledButton]}
                    onPress={handleFinish}
                    disabled={symptomsList.length === 0}
                >
                    <Text style={styles.finishButtonText}>Continue</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingTop: getSafeAreaTop(),
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.05,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.02,
        marginBottom: height * 0.01,
    },
    title: {
        fontSize: responsiveFontSize(20),
        fontWeight: '800',
        marginLeft: width * 0.02,
        flex: 1,
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
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: width * 0.03,
        fontSize: responsiveFontSize(16),
        minHeight: height * 0.06,
    },
    addButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        marginLeft: width * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: height * 0.06,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    addButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(14),
        fontWeight: '500',
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
        backgroundColor: '#F5F5F5',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.03,
        color: '#000000',
        marginBottom: height * 0.03,
        textAlign: 'center',
        borderRadius: 8,
    },
    subTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginBottom: height * 0.015,
        marginTop: height * 0.01,
    },
    symptomsListContainer: {
        marginBottom: height * 0.02,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        backgroundColor: '#FAFAFA',
    },
    symptomsListContent: {
        paddingHorizontal: width * 0.02,
    },
    symptomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    symptomText: {
        fontSize: responsiveFontSize(16),
        flex: 1,
        marginRight: width * 0.02,
    },
    finishButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginTop: height * 0.02,
        minHeight: height * 0.06,
        justifyContent: 'center',
    },
    finishButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
    },
    exactMatchItem: {
        backgroundColor: '#e8f5e9',
    },
    exactMatchBadge: {
        fontSize: responsiveFontSize(12),
        color: '#2e7d32',
        marginTop: height * 0.005,
        fontStyle: 'italic',
    },
});

export default SymptomChecker2;