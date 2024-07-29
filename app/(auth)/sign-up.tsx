import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import CustomButton from "@/components/CustomButton";
import ImagePickerExample from "@/components/ImagePicker";
import ToastManager, { Toast } from "toastify-react-native";
import { AntDesign } from "@expo/vector-icons";
import useAsyncStorage from "@/hooks/useAuth";

const baseURL = `${process.env.EXPO_PUBLIC_BASEURL}/api/v1/register`;

const SignUp = () => {
  const [user, loading]: any = useAsyncStorage("@user");

  const [isSubmitting, setSubmitting] = useState(false);
  const [getAvatar, setGetAvatar] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Toast.error("Please fill in all fields", "top");
      return;
    }
    if (!getAvatar) {
      Toast.error("Please add a picture ", "top");
      return;
    }
    if (form.password !== form.confirmPassword) {
      Toast.error("Passwords do not match", "top");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("confirmPassword", form.confirmPassword);

      if (getAvatar) {
        const filename = getAvatar.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: getAvatar,
          name: filename,
          type,
        } as any);
      }

      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Toast.success("User registered successfully", "top");
      } else {
        Toast.error(data?.message || "Registration failed", "top");
      }
    } catch (error: any) {
      Toast.error(error?.message || "An unexpected error occurred", "top");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-white h-full px-6">
      <ToastManager />
      <ScrollView>
        <View className="h-10" />
        <View className="w-full   h-full ">
          <View className="flex-row justify-between items-between mb-10">
            <TouchableOpacity>
              <AntDesign
                onPress={() => router.push("/home")}
                name="arrowleft"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold">Add Employee's</Text>
            <View className="flex items-center">
              <Image
                source={{
                  uri: user?.avatar,
                }}
                className="w-10 h-10 rounded-full"
              />
            </View>
          </View>
          <ImagePickerExample setGetAvatar={setGetAvatar} />
          <FormField
            title=""
            value={form.name}
            handleChangeText={(e: any) => setForm({ ...form, name: e })}
            otherStyles="mt-2"
            keyboardType="default"
            placeholder={"Name"}
            secureTextEntry={undefined}
          />
          <FormField
            title=""
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-2"
            keyboardType="email-address"
            placeholder={"Your Email"}
            secureTextEntry={undefined}
          />
          <FormField
            title=""
            placeholder={"Password"}
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles="mt-2"
            secureTextEntry
          />
          <FormField
            title=""
            placeholder={"Confirm Password"}
            value={form.confirmPassword}
            handleChangeText={(e: any) =>
              setForm({ ...form, confirmPassword: e })
            }
            otherStyles="mt-2"
            secureTextEntry
          />

          {isSubmitting ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-4 w-full"
            />
          ) : (
            <CustomButton
              title="Add Employee"
              handlePress={submit}
              containerStyles="mt-4 w-full"
              isLoading={isSubmitting}
            />
          )}
          <Link
            href="/sign-in"
            className="text-sm text-dark mt-4 font-psemibold"
          >
            {" "}
            <Text>Already have an account?</Text>
          </Link>
          <Link href="/sign-in" className="text-sm text-primary font-psemibold">
            {" "}
            <Text> Login?</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
