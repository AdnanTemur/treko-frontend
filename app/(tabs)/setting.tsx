import React from "react";
import {
  Text,
  View,
  Button,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
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
  // hooks
  const [user, loading]: any = useAsyncStorage("@user");
  const dispatch = useDispatch();

  // fns
  const handleLogout = async () => {
    try {
      // Remove access token and user information from AsyncStorage
      await AsyncStorage.removeItem("@access_token");
      await AsyncStorage.removeItem("@user");
      dispatch(setLocationEnabled(false));

      Toast.success("Logged out successfully", "top");

      // Delay the navigation by 1 second
      setTimeout(() => {
        // Navigate to login screen
        router.replace("sign-in");
      }, 1000);
    } catch (error) {
      console.error("Error logging out:", error);
      Toast.error("Error", "top");
    }
  };

  if (loading) <Loader isLoading={loading} />;

  return (
    <SafeAreaView className="bg-white h-full">
      <ToastManager />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="flex-1 p-5 bg-white">
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold mb-4">Settings</Text>
            {user && (
              <>
                {user.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-gray-300 mb-4 justify-center items-center">
                    <Text className="text-2xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text className="text-xl mb-2">Name: {user.name}</Text>
                <Text className="text-sm mb-2">Email: {user.email}</Text>
                <Text className="text-sm mb-2">Role: {user.role}</Text>
              </>
            )}
          </View>
          <View className="mt-auto mb-10">
            <Button title="Logout" onPress={handleLogout} color={primary} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
