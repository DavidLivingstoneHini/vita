import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Collapsible from 'react-native-collapsible';

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === "ios" ? 40 : 20;
};

const faqs = [
    {
        question: "How do I reset my password?",
        answer: "You can reset your password by going to the 'Change Password' section in Settings. If you've forgotten your password, use the 'Forgot Password' option on the login screen."
    },
    {
        question: "How can I update my profile information?",
        answer: "Navigate to the 'Edit Profile' section in Settings to update your personal information, including your name, email, and profile picture."
    },
    {
        question: "Why am I not receiving notifications?",
        answer: "Check your notification settings in the 'Notifications' section. Make sure notifications are enabled for the app in your device settings as well."
    },
    {
        question: "How do I contact customer support?",
        answer: "You can reach our support team through the 'Contact Support' section in Settings or by emailing support@example.com."
    },
    {
        question: "Is my personal information secure?",
        answer: "Yes, we take your privacy seriously. All personal data is encrypted and protected according to our Privacy Policy."
    },
];

const FaqScreen = () => {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(20) }]}>
                    FAQs
                </Text>
                <View style={{ width: 24 }} /> {/* Spacer for alignment */}
            </View>

            <View style={styles.content}>
                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqItem}>
                        <TouchableOpacity
                            style={styles.faqQuestion}
                            onPress={() => toggleFAQ(index)}
                        >
                            <Text style={[styles.questionText, { fontSize: responsiveFontSize(16) }]}>
                                {faq.question}
                            </Text>
                            <AntDesign
                                name={activeIndex === index ? "up" : "down"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        <Collapsible collapsed={activeIndex !== index}>
                            <View style={styles.faqAnswer}>
                                <Text style={[styles.answerText, { fontSize: responsiveFontSize(14) }]}>
                                    {faq.answer}
                                </Text>
                            </View>
                        </Collapsible>

                        {index < faqs.length - 1 && <View style={styles.faqSeparator} />}
                    </View>
                ))}

                <Text style={[styles.helpText, { fontSize: responsiveFontSize(14) }]}>
                    Still need help? Contact our support team.
                </Text>

                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => router.push('/contactsupport')}
                >
                    <Text style={[styles.contactButtonText, { fontSize: responsiveFontSize(16) }]}>
                        Contact Support
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.06,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.02,
        marginBottom: height * 0.02,
    },
    title: {
        fontWeight: "700",
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: -1,
    },
    content: {
        paddingHorizontal: width * 0.04,
    },
    faqItem: {
        marginBottom: height * 0.02,
    },
    faqQuestion: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.015,
    },
    questionText: {
        flex: 1,
        fontWeight: "600",
        color: "#333",
        marginRight: width * 0.03,
    },
    faqAnswer: {
        paddingVertical: height * 0.01,
        paddingLeft: width * 0.02,
    },
    answerText: {
        color: "#666",
        lineHeight: responsiveFontSize(20),
    },
    faqSeparator: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: height * 0.01,
    },
    helpText: {
        textAlign: "center",
        color: "#666",
        marginTop: height * 0.03,
        marginBottom: height * 0.02,
    },
    contactButton: {
        backgroundColor: '#f8f8f8',
        padding: height * 0.015,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default FaqScreen;