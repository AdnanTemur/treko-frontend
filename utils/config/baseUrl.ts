// utils/config/baseUrl.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";

const BASEURL = process.env.EXPO_PUBLIC_BASEURL;
const BaseUrl = axios.create({
  baseURL: BASEURL,
});

BaseUrl.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem("@access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseUrl.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await handleLogout();
    }
    return Promise.reject(error);
  }
);

const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("@access_token");
    await AsyncStorage.removeItem("@user");
    router.push("/sign-in");
    Alert.alert("Success", "Logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
    Alert.alert("Error", "An unexpected error occurred while logging out");
  }
};

export default BaseUrl;
