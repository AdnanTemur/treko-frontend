// axiosConfig.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL;

const BaseUrl = async () => {
  const value = await AsyncStorage.getItem("@access_token");

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${value}`,
    },
  });
};

export default BaseUrl;
