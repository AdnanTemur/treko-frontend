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
  ActivityIndicator,
  Modal,
  Button,
} from "react-native";
import useAsyncStorage from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import BaseUrl from "@/utils/config/baseUrl";
import Loader from "@/components/Loader";
import ToastManager, { Toast } from "toastify-react-native";
import { AntDesign } from "@expo/vector-icons";
import { primary } from "@/constants/colors";
const ManageUsers = () => {
  // hooks
  const router = useRouter();
  const [user, isLoading]: any = useAsyncStorage("@user");
  const [employees, setEmployees] = useState([]);
  const [accessToken, loading]: any = useAsyncStorage("@access_token");
  const [searchQuery, setSearchQuery] = useState("");

  // delete employee
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
      pathname: `/profile`,
      params: { employeeId: serializedEmployees },
    });
  };

  const deleteUser = async (employee: any) => {
    try {
      await BaseUrl.delete(`api/v1/delete-user/${employee._id}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== employee._id)
      );
      Toast.success("User is deleted");
    } catch (error) {
      console.error("Failed to delete user:", error);
      Toast.error("Failed to delete user", "Failed");
    }
  };

  if (loading || isLoading) return <Loader isLoading={isLoading || loading} />;

  const filteredEmployees = employees.filter((employee: any) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity>
      <View className="flex-row justify-between items-center bg-[#F8F8F8] p-4 rounded-lg mb-4">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold capitalize">{item.name}</Text>
          <Text className="text-sm text-gray-600 capitalize">
            {item.role || "Employee"}
          </Text>
        </View>
        <AntDesign
          onPress={() => handleEmployeePress(item)}
          name="edit"
          size={24}
          color="black"
        />
        <AntDesign
          onPress={() => {
            setSelectedEmployee(item);
            setModalVisible(true);
          }}
          style={{ marginLeft: 20 }}
          name="delete"
          size={24}
          color="red"
        />
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView className="bg-white h-full">
      <ToastManager />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ opacity: 0.9 }}
          className="flex-1  justify-center items-center bg-[#09648C] "
        >
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-5">Are you sure?</Text>
            <View className="flex-row justify-around">
              <Button
                title="No"
                color={"red"}
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Yes"
                onPress={() => {
                  deleteUser(selectedEmployee);
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View className="flex-1 p-5 bg-white">
        <View className="flex-row justify-between items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/location")}>
            <AntDesign
              onPress={() => router.push("/home")}
              name="arrowleft"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <Text className="text-2xl text-primary font-bold">
            Manage Employees
          </Text>
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
        <TextInput
          placeholder="Search Employees"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        />
        {employees.length === 0 && (
          <ActivityIndicator size="large" color={primary} />
        )}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredEmployees}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
        />
      </View>
    </SafeAreaView>
  );
};

export default ManageUsers;
