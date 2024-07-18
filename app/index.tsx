import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const App = () => {
  return (
    <View style={styles.container}>
      <Text className="flex-1 text-3xl text-primary font-pbold items-center justify-center bg-white">
        RootLayout Here
      </Text>
      <Link href={"/home"} style={{ color: "red" }}>
        Home
      </Link>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
