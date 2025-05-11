import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Image, Dimensions, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from "expo-router";

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Responsive Font Size Function
const responsiveFontSize = (size) => {
    const scaleFactor = width / 375; // Base width of 375 (iPhone SE)
    const newSize = size * scaleFactor;
    return Math.ceil(newSize); // Round to nearest whole number
};

// Function to get safe area top padding
const getSafeAreaTop = () => {
    if (Platform.OS === 'ios') {
        return 40; // Adjust for iOS
    }
    return 20; // Default for Android
};

const BMICalculator = ({ navigation }) => {
    const [isImperial, setIsImperial] = useState(true);
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [weightLbs, setWeightLbs] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [selectedGender, setSelectedGender] = useState(null);
    const [bmiResult, setBmiResult] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const router = useRouter();

    const calculateBMI = () => {
        // Validate inputs
        if (!selectedGender) {
            Alert.alert('Error', 'Please select your gender');
            return;
        }

        let height, weight, bmi;

        if (isImperial) {
            // Imperial calculation
            if (!heightFt || !weightLbs) {
                Alert.alert('Error', 'Please enter both height and weight');
                return;
            }

            const totalInches = (parseFloat(heightFt) * 12) + parseFloat(heightIn || 0);
            height = totalInches * 0.0254; // Convert inches to meters
            weight = parseFloat(weightLbs) * 0.453592; // Convert lbs to kg
        } else {
            // Metric calculation
            if (!heightCm || !weightKg) {
                Alert.alert('Error', 'Please enter both height and weight');
                return;
            }

            height = parseFloat(heightCm) / 100; // Convert cm to meters
            weight = parseFloat(weightKg);
        }

        // Calculate BMI
        bmi = weight / (height * height);
        setBmiResult(bmi.toFixed(1));

        // Determine BMI category
        if (bmi < 18.5) {
            setBmiCategory('Underweight');
        } else if (bmi >= 18.5 && bmi < 25) {
            setBmiCategory('Normal weight');
        } else if (bmi >= 25 && bmi < 30) {
            setBmiCategory('Overweight');
        } else {
            setBmiCategory('Obese');
        }
    };

    const resetFields = () => {
        setHeightFt('');
        setHeightIn('');
        setHeightCm('');
        setWeightLbs('');
        setWeightKg('');
        setSelectedGender(null);
        setBmiResult(null);
        setBmiCategory('');
    };

    const toggleGender = (gender) => {
        setSelectedGender(gender);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Image
                        source={require("../../assets/images/back-arrow.png")}
                        style={styles.backArrow}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>BMI Calculator</Text>
            </View>

            <View style={styles.genderContainer}>
                <TouchableOpacity
                    style={[
                        styles.genderBox,
                        selectedGender === 'male' && styles.selectedGender
                    ]}
                    onPress={() => toggleGender('male')}
                >
                    <Image
                        source={require('../../assets/images/ion_male.png')}
                        style={styles.genderSymbol}
                    />
                    <Text style={{ fontWeight: 700 }}>MALE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.genderBox,
                        selectedGender === 'female' && styles.selectedGender
                    ]}
                    onPress={() => toggleGender('female')}
                >
                    <Image
                        source={require('../../assets/images/ion_female.png')}
                        style={styles.genderSymbol}
                    />
                    <Text style={{ fontWeight: 700 }}>FEMALE</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.unitSwitchContainer}>
                <Text>Imperial</Text>
                <Switch
                    value={isImperial}
                    onValueChange={() => {
                        setIsImperial(!isImperial);
                        resetFields();
                    }}
                    trackColor={{ false: '#767577', true: '#767577' }}
                    thumbColor={isImperial ? 'white' : 'white'}
                    ios_backgroundColor="#3e3e3e"
                />
                <Text>Metric</Text>
            </View>

            <Text style={styles.label}>Height</Text>
            {isImperial ? (
                <View style={styles.heightContainer}>
                    <TextInput
                        style={[styles.input, styles.heightInput]}
                        placeholder="ft"
                        placeholderTextColor="#808080"
                        keyboardType="numeric"
                        value={heightFt}
                        onChangeText={setHeightFt}
                    />
                    <TextInput
                        style={[styles.input, styles.heightInput]}
                        placeholder="in"
                        placeholderTextColor="#808080"
                        keyboardType="numeric"
                        value={heightIn}
                        onChangeText={setHeightIn}
                    />
                </View>
            ) : (
                <View style={styles.heightContainer}>
                    <TextInput
                        style={[styles.input]}
                        placeholder="cm"
                        placeholderTextColor="#808080"
                        keyboardType="numeric"
                        value={heightCm}
                        onChangeText={setHeightCm}
                    />
                </View>
            )}

            <Text style={styles.label}>Weight</Text>
            <View style={styles.weightInputContainer}>
                <TextInput
                    style={[styles.input]}
                    placeholder={isImperial ? "lbs" : "kg"}
                    placeholderTextColor="#808080"
                    keyboardType="numeric"
                    value={isImperial ? weightLbs : weightKg}
                    onChangeText={isImperial ? setWeightLbs : setWeightKg}
                />
            </View>

            {bmiResult && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Your BMI: {bmiResult}</Text>
                    <Text style={styles.categoryText}>Category: {bmiCategory}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={calculateBMI}>
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetFields}>
                <Text style={[styles.buttonText, styles.resetButtonText]}>Reset</Text>
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
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.02,
    },
    backArrow: {
        width: width * 0.05,
        height: width * 0.05,
        marginRight: width * 0.02,
    },
    title: {
        fontSize: responsiveFontSize(20),
        fontWeight: "800",
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: height * 0.02,
    },
    genderBox: {
        alignItems: 'center',
        backgroundColor: '#E8EAF3',
        borderWidth: 1,
        borderColor: 'black',
        padding: width * 0.09,
        borderRadius: 5,
    },
    selectedGender: {
        backgroundColor: '#D0D8FF',
        borderColor: '#3A5AFF',
    },
    genderSymbol: {
        width: width * 0.2,
        height: width * 0.2,
        resizeMode: 'contain',
    },
    unitSwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: height * 0.02,
    },
    label: {
        fontSize: responsiveFontSize(16),
        marginBottom: height * 0.01,
    },
    heightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: height * 0.02,
        width: '100%',
    },
    heightInput: {
        flex: 0.48,
    },
    weightInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: height * 0.02,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
        borderColor: '#ccc',
        padding: width * 0.03,
        flex: 1,
        marginHorizontal: width * 0.01,
        textAlign: 'right',
        fontSize: responsiveFontSize(16),
    },
    button: {
        backgroundColor: '#061102',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginVertical: height * 0.01,
        width: '100%',
    },
    resetButton: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderColor: '#061102',
    },
    resetButtonText: {
        color: '#061102',
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
    resultContainer: {
        marginVertical: height * 0.02,
        padding: width * 0.04,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    resultText: {
        fontSize: responsiveFontSize(18),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.01,
    },
    categoryText: {
        fontSize: responsiveFontSize(16),
        textAlign: 'center',
        color: '#555',
    },
});

export default BMICalculator;