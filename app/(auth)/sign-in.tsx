import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  Button,
  TextInput,
} from "react-native";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { getCurrentUser, signIn } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";

const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SignIn = () => {
  // const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    // if (form.email === "" || form.password === "") {
    //   Alert.alert("Error", "Please fill in all fields");
    // }
    // setSubmitting(true);
    // try {
    //   await signIn(form.email, form.password);
    //   const result = await getCurrentUser();
    //   setUser(result);
    //   setIsLogged(true);
    //   Alert.alert("Success", "User signed in successfully");
    //   router.replace("/home");
    // } catch (error) {
    //   Alert.alert("Error", error.message);
    // } finally {
    //   setSubmitting(false);
    // }
  };

  // start
  const [inputValue, setInputValue] = useState("");
  const [storedValue, setStoredValue] = useState("");

  const storeData = async () => {
    try {
      await AsyncStorage.setItem("@my_key", inputValue);
      console.log("Data stored successfully");
    } catch (e) {
      console.error("Failed to save the data to the storage", e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@my_key");
      if (value !== null) {
        setStoredValue(value);
        console.log("Data retrieved successfully");
      }
    } catch (e) {
      console.error("Failed to fetch the data from storage", e);
    }
  };
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem("@my_key");
      console.log("Data removed successfully");
    } catch (e) {
      console.error("Failed to remove the data from storage", e);
    }
  };
  // start
  return (
    <SafeAreaView className="bg-white px-6">
      <ScrollView>
        {/* start */}
        <View>
          <TextInput
            placeholder="Type something"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <Button title="Store Data" onPress={storeData} />
          <Button title="Get Data" onPress={getData} />
          <Button title="Get remove" onPress={removeData} />

          <Text>Stored Value: {storedValue}</Text>
        </View>
        {/* start */}
        <View className="w-full flex justify-center items-center ">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[200px] h-[200px]"
          />

          <Text className="text-2xl font-semibold text-black mt-4 font-psemibold">
            Log in to continue
          </Text>

          <FormField
            title=""
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder={"Your Email"}
          />

          <FormField
            title=""
            placeholder={"Password"}
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles={""}
          />

          <CustomButton
            title="Log In"
            handlePress={submit}
            containerStyles="mt-10 w-full"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/sign-up"
              className="text-sm text-secondary font-pregular"
            >
              Don't have an account?
            </Link>
            <Link
              href="/sign-up"
              className="text-sm text-primary font-psemibold"
            >
              Forget Password?
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
