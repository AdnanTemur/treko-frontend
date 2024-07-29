import { icons } from "@/constants";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import useAsyncStorage from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import BaseUrl from "@/utils/config/baseUrl";
import Loader from "@/components/Loader";
import ToastManager, { Toast } from "toastify-react-native";

const ChatList = () => {
  // hooks
  const router = useRouter();
  const [user, isLoading]: any = useAsyncStorage("@user");
  const [employees, setEmployees] = useState([]);
  const [accessToken, loading]: any = useAsyncStorage("@access_token");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await BaseUrl.get("api/v1/get-all-employees");

      // Filter out the current user from the list
      const filteredEmployees = response.data.employees.filter(
        (employee: any) => employee._id !== user?._id
      );

      // Sort employees, placing 'boss' at the top
      const sortedEmployees = filteredEmployees.sort((a: any, b: any) => {
        if (a.role === "boss") return -1;
        if (b.role === "boss") return 1;
        return 0;
      });

      setEmployees(sortedEmployees);
    } catch (error) {
      Toast.error("Failed to fetch employees", "top");
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchEmployees();
    }
  }, [accessToken]);

  const handleEmployeePress = (employee: any) => {
    const serializedEmployees = JSON.stringify(employee?._id);
    router.push({
      pathname: `/employee-chat`,
      params: { employeeId: serializedEmployees },
    });
  };

  const handleNavigate = () => {};

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
          <Text className="text-sm text-gray-600 capitalize">
            {item.role || "Employee"}
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
      <ToastManager />
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
      </View>
    </SafeAreaView>
  );
};

export default ChatList;
