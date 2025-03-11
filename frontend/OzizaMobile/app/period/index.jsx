import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const PeriodTracker = () => {
    const [lastPeriodDate, setLastPeriodDate] = useState(new Date());
    const [cycleLength, setCycleLength] = useState('');
    const [periodLength, setPeriodLength] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastPeriodDate;
        setShowDatePicker(false);
        setLastPeriodDate(currentDate);
    };

    const calculate = () => {
        const cycle = parseInt(cycleLength);
        const period = parseInt(periodLength);
        if (!isNaN(cycle) && !isNaN(period)) {
            const nextPeriodDate = new Date(lastPeriodDate);
            nextPeriodDate.setDate(nextPeriodDate.getDate() + cycle);
            alert(`Next expected period date: ${nextPeriodDate.toLocaleDateString()}`);
        } else {
            alert('Please enter valid numbers for cycle length and period length.');
        }
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Period Tracker</Text>
            </View>

            {/* Last Period Date */}
            <Text style={styles.label}>Last Period Date</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.dateText}>{lastPeriodDate.toLocaleDateString()}</Text>
                <TouchableOpacity onPress={showDatePickerModal}>
                    <Icon name="calendar-today" size={24} color="#000" style={styles.calendarIcon} />
                </TouchableOpacity>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={lastPeriodDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            {/* Cycle Length */}
            <Text style={styles.label}>Cycle Length (in days)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter cycle length"
                placeholderTextColor="#808080"
                keyboardType="numeric"
                value={cycleLength}
                onChangeText={setCycleLength}
            />

            {/* Period Length */}
            <Text style={styles.label}>Period Length (in days)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter period length"
                placeholderTextColor="#808080"
                keyboardType="numeric"
                value={periodLength}
                onChangeText={setPeriodLength}
            />

            {/* Calculate Button */}
            <TouchableOpacity style={styles.button} onPress={calculate}>
                <Text style={styles.buttonText}>Calculate</Text>
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
    title: {
        fontSize: responsiveFontSize(20),
        fontWeight: "800",
        marginLeft: 10,
    },
    label: {
        fontSize: responsiveFontSize(16),
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
        borderColor: '#ccc',
        padding: width * 0.03,
        marginVertical: height * 0.01,
        position: 'relative',
    },
    dateText: {
        flex: 1,
        fontSize: responsiveFontSize(16),
        color: '#000',
    },
    calendarIcon: {
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
        borderColor: '#ccc',
        padding: width * 0.03,
        marginVertical: height * 0.01,
        fontSize: responsiveFontSize(16),
    },
    button: {
        backgroundColor: '#061102',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginVertical: height * 0.02,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
});

export default PeriodTracker;