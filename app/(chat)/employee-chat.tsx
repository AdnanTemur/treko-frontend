import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Using Expo's vector icons for the send button
import socket from "../../services/socketService";
import useAsyncStorage from "@/hooks/useAuth";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

const EmployeeChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    // Event listener for receiving messages
    socket.on("receiveMessage", ({ senderId, receiverId, message }) => {
      if (message && message.text) {
        setMessages((prevMessages: any) => [
          ...prevMessages,
          { senderId, receiverId, ...message },
        ]);
      }
    });

    return () => {
      // Clean up the event listener on component unmount
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") {
      Alert.alert("Error", "Message cannot be empty");
      return;
    }

    const senderId = "669a895ea00c013ff0a63c76"; // Example sender ID
    const receiverId = "669a8a43a00c013ff0a63c7d"; // Example receiver ID
    const messageText = message.trim();

    // Emit the message via socket
    socket.emit("sendMessage", { senderId, receiverId, messageText });

    // Update the local messages state
    setMessages((prevMessages: any) => [
      ...prevMessages,
      { senderId, receiverId, text: messageText, timestamp: new Date() },
    ]);
    setMessage("");
  };

  const renderMessage = ({ item }: any) => {
    const isSender = item.senderId === "669a895ea00c013ff0a63c76"; // Adjust according to the actual sender logic
    return (
      <View
        className={`flex-row my-2 ${
          isSender ? "justify-start" : "justify-end"
        }`}
      >
        <View
          className={`p-3 rounded-lg ${
            isSender ? "bg-blue-200" : "bg-green-200"
          } max-w-2/3`}
        >
          <Text>{item.text}</Text>
          <Text className="text-xs text-gray-500">
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  const [user, loading]: any = useAsyncStorage("@user");
  return (
    <SafeAreaView className="h-full bg-white p-4">
      <View className="flex-row justify-between items-center mb-10">
        <TouchableOpacity>
          <AntDesign
            onPress={() => router.push("/home")}
            name="arrowleft"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Chat</Text>
        <View className="flex items-center">
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvi7HpQ-_PMSMOFrj1hwjp6LDcI-jm3Ro0Xw&s",
            }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="text-[10px]">{user && user?.name}</Text>
        </View>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 10, paddingTop: 30 }} // Ensure there's padding at the bottom
      />
      <View className="flex-row items-center border-t border-gray-300 p-2">
        <TextInput
          className="flex-1 border border-gray-300 rounded-l-lg p-3"
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-r-lg p-3"
          onPress={sendMessage}
        >
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EmployeeChat;
