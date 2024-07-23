import { icons } from "@/constants";
import useAsyncStorage from "@/hooks/useAuth";
import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, router } from "expo-router";
import Loader from "@/components/Loader";
import { BOSS, EMPLOYEE } from "@/constants/enums";
import { SafeAreaView } from "react-native-safe-area-context";
import TesterApis from "@/components/tester";

const home = () => {
  const [user, loading]: any = useAsyncStorage("@user");
  if (loading) return <Loader isLoading={loading} />;
  if (!loading && !user) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="flex-1 p-5 bg-white">
          <View className="flex-row justify-between items-center mb-10">
            <TouchableOpacity>
              <AntDesign
                onPress={() => router.push("/home")}
                name="arrowleft"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold">Dashboard</Text>
            <View className="flex items-center">
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvi7HpQ-_PMSMOFrj1hwjp6LDcI-jm3Ro0Xw&s",
                }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="text-[10px]">{user && user?.name}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push("/chat-list")}>
            <View className="flex-row justify-between items-center bg-[#F8F8F8] p-4 rounded-lg mb-5">
              <Text className="text-lg">Chats</Text>
              <Image
                resizeMode="contain"
                className="w-4 h-4"
                source={icons.rightarrow}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/location")}>
            <View className="flex-row justify-between items-center bg-[#F8F8F8] p-4 rounded-lg mb-5">
              <Text className="text-lg">Locations</Text>
              <Image
                resizeMode="contain"
                className="w-4 h-4"
                source={icons.rightarrow}
              />
            </View>
          </TouchableOpacity>
          {user.role === BOSS && (
            <>
              <View className="flex-row flex-wrap justify-between">
                <TouchableOpacity className="w-[45%] border-2 border-[#d2dee4]  p-5 rounded-lg items-center mb-5">
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.person}
                  />
                  <Text className="text-lg mt-5">Users</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-[45%]  border-2 border-[#d2dee4]  p-5 rounded-lg items-center mb-5">
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.add}
                  />
                  <Text className="text-lg mt-5">Add Users</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/setting")}
                  className="w-[45%]  border-2 border-[#d2dee4]  p-5 rounded-lg items-center mb-5"
                >
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.settingBig}
                  />
                  <Text className="text-lg mt-5">Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-[45%]  border-2 border-[#d2dee4]  p-5 rounded-lg items-center mb-5">
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.theme}
                  />
                  <Text className="text-lg mt-5">Theme</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
