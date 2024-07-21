// EmployeeListItem.tsx
import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants";

const EmployeeListItem = ({ item, onPress }: any) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View className="flex-row justify-between items-center bg-[#F8F8F8] p-4 rounded-lg mb-4">
      <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full" />
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

export default EmployeeListItem;
