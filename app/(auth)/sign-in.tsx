import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/login`;

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "User signed in successfully");
        // // Save tokens to AsyncStorage
        await AsyncStorage.setItem(
          "@access_token",
          JSON.stringify(data.accessToken)
        );

        await AsyncStorage.setItem("@user", JSON.stringify(data.user));

        // Navigate to home screen (replace with your navigation logic)
        router.replace("/home");
      } else {
        Alert.alert("Error", data.message || "Sign in failed");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <Image
            source={images.logo}
            style={{ width: 200, height: 200, alignSelf: "center" }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 20,
              marginBottom: 100,
            }}
          >
            Log in to continue
          </Text>
          <FormField
            title=""
            placeholder="Your Email"
            value={form.email}
            handleChangeText={(email: any) => setForm({ ...form, email })}
            otherStyles={{ marginTop: 20 }}
            keyboardType="email-address"
            secureTextEntry={undefined}
          />
          <View className="h-3" />
          <FormField
            title=""
            placeholder="Password"
            value={form.password}
            handleChangeText={(password: any) => setForm({ ...form, password })}
            otherStyles={{ marginTop: 20 }}
            secureTextEntry={true}
          />
          <View className="h-7" />

          {isSubmitting ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{ marginTop: 20 }}
            />
          ) : (
            <CustomButton
              title="Log In"
              handlePress={submit}
              containerStyles={{ marginTop: 20 }}
            />
          )}
          <Link
            href="/sign-up"
            className="text-sm text-dark mt-4 font-psemibold text-center"
          >
            {" "}
            <Text> Don't have an account?</Text>
          </Link>
          <Link
            href="/sign-up"
            className="text-sm text-primary font-psemibold text-center"
          >
            {" "}
            <Text> Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
