import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useRouter } from "expo-router";
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

const SypmtomChecker1 = () => {
    const router = useRouter();
    const [age, setAge] = useState('');
    const [sex, setSex] = useState(null);

    const calculate = () => {
        if (age && sex) {
            router.push({
                pathname: "/symptom2",
                params: { age, sex }, // Pass age and sex as params
            });
        } else {
            alert("Please enter your age and select your sex.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Symptom Checker</Text>
            </View>

            <Text style={styles.centeredText}>
                Let’s Identify possible conditions and treatment related to your symptoms
            </Text>

            <View style={styles.ageContainer}>
                <Text style={styles.label}>How old are you?</Text>
                <TextInput
                    style={styles.ageInput}
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                />
            </View>

            <Text style={styles.label}>What is your sex?</Text>
            <View style={styles.sexButtonContainer}>
                <TouchableOpacity
                    style={[styles.sexButton, sex === 'male' && styles.selectedSexButton]}
                    onPress={() => setSex('male')}
                >
                    <Text style={[styles.sexButtonText, sex === 'male' && styles.selectedSexButtonText]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.sexButton, sex === 'female' && styles.selectedSexButton]}
                    onPress={() => setSex('female')}
                >
                    <Text style={[styles.sexButtonText, sex === 'female' && styles.selectedSexButtonText]}>Female</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={calculate}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimerText}>
                This tool does not provide medical advice, consult your doctor after using this tool
            </Text>
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
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.02,
    },
    title: {
        fontSize: responsiveFontSize(20),
        fontWeight: "800",
        marginLeft: 10,
    },
    centeredText: {
        fontSize: responsiveFontSize(16),
        fontWeight: 600,
        textAlign: 'center',
        marginVertical: height * 0.04,
        paddingHorizontal: width * 0.05,
    },
    ageContainer: {
        alignItems: 'center',
        marginVertical: height * 0.04,
    },
    label: {
        fontSize: responsiveFontSize(16),
        marginBottom: height * 0.025,
        fontWeight: 500,
        textAlign: 'center',
    },
    ageInput: {
        width: width * 0.23,
        height: width * 0.22,
        borderWidth: 1.5,
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
        borderColor: '#B4B4B8',
        textAlign: 'center',
        fontSize: responsiveFontSize(24),
        padding: 0,
    },
    sexButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: height * 0.01,
    },
    sexButton: {
        width: width * 0.4,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        padding: width * 0.03,
        alignItems: 'center',
        marginHorizontal: width * 0.01,
        marginBottom: height * 0.04,
    },
    selectedSexButton: {
        backgroundColor: '#032825',
    },
    sexButtonText: {
        fontSize: responsiveFontSize(16),
        color: '#000',
        fontWeight: 500,
    },
    selectedSexButtonText: {
        color: 'white',
    },
    button: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginVertical: height * 0.02,
        width: '80%',
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
    disclaimerText: {
        fontSize: responsiveFontSize(12),
        textAlign: 'center',
        color: '#888',
        marginTop: height * 0.02,
        paddingHorizontal: width * 0.05,
    },
});

export default SypmtomChecker1;