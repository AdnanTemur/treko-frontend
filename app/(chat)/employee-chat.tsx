import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import useAsyncStorage from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { io } from "socket.io-client";
const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL);

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

const EmployeeChat = () => {
  // hooks
  const { employeeId } = useLocalSearchParams();
  const [accessToken, isLoading]: any = useAsyncStorage("@access_token");
  const [user]: any = useAsyncStorage("@user");

  // state
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!employeeId || !accessToken || isLoading) return;

      try {
        const jwtToken = accessToken;

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/coworker-chats/${JSON.parse(
            employeeId
          )}/messages`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        if (data && data.coworkerChats) {
          const chat = data.coworkerChats[0];
          setMessages(chat.messageSent);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [employeeId, accessToken, isLoading]);

  useEffect(() => {
    const handleReceiveMessage = ({ senderId, receiverId, message }) => {
      if (message && message.text) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId, receiverId, ...message },
        ]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom on messages update
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    const senderId = user?._id;
    if (!newMessage.trim()) {
      Alert.alert("Error", "Message cannot be empty");
      return;
    }

    if (!senderId) {
      Alert.alert("Error", "User ID not available");
      return;
    }

    socket.emit("sendMessage", {
      senderId,
      receiverId: JSON.parse(employeeId), // Ensure the employeeId is parsed correctly
      messageText: newMessage.trim(),
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        senderId,
        receiverId: JSON.parse(employeeId), // Ensure the employeeId is parsed correctly
        text: newMessage.trim(),
        timestamp: new Date(),
      },
    ]);

    setNewMessage("");
  };
  if (loading || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>Chat</Text>
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => (
            <View
              key={message._id || `${message.senderId}-${message.timestamp}`}
              style={[
                styles.messageContainer,
                message.senderId === user?._id
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <Text>{message.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(message.timestamp).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EmployeeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerText: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: 10,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: "75%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    padding: 10,
  },
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   Image,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import useAsyncStorage from "@/hooks/useAuth";
// import { router, useLocalSearchParams } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AntDesign from "@expo/vector-icons/AntDesign";

// const EmployeeChat = () => {

//   const parsedEmployees = employees ? JSON.parse(employees) : [];
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   const employee = parsedEmployees.length > 0 ? parsedEmployees[0] : null;

//   if (!employee) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center">
//         <Text>No employee data available.</Text>
//       </SafeAreaView>
//     );
//   }

//   const { _id: employeeId, name: employeeName } = employee;

//   useEffect(() => {
//     // Fetch messages from the API when the component mounts
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(
//           `http://192.168.1.7:8000/api/v1/coworker-chats/${employeeId}/messages`
//         );
//         const data = await response.json();
//         const { coworkerChats } = data;
//         const messages = [];

//         coworkerChats.forEach((chat) => {
//           chat.messageSent.forEach((msg) => {
//             messages.push({
//               senderId: senderId, // Assuming current user is the sender
//               receiverId: chat.coworkerId._id,
//               text: msg.text,
//               timestamp: msg.timestamp,
//             });
//           });

//           chat.messageReceived.forEach((msg) => {
//             messages.push({
//               senderId: chat.coworkerId._id,
//               receiverId: senderId, // Assuming current user is the receiver
//               text: msg.text,
//               timestamp: msg.timestamp,
//             });
//           });
//         });

//         setMessages(messages);
//       } catch (error) {
//         console.error("Failed to fetch messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [employeeId, senderId]);

//   const renderMessage = ({ item }) => {
//     const isSender = item.senderId === senderId;
//     return (
//       <View
//         className={`flex-row my-2 ${
//           isSender ? "justify-start" : "justify-end"
//         }`}
//       >
//         <View
//           className={`p-3 rounded-lg ${
//             isSender ? "bg-blue-200" : "bg-green-200"
//           } max-w-2/3`}
//         >
//           <Text>{item.text}</Text>
//           <Text className="text-xs text-gray-500">
//             {new Date(item.timestamp).toLocaleTimeString()}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="h-full bg-white p-4">
//       <View className="flex-row justify-between items-center mb-10">
//         <TouchableOpacity onPress={() => router.push("/home")}>
//           <AntDesign name="arrowleft" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-2xl font-bold">Chat with {employeeName}</Text>
//         <View className="flex items-center">
//           <Image
//             source={{
//               uri:
//                 user?.avatar ||
//                 "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvi7HpQ-_PMSMOFrj1hwjp6LDcI-jm3Ro0Xw&s",
//             }}
//             className="w-10 h-10 rounded-full"
//           />
//           <Text className="text-[10px]">{user?.name}</Text>
//         </View>
//       </View>
//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={renderMessage}
//         className="flex-1"
//         contentContainerStyle={{ paddingBottom: 10, paddingTop: 30 }}
//       />
//       <View className="flex-row items-center border-t border-gray-300 p-2">
//         <TextInput
//           className="flex-1 border border-gray-300 rounded-l-lg p-3"
//           placeholder="Type a message"
//           value={message}
//           onChangeText={setMessage}
//         />
//         <TouchableOpacity
//           className="bg-blue-500 rounded-r-lg p-3"
//           onPress={sendMessage}
//         >
//           <FontAwesome name="send" size={24} color="white" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default EmployeeChat;
