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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { search } from "../utils/searchUtils";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const SearchBox = ({ onClose }) => {
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
            <ActivityIndicator size="small" color="#4A90E2" />
          ) : (
            <Feather
              name="search"
              size={18}
              color={isFocused ? "#4A90E2" : "#9CA3AF"}
            />
          )}
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
            <Feather name="x-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal-like dropdown */}
      {(results.length > 0 || noResults || isSearching) && (
        <View style={styles.resultsOverlay}>
          {isSearching && results.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4A90E2" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {noResults && !isSearching && (
            <View style={styles.noResultsContainer}>
              <Feather name="search" size={24} color="#D1D5DB" />
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
                  <Feather name="chevron-right" size={16} color="#D1D5DB" />
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
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB", // deeper gray
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerFocused: {
    borderColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIconContainer: {
    marginRight: 8,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 24,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "400",
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
  resultsOverlay: {
    position: "absolute",
    top: Platform.OS === "android" ? 54 : 60, // adjust depending on header height
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 9999,
    maxHeight: 320,
  },
  resultsContainer: {
    maxHeight: 280,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastResultItem: {
    borderBottomWidth: 0,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 4,
  },
  resultTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  resultType: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  noResultsText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
  noResultsSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SearchBox;
