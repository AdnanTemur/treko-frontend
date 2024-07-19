import { icons } from "@/constants";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

const employees = [
  {
    id: "1",
    name: "Clair Jhon",
    position: "Project Manager",
    workTime: "8:00 am - 5:00 pm",
    image:
      "https://cdn.pixabay.com/photo/2023/04/21/15/42/portrait-7942151_640.jpg",
  },
  {
    id: "2",
    name: "Jhon Jhon",
    position: "IT Manager",
    workTime: "8:00 am - 5:00 pm",
    image:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "Steve Step",
    position: "Project Manager",
    workTime: "8:00 am - 5:00 pm",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlROcXWBsxzaZwXERUSfV6eD92_-KLFAvjbg&usqp=CAU",
  },
];

const ChatList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEmployeePress = (employee: any) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleEmployeePress(item)}>
      <View className="flex-row justify-between items-center bg-[#F8F8F8] p-4 rounded-lg mb-4">
        <Image
          source={{ uri: item.image }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-sm text-gray-600">{item.position}</Text>
          <Text className="text-sm text-gray-600">{item.workTime}</Text>
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
          <Image resizeMode="contain" className="w-5 h-5" source={icons.bell} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
                Lorem ipsum dolor sit amet consectetur. Sagittis pellentesque eu
                sem sodales ut. Lorem sed mi duis nibh at fringilla nunc
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
                  router.push("/chat-list");
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
  );
};

export default ChatList;

const styles = StyleSheet.create({});
