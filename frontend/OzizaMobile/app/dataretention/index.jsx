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

const DataRetentionScreen = () => {
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
                    Data Retention Policy
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.lastUpdated, { fontSize: responsiveFontSize(12) }]}>
                    Effective date: June 1, 2023
                </Text>

                <Text style={[styles.introText, { fontSize: responsiveFontSize(14), marginTop: height * 0.02 }]}>
                    This policy describes how long we retain different types of personal data and the criteria we use to determine retention periods.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.03 }]}>
                    1. General Principles
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    We retain personal data only as long as necessary for the purposes collected, to comply with legal obligations, resolve disputes, and enforce agreements.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    2. Account Data
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    User account information is retained while your account is active. After account deletion, we retain certain data for up to 30 days for recovery purposes, then anonymize or delete it.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    3. Usage Data
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    Analytics and usage data is typically retained for 12 months, after which it is either deleted or aggregated for long-term trend analysis.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    4. Transaction Data
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    Financial transaction records are retained for 7 years to comply with tax and accounting regulations.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    5. Communications
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    Customer support communications are retained for 3 years after resolution to improve our services and handle potential follow-ups.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    6. Backups
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14) }]}>
                    System backups containing personal data are retained for up to 30 days before being overwritten.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16), marginTop: height * 0.02 }]}>
                    7. Exceptions
                </Text>
                <Text style={[styles.sectionText, { fontSize: responsiveFontSize(14), marginBottom: height * 0.05 }]}>
                    We may retain data longer when required by law, legal process, or to protect our legal rights. Anonymized data may be retained indefinitely.
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

export default DataRetentionScreen;