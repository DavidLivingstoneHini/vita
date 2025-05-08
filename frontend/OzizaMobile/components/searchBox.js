import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { search } from "../utils/searchUtils";
import { useRouter } from "expo-router";

const SearchBox = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
        params: result.params
      });
      setResults([]);
      setSearchQuery("");
      setNoResults(false);
      if (onClose) onClose();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {isSearching ? (
          <ActivityIndicator size="small" color="#666" style={styles.loadingIndicator} />
        ) : (
          <TouchableOpacity
            style={styles.searchIconContainer}
            onPress={handleSearch}
          >
            <Feather name="search" size={20} color="#666" />
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor="#808080"
          value={searchQuery}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {isSearching && results.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#666" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {noResults && !isSearching && (
        <Text style={styles.noResultsText}>
          No results found for "{searchQuery}"
        </Text>
      )}

      {results.length > 0 && !isSearching && (
        <FlatList
          style={styles.resultsContainer}
          data={results}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleResultSelect(item)}
            >
              <Text style={styles.resultTitle}>{item.title}</Text>
              <Text style={styles.resultType}>{item.type}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => `${item.type}-${item.id}`}
        />
      )}
    </View>
  );
};

const styles = {
  wrapper: {
    width: '100%', // Full width container
    paddingHorizontal: 16, // Add some horizontal padding
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: '100%', // Make the search box full width of its container
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchIconContainer: {
    paddingRight: 10,
  },
  loadingIndicator: {
    paddingRight: 10,
  },
  resultsContainer: {
    width: '100%', // Match search box width
    marginTop: 8,
    backgroundColor: "#fff",
    maxHeight: 300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultTitle: {
    fontSize: 16,
    color: "#333",
  },
  resultType: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  noResultsText: {
    width: '100%', // Match search box width
    padding: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 8,
  },
  loadingContainer: {
    width: '100%', // Match search box width
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 10,
    color: "#666",
  },
};

export default SearchBox;