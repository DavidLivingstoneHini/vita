import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === "ios" ? 40 : 20;
};

const PrivacyPolicyScreen = () => {
    const router = useRouter();

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(18) }]}>
                    Privacy Policy
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.lastUpdated, { fontSize: responsiveFontSize(12) }]}>
                    Effective date: June 1, 2023
                </Text>

                <Text style={[styles.introText, { fontSize: responsiveFontSize(14), marginTop: height * 0.02 }]}>
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.03 }]}>
                    1. Information We Collect
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    We collect personal information you provide such as name, email, and phone number. We also automatically collect usage data like IP address, device type, and browsing behavior.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    2. How We Use Your Information
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    We use the information to provide and improve our services, communicate with you, personalize your experience, and ensure security and compliance with laws.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    3. Information Sharing
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    We do not sell your personal information. We may share data with trusted service providers who assist our operations, when required by law, or to protect our rights.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    4. Data Security
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    We implement security measures to protect your data. However, no method is 100% secure, so we cannot guarantee absolute security.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    5. Your Rights
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    You may access, correct, or delete your personal information. You can opt-out of marketing communications and request data portability.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    6. Children's Privacy
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    7. Changes to This Policy
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14), marginBottom: height * 0.05 }]}>
                    We may update our Privacy Policy. We will notify you of changes by posting the new policy on this page.
                </Text>
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
    lastUpdated: {
        color: "#828282",
        fontStyle: "italic",
    },
    introText: {
        color: "#333",
        lineHeight: responsiveFontSize(20),
    },
    sectionTitle: {
        fontWeight: "600",
        color: "#0A0A0A",
        marginBottom: height * 0.01,
    },
    sectionText: {
        color: "#333",
        lineHeight: responsiveFontSize(20),
    },
});

export default PrivacyPolicyScreen;