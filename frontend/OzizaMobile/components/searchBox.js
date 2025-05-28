import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
  PixelRatio,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { search } from "../utils/searchUtils";
import { useRouter } from "expo-router";

// Normalize font size across different screen sizes
const normalizeFont = (size) => {
  const scale = Dimensions.get('window').width / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Get dynamic dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const vw = screenWidth / 100;
const vh = screenHeight / 100;

const SearchBox = ({ onClose, onFocus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setResults([]);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    setNoResults(false);

    try {
      const searchResults = await search(searchQuery);
      setResults(searchResults);
      setNoResults(searchResults.length === 0);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQueryChange = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setResults([]);
      setNoResults(false);
    }
  };

  const handleResultSelect = (result) => {
    if (result.screen && result.params) {
      router.push({
        pathname: `/${result.screen}`,
        params: result.params,
      });
      setResults([]);
      setSearchQuery("");
      setNoResults(false);
      if (onClose) onClose();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setNoResults(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
        ]}
      >
        <View style={styles.searchIconContainer}>
          {isSearching ? (
            <ActivityIndicator size="small" color="#1C3612" />
          ) : (
            <Feather
              name="search"
              size={normalizeFont(18)}
              color={isFocused ? "#1C3612" : "#828282"}
            />
          )}
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor="#828282"
          value={searchQuery}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSearch}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          returnKeyType="search"
          autoCorrect={false}
          spellCheck={false}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x-circle" size={normalizeFont(16)} color="#828282" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal-like dropdown */}
      {(results.length > 0 || noResults || isSearching) && (
        <View style={styles.resultsOverlay}>
          {isSearching && results.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1C3612" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {noResults && !isSearching && (
            <View style={styles.noResultsContainer}>
              <Feather name="search" size={normalizeFont(24)} color="#828282" />
              <Text style={styles.noResultsText}>
                No results found for "{searchQuery}"
              </Text>
              <Text style={styles.noResultsSubtext}>
                Try adjusting your search terms
              </Text>
            </View>
          )}

          {results.length > 0 && !isSearching && (
            <FlatList
              style={styles.resultsContainer}
              data={results}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.resultItem,
                    index === results.length - 1 && styles.lastResultItem,
                  ]}
                  onPress={() => handleResultSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.resultContent}>
                    <Text style={styles.resultTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.resultTypeContainer}>
                      <View
                        style={[styles.typeBadge, getTypeBadgeColor(item.type)]}
                      >
                        <Text style={styles.resultType}>{item.type}</Text>
                      </View>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={normalizeFont(16)} color="#828282" />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
};

const getTypeBadgeColor = (type) => {
  const colors = {
    article: { backgroundColor: "#EBF8FF", color: "#2B6CB0" },
    video: { backgroundColor: "#F0FDF4", color: "#16A34A" },
    workout: { backgroundColor: "#FEF3C7", color: "#D97706" },
    nutrition: { backgroundColor: "#FCE7F3", color: "#BE185D" },
    default: { backgroundColor: "#F3F4F6", color: "#6B7280" },
  };
  return colors[type.toLowerCase()] || colors.default;
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    zIndex: 1000,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: vw * 3,
    paddingVertical: vh * 1.2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#828282",
    width: "95%", // Made the search box longer by setting a specific width
    minHeight: 40,
  },
  containerFocused: {
    borderColor: "#1C3612",
  },
  searchIconContainer: {
    marginRight: vw * 2,
    width: normalizeFont(20),
    height: normalizeFont(20),
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: normalizeFont(24),
    fontSize: normalizeFont(15),
    color: "#000000",
    fontWeight: Platform.OS === 'ios' ? "400" : "normal", // Android often prefers "normal"
    ...Platform.select({
      android: {
        includeFontPadding: false,
        paddingVertical: 0,
      }
    })
  },
  clearButton: {
    marginLeft: vw * 2,
    padding: 2,
  },
  resultsOverlay: {
    position: "absolute",
    top: Platform.OS === "android" ? vh * 6 : vh * 5.5,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#828282",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 9999,
    maxHeight: vh * 40,
    width: "90%", // Match the search box width
  },
  resultsContainer: {
    maxHeight: vh * 35,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: vw * 4,
    paddingVertical: vh * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  lastResultItem: {
    borderBottomWidth: 0,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: normalizeFont(15),
    color: "#000000",
    fontWeight: "800",
    lineHeight: normalizeFont(20),
    marginBottom: vh * 0.5,
  },
  resultTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: vw * 2,
    paddingVertical: vh * 0.5,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  resultType: {
    fontSize: normalizeFont(11),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: vh * 3,
    paddingHorizontal: vw * 4,
  },
  noResultsText: {
    fontSize: normalizeFont(15),
    color: "#000000",
    textAlign: "center",
    marginTop: vh * 1,
    fontWeight: "500",
  },
  noResultsSubtext: {
    fontSize: normalizeFont(13),
    color: "#828282",
    textAlign: "center",
    marginTop: vh * 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vh * 2,
    paddingHorizontal: vw * 4,
  },
  loadingText: {
    marginLeft: vw * 2,
    color: "#000000",
    fontSize: normalizeFont(14),
    fontWeight: "500",
  },
});

export default SearchBox;