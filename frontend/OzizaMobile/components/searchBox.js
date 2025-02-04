import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

const SearchBox = ({ onClose, onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSubmit(searchQuery);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search anything..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity
        style={styles.searchIconContainer}
        onPress={handleSearch}
      >
        <Feather name="search" size={20} color="#666" />
      </TouchableOpacity>
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
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchIconContainer: {
    paddingHorizontal: 10,
  },
  closeIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
};

export default SearchBox;
