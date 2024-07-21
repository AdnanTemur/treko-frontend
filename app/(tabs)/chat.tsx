import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import socket from "../../services/socketService";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", ({ senderId, receiverId, message }) => {
      if (message && message.text) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") {
      Alert.alert("Error", "Message cannot be empty");
      return;
    }
    const nouman = "669a895ea00c013ff0a63c76";
    const mike = "669a8a43a00c013ff0a63c7d";
    const mark = "669a8a68a00c013ff0a63c80";
    const senderId = nouman;
    const receiverId = mike;
    const messageText = message.trim();

    socket.emit("sendMessage", { senderId, receiverId, messageText });
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: messageText, timestamp: new Date() },
    ]);
    setMessage("");
  };

  const renderMessage = ({ item }) => (
    <View style={styles.message}>
      <Text>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
  },
});

export default ChatComponent;

const chat = {
  me: "nouman",
  id: "mongodbbid",
  CoWorkerChat: [
    // mike
    {
      name: "mike",
      id: "mongodbid",
      messageSent: [
        {
          text: "Hi there nouman",
          timeStamp: "1:00 am",
        },
        {
          text: "Good Morning nouman",
          timeStamp: "1:00 am",
        },
      ],
      messageReceived: [
        {
          text: "im good mike",
          timeStamp: "1:00 am",
        },
        {
          text: "Good Morning too mike",
          timeStamp: "1:00 am",
        },
      ],
    },
    // same for terry and so on with my cooworkers
  ],
  BossChat: [
    {
      name: "boss",
      id: "mongodbid",
      messageSent: [
        {
          text: "Nouman do your work",
          timeStamp: "1:00 am",
        },
        {
          text: "Good Morning nouman",
          timeStamp: "1:00 am",
        },
      ],
      messageReceived: [
        {
          text: "im good boss",
          timeStamp: "1:00 am",
        },
        {
          text: "Thankyou boss",
          timeStamp: "1:00 am",
        },
      ],
    },
  ],
};
