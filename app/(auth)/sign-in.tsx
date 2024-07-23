import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, ActivityIndicator, Image } from "react-native";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastManager, { Toast } from "toastify-react-native";

const baseURL = `${process.env.EXPO_PUBLIC_BASEURL}/api/v1/login`;

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<any>({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Toast.error("Please fill in all fields", "top");
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
        Toast.success("Login in successfully", "top");

        // Save tokens to AsyncStorage
        await AsyncStorage.setItem(
          "@access_token",
          JSON.stringify(data.accessToken)
        );
        await AsyncStorage.setItem("@user", JSON.stringify(data.user));

        // Navigate to home screen (replace with your navigation logic)
        setTimeout(() => {
          router.replace("/home");
        }, 1000);
      } else {
        Toast.error(data.message || "Sign in failed", "top");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      Toast.error("An unexpected error occurred", "top");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ToastManager />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <Image
            source={images.logo}
            style={{
              maxWidth: 300,
              width: "100%",
              height: 208,
              alignSelf: "center",
              resizeMode: "contain",
            }}
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
            secureTextEntry={false}
          />
          <FormField
            title=""
            placeholder="Password"
            value={form.password}
            handleChangeText={(password: any) => setForm({ ...form, password })}
            otherStyles={{ marginTop: 20 }}
            secureTextEntry={true}
          />
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
            <Text>Don't have an account?</Text>
          </Link>
          <Link
            href="/sign-up"
            className="text-sm text-primary font-psemibold text-center"
          >
            <Text>Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
