import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BaseUrl from "@/utils/config/baseUrl";
import AntDesign from "@expo/vector-icons/AntDesign";
import useAsyncStorage from "@/hooks/useAuth";
import { router } from "expo-router";

const BossTraceChats = () => {
  // hooks
  const [user]: any = useAsyncStorage("@user");

  const [employees, setEmployees] = useState([]);
  const [selectedPair, setSelectedPair] = useState<any>(null);
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
      if (!selectedPair) return;

      setLoading(true);
      setEmptyStateMessage(""); // Clear previous messages

      try {
        const { data, status } = await BaseUrl.get(
          `/api/v1/trace-employees-chats`,
          {
            params: {
              employeeId1: selectedPair[0]._id,
              employeeId2: selectedPair[1]._id,
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
  }, [selectedPair]);

  // Utility function to generate pairs
  const generatePairs = (employees: any[]) => {
    const pairs = [];
    for (let i = 0; i < employees.length - 1; i++) {
      for (let j = i + 1; j < employees.length; j++) {
        pairs.push([employees[i], employees[j]]);
      }
    }
    return pairs;
  };

  const pairs = generatePairs(employees);

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row justify-between items-center mb-10">
        <TouchableOpacity>
          <AntDesign
            onPress={() => setSelectedPair(null)}
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : emptyStateMessage ? (
        <Text style={styles.emptyState}>{emptyStateMessage}</Text>
      ) : (
        <View>
          {!selectedPair && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={pairs}
              keyExtractor={(item, index) => `${item[0]._id}-${item[1]._id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => setSelectedPair(item)}
                >
                  <View style={styles.cardContent}>
                    <Image
                      source={{ uri: item[0].avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.info}>
                      <Text style={styles.name}>{item[0].name}</Text>
                      <Text style={styles.role}>{item[0].role}</Text>
                    </View>
                  </View>
                  <View style={styles.cardContent}>
                    <Image
                      source={{ uri: item[1].avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.info}>
                      <Text style={styles.name}>{item[1].name}</Text>
                      <Text style={styles.role}>{item[1].role}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
      {selectedPair && (
        <FlatList
          data={chatHistory}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.chatItem,
                item.senderId === selectedPair[0]._id
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
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  info: {
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
  },
  role: {
    color: "#777",
    fontSize: 10,
  },
  time: {
    color: "#777",
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
