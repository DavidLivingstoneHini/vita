import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { search } from "../utils/searchUtils";
import { useRouter } from "expo-router"; // Import useRouter instead of useNavigation

const SearchBox = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const router = useRouter(); // Use router instead of navigation

  const handleQueryChange = (text) => {
    setSearchQuery(text);
    if (text.trim() !== "") {
      const searchResults = search(text);
      if (searchResults.length > 0) {
        setResults(searchResults);
        setNoResults(false);
      } else {
        setResults([]);
        setNoResults(true);
      }
    } else {
      setResults([]);
      setNoResults(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const searchResults = search(searchQuery);
      if (searchResults.length > 0) {
        setResults(searchResults);
        setNoResults(false);
      } else {
        setResults([]);
        setNoResults(true);
      }
    } else {
      setResults([]);
      setNoResults(false);
    }
  };

  const handleResultSelect = (result) => {
    console.log("Selected result:", result);
    if (result.screen && result.params) {
      console.log("Navigating to:", result.screen, "with params:", result.params);

      // Use router.push instead of navigation.navigate for Expo Router
      router.push({
        pathname: `/${result.screen}`,
        params: result.params
      });

      setResults([]);
      setSearchQuery("");
      setNoResults(false);
      if (onClose) onClose(); // Close search when navigating
    } else {
      console.log("Invalid result selected:", result);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={handleSearch}
        >
          <Feather name="search" size={20} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSearch}
        />
      </View>
      {noResults ? (
        <Text style={styles.noResultsText}>
          No results found for your search "{searchQuery}"
        </Text>
      ) : results.length > 0 ? (
        <FlatList
          style={styles.resultsContainer}
          data={results}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleResultSelect(item)}
            >
              <Text style={styles.resultTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.title}-${index}`}
        />
      ) : null}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    width: '90%',
  },
  searchInput: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    width: '100%',
  },
  searchIconContainer: {
    paddingHorizontal: 5,
  },
  closeIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  resultsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: "#fff",
    maxHeight: 300,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultTitle: {
    fontSize: 16,
    color: "#333",
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
};

export default SearchBox;