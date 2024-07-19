import React from "react";
import { Text, View, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Setting = () => {
  const handleLogout = async () => {
    try {
      // Remove access token and user information from AsyncStorage
      await AsyncStorage.removeItem("@access_token");
      await AsyncStorage.removeItem("@user");

      Alert.alert("Success", "Logged out successfully");

      // Navigate to login screen
      router.replace("sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "An unexpected error occurred while logging out");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Settings Page Coming Soon
      </Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Setting;
