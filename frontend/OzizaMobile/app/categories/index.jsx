import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { categories } from "../../utils/categories";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");
const scale = (size) => (width / 375) * size;
const getSafeAreaTop = () => (Platform.OS === "ios" ? 40 : 20);

export default function CategoryPage() {
    const router = useRouter();
    const { category } = useLocalSearchParams();

    // Find the selected category
    const selectedCategory = categories.find(cat => cat.title === category);
    const items = selectedCategory?.items || [];

    const handleItemPress = (item) => {
        router.push({
            pathname: "/articles",
            params: {
                articleId: item.articleId,
                title: item.title
            }
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#001706', '#001706']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={scale(24)} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>{category}</Text>
                <View style={{ width: scale(24) }} />
            </LinearGradient>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.subtitle}>{items.length} articles available</Text>

                {items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleItemPress(item)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.itemCard}>
                            <Text style={styles.itemText}>{item.title}</Text>
                            <View style={styles.itemFooter}>
                                <Text style={styles.readTime}>5 min read</Text>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={scale(24)}
                                    color="#2E7D32"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.footerSpace} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafff5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scale(16),
        paddingTop: getSafeAreaTop() + scale(8),
        paddingBottom: scale(12),
    },
    backButton: {
        padding: scale(4),
    },
    title: {
        fontSize: scale(20),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    subtitle: {
        fontSize: scale(14),
        color: "#689F38",
        marginBottom: scale(16),
        marginLeft: scale(4),
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: scale(16),
        paddingBottom: scale(32),
    },
    itemCard: {
        backgroundColor: '#FFFFFF',
        padding: scale(16),
        borderRadius: scale(12),
        marginBottom: scale(16),
        elevation: 2,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(46, 125, 50, 0.1)',
    },
    itemText: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#1B5E20',
        marginBottom: scale(8),
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(46, 125, 50, 0.1)',
        paddingTop: scale(8),
        marginTop: scale(8),
    },
    readTime: {
        fontSize: scale(12),
        color: '#2E7D32',
        fontWeight: '500',
    },
    footerSpace: {
        height: scale(32),
    },
});