import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Platform,
    ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === "ios" ? 40 : 20;
};

const ContactSupportScreen = () => {
    const router = useRouter();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        subject: "",
        message: "",
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = { subject: "", message: "" };

        if (!subject.trim()) {
            newErrors.subject = "Subject is required";
            valid = false;
        }

        if (!message.trim()) {
            newErrors.message = "Message is required";
            valid = false;
        } else if (message.trim().length < 10) {
            newErrors.message = "Message should be at least 10 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const accessToken = await SecureStore.getItemAsync("access_token");
            const response = await fetch(`${API_BASE_URL}v1/support/tickets/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    subject,
                    message,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit ticket");
            }

            Toast.show({
                type: 'success',
                text1: 'Message Sent',
                text2: 'Our support team will get back to you soon',
            });
            setSubject("");
            setMessage("");
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to submit ticket',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(18) }]}>
                    Contact Support
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.label, { fontSize: responsiveFontSize(14) }]}>
                    Subject
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        { height: height * 0.06, fontSize: responsiveFontSize(14) },
                        errors.subject && styles.inputError
                    ]}
                    placeholder="What's this about?"
                    value={subject}
                    onChangeText={(text) => {
                        setSubject(text);
                        setErrors({ ...errors, subject: "" });
                    }}
                />
                {errors.subject ? (
                    <Text style={[styles.error, { fontSize: responsiveFontSize(12) }]}>
                        {errors.subject}
                    </Text>
                ) : null}

                <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginTop: height * 0.02 }]}>
                    Message
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            height: height * 0.2,
                            fontSize: responsiveFontSize(14),
                            textAlignVertical: 'top',
                            paddingTop: height * 0.02,
                        },
                        errors.message && styles.inputError
                    ]}
                    placeholder="Describe your issue in detail..."
                    multiline
                    numberOfLines={8}
                    value={message}
                    onChangeText={(text) => {
                        setMessage(text);
                        setErrors({ ...errors, message: "" });
                    }}
                />
                {errors.message ? (
                    <Text style={[styles.error, { fontSize: responsiveFontSize(12) }]}>
                        {errors.message}
                    </Text>
                ) : null}

                <TouchableOpacity
                    style={[styles.button, { marginTop: height * 0.04 }]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={[styles.buttonText, { fontSize: responsiveFontSize(16) }]}>
                            Send Message
                        </Text>
                    )}
                </TouchableOpacity>

                <View style={styles.contactInfo}>
                    <Text style={[styles.contactTitle, { fontSize: responsiveFontSize(14) }]}>
                        Other Ways to Contact Us
                    </Text>
                    <Text style={[styles.contactText, { fontSize: responsiveFontSize(14) }]}>
                        Email: support@example.com
                    </Text>
                    <Text style={[styles.contactText, { fontSize: responsiveFontSize(14) }]}>
                        Phone: +1 (800) 123-4567
                    </Text>
                    <Text style={[styles.contactText, { fontSize: responsiveFontSize(14) }]}>
                        Hours: Mon-Fri, 9AM-5PM EST
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.05,
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
    content: {
        marginTop: height * 0.02,
    },
    label: {
        fontWeight: "500",
        color: "#0A0A0A",
        marginBottom: height * 0.01,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: width * 0.04,
        backgroundColor: "#F5F5F5",
    },
    inputError: {
        borderColor: "#C92035",
        backgroundColor: "#FFF5F6",
    },
    error: {
        color: "#C92035",
        marginTop: 5,
    },
    button: {
        backgroundColor: "#000",
        borderRadius: 5,
        paddingVertical: height * 0.02,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "500",
    },
    contactInfo: {
        marginTop: height * 0.05,
        padding: width * 0.04,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
    },
    contactTitle: {
        fontWeight: "600",
        marginBottom: height * 0.01,
    },
    contactText: {
        color: "#828282",
        marginBottom: height * 0.005,
    },
});

export default ContactSupportScreen;