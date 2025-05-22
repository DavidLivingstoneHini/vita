import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
    ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    const newSize = size * scaleFactor;
    return Math.ceil(newSize);
};

const getSafeAreaTop = () => {
    if (Platform.OS === "ios") {
        return 40;
    }
    return 20;
};

const EditProfileScreen = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        gender: "",
        date_of_birth: null,
    });
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation();
    const router = useRouter();

    const API_BASE_URL = "https://www.ozizabackapp.in/api/";

    const retrieveUserData = async () => {
        try {
            const storedUserName = await SecureStore.getItemAsync("full_name");
            const storedPhoneNumber = await SecureStore.getItemAsync("phone_number");
            const storedGender = await SecureStore.getItemAsync("gender");
            const storedDOB = await SecureStore.getItemAsync("date_of_birth");

            setFormData({
                full_name: storedUserName || "",
                phone_number: storedPhoneNumber || "",
                gender: storedGender || "",
                date_of_birth: storedDOB ? new Date(storedDOB) : null,
            });
        } catch (error) {
            console.log("Error retrieving user data:", error);
        }
    };

    useEffect(() => {
        retrieveUserData();
    }, []);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleChange("date_of_birth", selectedDate);
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const accessToken = await SecureStore.getItemAsync("access_token");

            const payload = {
                ...formData,
                date_of_birth: formData.date_of_birth ? formatDate(formData.date_of_birth) : null
            };

            const response = await fetch(`${API_BASE_URL}v1/users/profile/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || JSON.stringify(errorData));
            }

            const data = await response.json();

            if (response.ok) {
                await Promise.all([
                    SecureStore.setItemAsync("full_name", formData.full_name),
                    SecureStore.setItemAsync("phone_number", formData.phone_number || ""),
                    SecureStore.setItemAsync("gender", formData.gender || ""),
                    SecureStore.setItemAsync("date_of_birth", formData.date_of_birth ? formatDate(formData.date_of_birth) : ""),
                ]);

                Toast.show({
                    type: 'success',
                    text1: 'Profile Updated',
                    text2: 'Your profile has been updated successfully',
                });

                navigation.goBack();
            } else {
                throw new Error(data.detail || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update error:", error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.message || 'There was an issue updating your profile',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign
                        name="arrowleft"
                        size={responsiveFontSize(24)}
                        color="#000"
                    />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(18) }]}>
                    Edit Profile
                </Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
                {/* Full Name Field */}
                <View style={styles.formField}>
                    <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
                        Full Name
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            { height: height * 0.06 },
                        ]}
                        value={formData.full_name}
                        onChangeText={(text) => handleChange("full_name", text)}
                        placeholder="Enter your full name"
                        placeholderTextColor="#828282"
                    />
                </View>

                {/* Phone Number Field */}
                <View style={styles.formField}>
                    <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
                        Phone Number
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            { height: height * 0.06 },
                        ]}
                        value={formData.phone_number}
                        onChangeText={(text) => handleChange("phone_number", text)}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#828282"
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Gender Field */}
                <View style={styles.formField}>
                    <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
                        Gender
                    </Text>
                    <View style={styles.radioGroup}>
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                formData.gender === "male" && styles.radioButtonActive,
                            ]}
                            onPress={() => handleChange("gender", "male")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    formData.gender === "male" && styles.radioButtonTextActive,
                                ]}
                            >
                                Male
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                formData.gender === "female" && styles.radioButtonActive,
                            ]}
                            onPress={() => handleChange("gender", "female")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    formData.gender === "female" && styles.radioButtonTextActive,
                                ]}
                            >
                                Female
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Date of Birth Field */}
                <View style={styles.formField}>
                    <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
                        Date of Birth
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.textInput,
                            {
                                height: height * 0.06,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: width * 0.04,
                            }
                        ]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: formData.date_of_birth ? '#000' : '#828282' }}>
                            {formData.date_of_birth ? formatDate(formData.date_of_birth) : "Select your date of birth"}
                        </Text>
                        <AntDesign name="calendar" size={20} color="#828282" />
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={formData.date_of_birth || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        textColor="#000"
                    />
                )}

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.updateButton, { paddingVertical: height * 0.02 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text
                            style={[styles.updateButtonText, { fontSize: responsiveFontSize(16) }]}
                        >
                            Save Changes
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.05,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.02,
    },
    title: {
        fontWeight: "700",
        marginLeft: width * 0.04,
    },
    formContainer: {
        marginTop: height * 0.02,
    },
    formField: {
        marginBottom: height * 0.03,
    },
    fieldTitle: {
        fontWeight: "500",
        color: "#0A0A0A",
        marginBottom: height * 0.01,
    },
    textInput: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: width * 0.04,
        backgroundColor: "#F5F5F5",
    },
    radioGroup: {
        flexDirection: "row",
        marginTop: height * 0.01,
    },
    radioButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.05,
        marginRight: width * 0.03,
        backgroundColor: '#F5F5F5',
    },
    radioButtonActive: {
        backgroundColor: "#000",
        borderColor: "#000",
    },
    radioButtonText: {
        fontSize: responsiveFontSize(14),
        color: "#555",
        fontWeight: '500',
    },
    radioButtonTextActive: {
        color: "#fff",
    },
    updateButton: {
        backgroundColor: "#000",
        borderRadius: 5,
        alignItems: "center",
        marginTop: height * 0.03,
    },
    updateButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
});

export default EditProfileScreen;