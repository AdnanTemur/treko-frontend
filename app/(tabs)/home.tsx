import { icons } from "@/constants";
import useAsyncStorage from "@/hooks/useAuth";
import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, router } from "expo-router";
import Loader from "@/components/Loader";
import { BOSS, EMPLOYEE } from "@/constants/enums";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/toolkit/store";
import Greeting from "@/components/Greeting";

const home = () => {
  // hooks
  const [user, loading]: any = useAsyncStorage("@user");
  const { locationEnabled } = useSelector((state: RootState) => state.location);

  //state
  if (loading) return <Loader isLoading={loading} />;
  if (!loading && !user) return <Redirect href="/sign-in" />;
  if (!loading && user && !locationEnabled && user.role === EMPLOYEE)
    return <Redirect href="/location" />;

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
                  uri: user?.avatar,
                }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="text-[14px] capitalize font-bold">
                {user && user?.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            className="mt-4 mb-4"
          >
            <Text className="text-xl font-bold mb-3 mt-2 p-1 capitalize">
              Hello {user.name} !
            </Text>
            <Greeting />
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

          {user.role === EMPLOYEE && (
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
          )}

          {user.role === BOSS && (
            <>
              <View className="flex-row flex-wrap justify-between">
                <TouchableOpacity
                  onPress={() => router.push("/manage-user")}
                  className="w-[45%] border-2  bg-[#F24369] border-[#d2dee4] p-5 rounded-lg items-center mb-5"
                >
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.person}
                  />
                  <Text className="text-[14px] mt-5 text-white">
                    Manage Employee
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/sign-up")}
                  className="w-[45%] bg-[#4DE4E1]  border-2 border-[#d2dee4]  p-5 rounded-lg items-center mb-5"
                >
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.add}
                  />
                  <Text className="text-[14px] text-white mt-5">
                    Add Employee
                  </Text>
                </TouchableOpacity>
                {/* trace chats */}
                <TouchableOpacity
                  onPress={() => router.push("/boss-trace-chats")}
                  className="w-[45%] bg-[#09648C]  border-2 border-[#d2dee4]  p-5 rounded-lg items-center mb-5"
                >
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.chat}
                  />
                  <Text className="text-[14px] text-white mt-5">
                    Chat History
                  </Text>
                </TouchableOpacity>
                {/* trace location */}
                <TouchableOpacity
                  onPress={() => router.push("/location")}
                  className="w-[45%] bg-[#F48A3C]  border-2 border-[#d2dee4]  p-5 rounded-lg items-center mb-5"
                >
                  <Image
                    resizeMode="contain"
                    className="w-10 h-10"
                    source={icons.location}
                  />
                  <Text className="text-[14px] text-white mt-5">
                    Trace Location
                  </Text>
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
