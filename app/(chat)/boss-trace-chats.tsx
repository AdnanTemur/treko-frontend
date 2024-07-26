import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import BaseUrl from "@/utils/config/baseUrl";
import AntDesign from "@expo/vector-icons/AntDesign";
import useAsyncStorage from "@/hooks/useAuth";
import { router } from "expo-router";

const BossTraceChats = () => {
  // hooks
  const [user]: any = useAsyncStorage("@user");

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee1, setSelectedEmployee1] = useState<any>(null);
  const [selectedEmployee2, setSelectedEmployee2] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [emptyStateMessage, setEmptyStateMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await BaseUrl.get("/api/v1/get-all-employees");
        setEmployees(data.employees);
      } catch (error) {
        console.log("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedEmployee1 || !selectedEmployee2) return;

      setLoading(true);
      setEmptyStateMessage(""); // Clear previous messages

      try {
        const { data, status } = await BaseUrl.get(
          `/api/v1/trace-employees-chats`,
          {
            params: {
              employeeId1: selectedEmployee1,
              employeeId2: selectedEmployee2,
            },
          }
        );

        if (status === 200) {
          const combinedChats = data
            .flatMap((chat: any) => [
              ...(chat.messageSent || []).map((msg: any) => ({
                ...msg,
                senderId: chat.userId,
              })),
              ...(chat.messageReceived || []).map((msg: any) => ({
                ...msg,
                receiverId: chat.userId,
              })),
            ])
            .sort(
              (a: any, b: any) => new Date(a.timestamp) - new Date(b.timestamp)
            );

          setChatHistory(combinedChats);
          if (combinedChats.length === 0) {
            setEmptyStateMessage("No chats found between these employees.");
          }
        } else {
          setEmptyStateMessage("Error fetching chat history.");
        }
      } catch (error: any) {
        console.log(
          "Error fetching chat history:",
          error.response?.data || error.message
        );
        setEmptyStateMessage("Error fetching chat history.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [selectedEmployee1, selectedEmployee2]);

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row justify-between items-center mb-10">
        <TouchableOpacity>
          <AntDesign
            onPress={() => router.push("/home")}
            name="arrowleft"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Employee Chats</Text>
        <View className="flex items-center">
          <Image
            source={{
              uri: user?.avatar,
            }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="text-[14px] capitalize font-bold">
            {user && user?.name}
          </Text>
        </View>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedEmployee1}
          style={styles.picker}
          onValueChange={setSelectedEmployee1}
        >
          <Picker.Item label="Select Employee 1" value={null} />
          {employees.map((employee) => (
            <Picker.Item
              key={employee?._id}
              label={employee?.name}
              value={employee?._id}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedEmployee2}
          style={styles.picker}
          onValueChange={setSelectedEmployee2}
        >
          <Picker.Item label="Select Employee 2" value={null} />
          {employees.map((employee) => (
            <Picker.Item
              key={employee?._id}
              label={employee?.name}
              value={employee?._id}
            />
          ))}
        </Picker>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : emptyStateMessage ? (
        <Text style={styles.emptyState}>No Chats found</Text>
      ) : (
        <FlatList
          data={chatHistory}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.chatItem,
                item.senderId === selectedEmployee1
                  ? styles.sent
                  : styles.received,
              ]}
            >
              <Text>{item.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  chatItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 4,
    maxWidth: "80%",
    borderRadius: 8,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#e1ffc7",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  timestamp: {
    color: "#999",
    fontSize: 12,
    textAlign: "right",
  },
  emptyState: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
    marginTop: 20,
  },
});

export default BossTraceChats;
