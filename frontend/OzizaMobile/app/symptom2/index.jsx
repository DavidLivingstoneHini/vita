import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

const SypmtomChecker2 = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { age, sex } = params;

    const [symptomInput, setSymptomInput] = useState('');
    const [symptomsList, setSymptomsList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSymptom, setSelectedSymptom] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const symptomsData = [
        { id: '1', name: 'Fever' },
        { id: '2', name: 'Headache' },
        { id: '3', name: 'Diarrhea' },
        { id: '4', name: 'Cough' },
    ];

    const diarrheaTypes = [
        { id: '1', type: 'Watery' },
        { id: '2', type: 'Bloody' },
        { id: '3', type: 'Mucousy' },
    ];

    const addSymptom = () => {
        if (symptomInput.trim()) {
            setSymptomsList([...symptomsList, { id: Date.now().toString(), name: symptomInput }]);
            setSymptomInput('');
        }
    };

    const handleAddFromList = (symptom) => {
        setSelectedSymptom(symptom);
        setModalVisible(true);
    };

    const toggleTypeSelection = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter((t) => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleModalContinue = () => {
        setSymptomsList([...symptomsList, { id: Date.now().toString(), name: selectedSymptom.name, types: selectedTypes }]);
        setModalVisible(false);
        setSelectedTypes([]);
    };

    const handleFinish = () => {
        router.push({
            pathname: "/symptom3",
            params: { symptomsList: JSON.stringify(symptomsList) },
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

            {/* Input and Button in a Row */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a symptom"
                    placeholderTextColor="#808080"
                    value={symptomInput}
                    onChangeText={setSymptomInput}
                />
                <TouchableOpacity style={styles.addButton} onPress={addSymptom}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.infoText}>
                For better results, type your primary symptoms first, then add additional symptoms.
            </Text>

            <Text style={styles.subTitle}>Or select from the list below:</Text>

            <View style={styles.symptomsList}>
                {symptomsData.map((item) => (
                    <View style={styles.symptomItem} key={item.id}>
                        <Text style={styles.symptomText}>{item.name}</Text>
                        <TouchableOpacity onPress={() => handleAddFromList(item)}>
                            <Text style={styles.addButton}>Add</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>What kind of {selectedSymptom?.name}?</Text>

                    <View>
                        {diarrheaTypes.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.modalItem}
                                onPress={() => toggleTypeSelection(item.type)}
                            >
                                <Text style={styles.modalItemText}>{item.type}</Text>
                                <Icon
                                    name={selectedTypes.includes(item.type) ? "check-box" : "check-box-outline-blank"}
                                    size={responsiveFontSize(24)}
                                    color="#000"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.modalButton} onPress={handleModalContinue}>
                        <Text style={styles.modalButtonText}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.02,
        marginBottom: height * 0.05,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: width * 0.03,
        fontSize: responsiveFontSize(16),
        flex: 1,
    },
    addButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        color: 'white',
        fontSize: responsiveFontSize(14),
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.03,
        marginLeft: width * 0.02,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(14),
    },
    infoText: {
        fontSize: responsiveFontSize(14),
        backgroundColor: '#D9D9D9',
        paddingVertical: height * 0.03,
        paddingHorizontal: width * 0.03, 
        color: '#000000',
        marginBottom: height * 0.05,
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
    addText: {
        color: '#032825',
        fontSize: responsiveFontSize(16),
    },
    modalContainer: {
        flex: 1,
        paddingTop: getSafeAreaTop(),
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.02,
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: '600',
        marginBottom: height * 0.02,
        textAlign: 'center',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalItemText: {
        fontSize: responsiveFontSize(16),
    },
    modalButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginTop: height * 0.02,
        marginHorizontal: width * 0.04,
    },
    modalButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
    skipText: {
        color: '#032825',
        textAlign: 'center',
        marginTop: height * 0.02,
        fontSize: responsiveFontSize(14),
    },
    finishButton: {
        backgroundColor: '#032825',
        borderRadius: 8,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginTop: height * 0.06,
    },
    finishButtonText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
});

export default SypmtomChecker2;
