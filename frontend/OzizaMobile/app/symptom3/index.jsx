import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

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
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#032825" />
                </TouchableOpacity>
                <Text style={styles.title}>Symptom Checker</Text>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.subTitle}>My Symptoms</Text>

                {symptomsList.length > 0 ? (
                    <FlatList
                        data={symptomsList}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => (
                            <View style={styles.symptomItem}>
                                <View style={styles.symptomIconContainer}>
                                    <Icon name="medical-services" size={responsiveFontSize(20)} color="#032825" />
                                </View>
                                <Text style={styles.symptomText}>{item.name}</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteSymptom(item.id)}
                                >
                                    <Icon name="close" size={responsiveFontSize(16)} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Icon name="error-outline" size={responsiveFontSize(40)} color="#CCCCCC" />
                        <Text style={styles.emptyText}>No symptoms added yet</Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button1} onPress={handlePrevious}>
                        <Icon name="arrow-back" size={responsiveFontSize(18)} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleContinue}>
                        <Text style={styles.buttonText}>Continue</Text>
                        <Icon name="arrow-forward" size={responsiveFontSize(18)} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FC',
        paddingTop: getSafeAreaTop(),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: responsiveFontSize(20),
        fontWeight: '700',
        marginLeft: width * 0.03,
        color: '#032825',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
    },
    subTitle: {
        fontSize: responsiveFontSize(22),
        fontWeight: '700',
        marginTop: height * 0.03,
        marginBottom: height * 0.02,
        color: '#032825',
    },
    listContainer: {
        paddingBottom: 20,
    },
    symptomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.04,
        marginVertical: height * 0.008,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    symptomIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E8F0EF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    symptomText: {
        fontSize: responsiveFontSize(16),
        flex: 1,
        color: '#333333',
        fontWeight: '500',
    },
    deleteButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: height * 0.15,
    },
    emptyText: {
        fontSize: responsiveFontSize(16),
        color: '#999999',
        marginTop: 10,
    },
    footer: {
        paddingHorizontal: width * 0.05,
        paddingBottom: Platform.OS === 'ios' ? height * 0.05 : height * 0.03,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: height * 0.02,
    },
    button: {
        backgroundColor: '#032825',
        borderRadius: 10,
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.06,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: width * 0.42,
        elevation: 3,
        shadowColor: '#032825',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    button1: {
        backgroundColor: '#265664',
        borderRadius: 10,
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.06,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: width * 0.42,
        elevation: 3,
        shadowColor: '#265664',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginHorizontal: 8,
    },
});

export default SypmtomChecker3;