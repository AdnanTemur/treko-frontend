import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import useAsyncStorage from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import { router } from "expo-router";
import EmployeeListItem from "@/components/molecules/EmployeeListItem";
import SearchBar from "@/components/SearchBar";

const baseURL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/get-all-employees`;

const ChatList = () => {
  const [user]: any = useAsyncStorage("@user");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [accessToken, loading]: any = useAsyncStorage("@access_token");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(baseURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Exclude the current user from the employees list
      const filtered = response.data.employees.filter(
        (employee: any) => employee.email !== user.email
      );
      setEmployees(filtered);
      setFilteredEmployees(filtered);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch employees");
      console.error(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchEmployees();
    }
  }, [accessToken]);

  useEffect(() => {
    // Apply search
    const result = employees.filter((employee: any) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(result);
  }, [searchQuery, employees]);

  const handleEmployeePress = (employee: any) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const renderItem = ({ item }: any) => (
    <EmployeeListItem item={item} onPress={handleEmployeePress} />
  );

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 p-5 bg-white">
        <View className="flex-row justify-between items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/location")}>
            <Image
              resizeMode="contain"
              className="w-5 h-5"
              source={icons.whitepeople}
            />
          </TouchableOpacity>
          <Text className="text-2xl text-primary font-bold">
            List Of Employees
          </Text>
          <TouchableOpacity onPress={() => router.push("/location")}>
            <Image
              resizeMode="contain"
              className="w-5 h-5"
              source={icons.bell}
            />
          </TouchableOpacity>
        </View>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <FlatList
          data={filteredEmployees}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end items-center mb-20 w-full bg-black bg-opacity-50">
            <View className="bg-white rounded-lg p-6 w-full">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="absolute top-2 right-2"
              >
                <Text className="text-5xl">×</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold mb-4 text-center">
                Trace employee
              </Text>
              <ScrollView>
                <Text className="text-sm text-gray-600 mb-4 text-center">
                  Lorem ipsum dolor sit amet consectetur. Sagittis pellentesque
                  eu sem sodales ut. Lorem sed mi duis nibh at fringilla nunc
                  consequat parturient. In aliquam quis aliquam libero in. Vel
                  feugiat tempor eget faucibus lorem laoreet.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Coming Soon");
                  }}
                  className="bg-primary rounded-lg p-4 mb-4"
                >
                  <Text className="text-white text-center">Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    router.push("/employee-chat");
                  }}
                  className="bg-primary rounded-lg p-4"
                >
                  <Text className="text-white text-center">Chats</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ChatList;
