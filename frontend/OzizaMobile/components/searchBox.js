import React, { useState } from "react";
import { View, TextInput, Dimensions, TouchableOpacity, Image, FlatList, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { search } from "../utils/searchUtils";
import { useNavigation } from "@react-navigation/native";

const SearchBox = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false); // New state for no results found
  const navigation = useNavigation();

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
      navigation.navigate(result.screen, result.params);
      setResults([]);
      setSearchQuery("");
      setNoResults(false);
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
          keyExtractor={(item) => item.title}
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
  },
};

export default SearchBox;
