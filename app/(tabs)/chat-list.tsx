import { icons } from "@/constants";
import { useRouter } from "expo-router";
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
  TextInput,
} from "react-native";
import useAsyncStorage from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import BaseUrl from "@/utils/config/baseUrl";
import Loader from "@/components/Loader";

const ChatList = () => {
  // hooks
  const router = useRouter();
  const [user, isLoading]: any = useAsyncStorage("@user");
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [accessToken, loading]: any = useAsyncStorage("@access_token");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await BaseUrl.get("api/v1/get-all-employees");

      // Filter out the current user from the list
      const filteredEmployees = response.data.employees.filter(
        (employee: any) => employee._id !== user?._id
      );
      setEmployees(filteredEmployees);
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

  const handleEmployeePress = (employee: any) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const handleNavigate = () => {
    const serializedEmployees = JSON.stringify(selectedEmployee?._id);
    router.push({
      pathname: `/employee-chat`,
      params: { employeeId: serializedEmployees },
    });
  };

  if (loading || isLoading) return <Loader isLoading={isLoading || loading} />;

  const filteredEmployees = employees.filter((employee: any) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleEmployeePress(item)}>
      <View className="flex-row justify-between items-center bg-[#F8F8F8] p-4 rounded-lg mb-4">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-sm text-gray-600">
            {item.position || "Employee"}
          </Text>
          <Text className="text-sm text-gray-600">
            {item.workTime || "8:00 am - 5:00 pm"}
          </Text>
        </View>
        <Image
          resizeMode="contain"
          className="w-6 h-6"
          source={icons.rightarrow}
        />
      </View>
    </TouchableOpacity>
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
        <TextInput
          placeholder="Search Employees"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        />
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
                    setModalVisible(false);
                    router.push("/location");
                  }}
                  className="bg-primary rounded-lg p-4 mb-4"
                >
                  <Text className="text-white text-center">Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    handleNavigate();
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
