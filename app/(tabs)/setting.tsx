import React from "react";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import useAsyncStorage from "@/hooks/useAuth";
import { primary } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager, { Toast } from "toastify-react-native";
import { setLocationEnabled } from "@/toolkit/slice/locationSlice";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";

const Setting = () => {
  const [user, loading]: any = useAsyncStorage("@user");
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@access_token");
      await AsyncStorage.removeItem("@user");
      dispatch(setLocationEnabled(false));
      Toast.success("Logged out successfully", "top");

      setTimeout(() => {
        router.replace("sign-in");
      }, 1000);
    } catch (error) {
      console.log("Error logging out:", error);
      Toast.error("Error", "top");
    }
  };

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ToastManager />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View className="bg-white rounded-lg shadow-md p-5 h-full">
          <Text className="text-2xl font-bold text-center mb-4">Settings</Text>
          {user && (
            <View className="mb-6">
              <View className="flex-row items-center justify-center mb-6">
                {user.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-36 h-36 rounded-full mb-4 mt-10"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-gray-300 mb-4 justify-center items-center">
                    <Text className="text-3xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View className="border-t border-b border-gray-200 ">
                <View className="flex-row py-2 px-4">
                  <Text className="font-bold w-24 text-xl">Name:</Text>
                  <Text className="text-lg">{user.name}</Text>
                </View>
                <View className="flex-row py-2 px-4 bg-gray-50">
                  <Text className="font-bold w-24 text-xl">Email:</Text>
                  <Text className="text-lg w-[220px]">{user.email}</Text>
                </View>
                <View className="flex-row py-2 px-4">
                  <Text className="font-bold w-24 text-xl">Role:</Text>
                  <Text className="text-lg">{user.role}</Text>
                </View>
              </View>
            </View>
          )}
          <View className="mt-6 items-center">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-primary w-full py-4 mt-20 rounded-full"
            >
              <Text className="text-white text-lg text-center font-bold">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
