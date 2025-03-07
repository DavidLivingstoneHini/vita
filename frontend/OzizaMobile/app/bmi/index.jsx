import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Image, Dimensions, Platform, ScrollView } from 'react-native';
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
    const [weight, setWeight] = useState('');
    const router = useRouter();

    const calculateBMI = () => {
        // BMI calculation logic goes here
    };

    const resetFields = () => {
        setHeightFt('');
        setHeightIn('');
        setWeight('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Image
                        source={require("../../assets/images/back-arrow.png")}
                        style={styles.backArrow}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>BMI Calculator</Text>
            </View>

            <View style={styles.genderContainer}>
                <TouchableOpacity style={styles.genderBox}>
                    <Image source={require('../../assets/images/ion_male.png')} style={styles.genderSymbol} />
                    <Text style={{ fontWeight: 700 }}>MALE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.genderBox}>
                    <Image source={require('../../assets/images/ion_female.png')} style={styles.genderSymbol} />
                    <Text style={{ fontWeight: 700 }}>FEMALE</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.unitSwitchContainer}>
                <Text>Imperial</Text>
                <Switch value={isImperial} onValueChange={setIsImperial} trackColor={{ false: '#767577', true: '#767577' }}
                    thumbColor={isImperial ? 'white' : 'white'}
                    ios_backgroundColor="#3e3e3e" />
                <Text>Metric</Text>
            </View>

            <Text style={styles.label}>Height</Text>
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

            <Text style={styles.label}>Weight</Text>
            <View style={styles.weightInputContainer}>
                <TextInput
                    style={[styles.input]}
                    placeholder="lbs"
                    placeholderTextColor="#808080"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={calculateBMI}>
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={resetFields}>
                <Text style={styles.buttonText}>Reset</Text>
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
        paddingHorizontal: width * 0.02, // Reduced padding
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
        padding: width * 0.09, // Reduced padding
        borderRadius: 5,
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
        width: '100%', // Ensure it takes full width of the container
    },
    weightInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: height * 0.02,
        width: '100%', // Ensure it takes full width of the container
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
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
});

export default BMICalculator;
