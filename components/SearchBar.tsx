// SearchBar.tsx
import React from "react";
import { TextInput, View, StyleSheet } from "react-native";

const SearchBar = ({ searchQuery, setSearchQuery }: any) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search employees..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});

export default SearchBar;
