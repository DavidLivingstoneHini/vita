import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    ScrollView,
    Modal,
    Animated
} from 'react-native';
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

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
    const [cycleLength, setCycleLength] = useState('28');
    const [periodLength, setPeriodLength] = useState('5');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.9));
    const router = useRouter();

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastPeriodDate;
        setShowDatePicker(false);
        setLastPeriodDate(currentDate);
    };

    const calculateCycleInfo = () => {
        const cycle = parseInt(cycleLength);
        const period = parseInt(periodLength);

        if (!isNaN(cycle) && !isNaN(period)) {
            // Calculate next period
            const nextPeriodDate = new Date(lastPeriodDate);
            nextPeriodDate.setDate(nextPeriodDate.getDate() + cycle);

            // Calculate fertile window (typically 12-16 days before next period)
            const fertileStart = new Date(nextPeriodDate);
            fertileStart.setDate(fertileStart.getDate() - 16);
            const fertileEnd = new Date(nextPeriodDate);
            fertileEnd.setDate(fertileEnd.getDate() - 12);

            // Calculate ovulation day (typically 14 days before next period)
            const ovulationDay = new Date(nextPeriodDate);
            ovulationDay.setDate(ovulationDay.getDate() - 14);

            // Calculate period end date
            const periodEndDate = new Date(lastPeriodDate);
            periodEndDate.setDate(periodEndDate.getDate() + period);

            // Create results object
            const results = {
                nextPeriod: nextPeriodDate.toLocaleDateString(),
                periodEnd: periodEndDate.toLocaleDateString(),
                fertileWindow: `${fertileStart.toLocaleDateString()} to ${fertileEnd.toLocaleDateString()}`,
                ovulation: ovulationDay.toLocaleDateString(),
                daysUntilNextPeriod: Math.round((nextPeriodDate - new Date()) / (1000 * 60 * 60 * 24)),
                cycleLength: cycle,
                periodLength: period
            };

            setResultData(results);
            setModalVisible(true);
        } else {
            alert('Please enter valid numbers for cycle length and period length.');
        }
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    useEffect(() => {
        if (modalVisible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.9);
        }
    }, [modalVisible]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Icon name="arrow-back" size={24} color="#444" />
                </TouchableOpacity>
                <Text style={styles.title}>Period Tracker</Text>
            </View>

            {/* Last Period Date */}
            <Text style={styles.label}>Last Period Date</Text>
            <TouchableOpacity
                style={styles.inputContainer}
                onPress={showDatePickerModal}
            >
                <Text style={styles.dateText}>{lastPeriodDate.toLocaleDateString()}</Text>
                <Icon name="calendar-today" size={24} color="#000000" style={styles.calendarIcon} />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={lastPeriodDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}

            {/* Cycle Length */}
            <Text style={styles.label}>Cycle Length (in days)</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter cycle length"
                    placeholderTextColor="#808080"
                    keyboardType="numeric"
                    value={cycleLength}
                    onChangeText={setCycleLength}
                />
                <View style={styles.presetContainer}>
                    <TouchableOpacity
                        style={[styles.presetButton, cycleLength === '28' && styles.presetButtonActive]}
                        onPress={() => setCycleLength('28')}
                    >
                        <Text style={[styles.presetButtonText, cycleLength === '28' && styles.presetButtonTextActive]}>28</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.presetButton, cycleLength === '30' && styles.presetButtonActive]}
                        onPress={() => setCycleLength('30')}
                    >
                        <Text style={[styles.presetButtonText, cycleLength === '30' && styles.presetButtonTextActive]}>30</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Period Length */}
            <Text style={styles.label}>Period Length (in days)</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter period length"
                    placeholderTextColor="#808080"
                    keyboardType="numeric"
                    value={periodLength}
                    onChangeText={setPeriodLength}
                />
                <View style={styles.presetContainer}>
                    <TouchableOpacity
                        style={[styles.presetButton, periodLength === '4' && styles.presetButtonActive]}
                        onPress={() => setPeriodLength('4')}
                    >
                        <Text style={[styles.presetButtonText, periodLength === '4' && styles.presetButtonTextActive]}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.presetButton, periodLength === '5' && styles.presetButtonActive]}
                        onPress={() => setPeriodLength('5')}
                    >
                        <Text style={[styles.presetButtonText, periodLength === '5' && styles.presetButtonTextActive]}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.presetButton, periodLength === '7' && styles.presetButtonActive]}
                        onPress={() => setPeriodLength('7')}
                    >
                        <Text style={[styles.presetButtonText, periodLength === '7' && styles.presetButtonTextActive]}>7</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculateCycleInfo}>
                <LinearGradient
                    colors={['#333333', '#000000']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Results Modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        <LinearGradient
                            colors={['#333333', '#000000']}
                            style={styles.modalHeader}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.modalHeaderText}>Your Cycle Information</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </LinearGradient>

                        {resultData && (
                            <View style={styles.modalBody}>
                                <View style={styles.resultCard}>
                                    <View style={styles.resultIconContainer}>
                                        <Icon name="calendar-today" size={28} color="#333333" />
                                    </View>
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultLabel}>Next Period</Text>
                                        <Text style={styles.resultValue}>{resultData.nextPeriod}</Text>
                                        <Text style={styles.resultSubtext}>
                                            {resultData.daysUntilNextPeriod} days away
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.resultCard}>
                                    <View style={styles.resultIconContainer}>
                                        <Icon name="favorite" size={28} color="#333333" />
                                    </View>
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultLabel}>Fertile Window</Text>
                                        <Text style={styles.resultValue}>{resultData.fertileWindow}</Text>
                                    </View>
                                </View>

                                <View style={styles.resultCard}>
                                    <View style={styles.resultIconContainer}>
                                        <Icon name="brightness-1" size={28} color="#333333" />
                                    </View>
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultLabel}>Ovulation Day</Text>
                                        <Text style={styles.resultValue}>{resultData.ovulation}</Text>
                                    </View>
                                </View>

                                <View style={styles.resultCard}>
                                    <View style={styles.resultIconContainer}>
                                        <Icon name="date-range" size={28} color="#333333" />
                                    </View>
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultLabel}>Current Period Ends</Text>
                                        <Text style={styles.resultValue}>{resultData.periodEnd}</Text>
                                    </View>
                                </View>

                                <View style={styles.cycleInfo}>
                                    <Text style={styles.cycleInfoText}>
                                        Your cycle is approximately {resultData.cycleLength} days with periods lasting around {resultData.periodLength} days.
                                    </Text>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
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
        color: '#333',
    },
    label: {
        fontSize: responsiveFontSize(16),
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
        color: '#444',
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        padding: width * 0.035,
        marginVertical: height * 0.01,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    dateText: {
        flex: 1,
        fontSize: responsiveFontSize(16),
        color: '#333',
    },
    calendarIcon: {
        marginLeft: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        padding: width * 0.035,
        marginVertical: height * 0.01,
        fontSize: responsiveFontSize(16),
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    presetContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    presetButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    presetButtonActive: {
        backgroundColor: '#000000',
        borderColor: '#333333',
    },
    presetButtonText: {
        color: '#555',
        fontWeight: '600',
    },
    presetButtonTextActive: {
        color: '#fff',
    },
    calculateButton: {
        borderRadius: 12,
        marginVertical: height * 0.03,
        width: '100%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    gradient: {
        paddingVertical: height * 0.02,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.05,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 500,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        padding: width * 0.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalHeaderText: {
        color: 'white',
        fontSize: responsiveFontSize(18),
        fontWeight: '700',
    },
    closeButton: {
        padding: 5,
    },
    modalBody: {
        padding: width * 0.05,
    },
    resultCard: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: width * 0.04,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    resultIconContainer: {
        justifyContent: 'center',
        paddingRight: width * 0.04,
    },
    resultTextContainer: {
        flex: 1,
    },
    resultLabel: {
        color: '#666',
        fontSize: responsiveFontSize(14),
        marginBottom: 4,
    },
    resultValue: {
        color: '#333',
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
    },
    resultSubtext: {
        color: '#000000',
        fontSize: responsiveFontSize(14),
        marginTop: 2,
        fontWeight: '500',
    },
    cycleInfo: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cycleInfoText: {
        color: '#666',
        fontSize: responsiveFontSize(14),
        textAlign: 'center',
        fontStyle: 'italic',
    },
    doneButton: {
        backgroundColor: '#333333',
        borderRadius: 12,
        padding: width * 0.04,
        margin: width * 0.05,
        alignItems: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
    },
});

export default PeriodTracker;