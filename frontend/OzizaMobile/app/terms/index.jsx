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

const TermsOfServiceScreen = () => {
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
                    Terms of Service
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.lastUpdated, { fontSize: responsiveFontSize(12) }]}>
                    Last updated: June 1, 2023
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.03 }]}>
                    1. Acceptance of Terms
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part, you may not access the service.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    2. User Responsibilities
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities under your account.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    3. Prohibited Activities
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    You may not use our service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    4. Intellectual Property
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    The Service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    5. Termination
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    6. Changes to Terms
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    We reserve the right to modify these terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    7. Contact Us
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14), marginBottom: height * 0.05 }]}>
                    If you have any questions about these Terms, please contact us at legal@example.com.
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

export default TermsOfServiceScreen;