import React, { useEffect } from "react";
import { StyleSheet, View, Button, Alert } from "react-native";
import BaseUrl from "@/utils/config/baseUrl";
import SvgUri from "react-native-svg-uri"; // Import SvgUri from react-native-svg-uri

const TesterApis = () => {
  const fetchData = async () => {
    try {
      const response = await BaseUrl.get("/api/v1/test"); // Using BaseUrl for making API request
      Alert.alert("API Response", JSON.stringify(response.data)); // Displaying API response data
    } catch (error) {
      Alert.alert("Error", error.message); // Handling error if API request fails
    }
  };

  useEffect(() => {
    fetchData(); // Calling the function to make the API request on mount
  }, []); // Empty dependency array to ensure it runs once when the component mounts

  return (
    <View style={styles.container}>
      <Button title="Hit" onPress={fetchData} />{" "}
      {/* Button to make the API request */}
      <SvgUri
        width="200"
        height="200"
        source={require("@/assets/images/example.svg")} // Use the SVG file from your project
      />
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
