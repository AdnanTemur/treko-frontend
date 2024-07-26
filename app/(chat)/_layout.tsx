import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ChatLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackButtonMenuEnabled: false,
          headerTransparent: true,
        }}
      >
        <Stack.Screen name="employee-chat" options={{ headerShown: false }} />
        <Stack.Screen
          name="boss-trace-chats"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor="#09648C" style="light" />
    </>
  );
};

export default ChatLayout;
