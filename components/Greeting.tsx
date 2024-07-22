// Greeting.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const Greeting = () => {
  const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return { message: " Morning", icon: "sun" };
    } else if (currentHour < 18) {
      return { message: " Afternoon", icon: "cloud" };
    } else {
      return { message: " Evening", icon: "moon" };
    }
  };

  const { message, icon } = getCurrentGreeting();

  return (
    <View style={styles.greetingContainer}>
      <Feather name={icon} size={24} color="orange" />
      <Text style={styles.greetingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  greetingText: {
    fontSize: 10,
    marginRight: 10,
  },
});

export default Greeting;
