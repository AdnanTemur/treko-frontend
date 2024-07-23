import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import BaseUrl from "@/utils/config/baseUrl";

const TesterApis = () => {
  useEffect(() => {
    handleApiCall();
  }, []);
  const handleApiCall = async () => {
    try {
      const response = await BaseUrl.get("/api/v1/test"); // Using BaseUrl for making API request
      Alert.alert("API Response", JSON.stringify(response.data)); // Displaying API response data
    } catch (error) {
      Alert.alert("Error", error.message); // Handling error if API request fails
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Hit" onPress={handleApiCall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default TesterApis;
