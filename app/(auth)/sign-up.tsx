import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import FormField from "../../components/FormField";

import { images } from "../../constants";
import CustomButton from "@/components/CustomButton";
// import { getCurrentUser, signIn } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";

const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SignUp = () => {
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

  return (
    <SafeAreaView className="bg-white h-full px-6">
      <ScrollView>
        <View className="w-full flex justify-center items-center h-full ">
          <Image source={images.logo} className="w-[100px] h-[100px]" />

          <Text className="text-2xl font-semibold text-black mt-3 mb-10  font-psemibold">
            Treko Registration
          </Text>
          <FormField
            title=""
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles=""
            keyboardType="name"
            placeholder={"Name"}
          />
          <FormField
            title=""
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles=""
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
          <FormField
            title=""
            placeholder={"Confirm-Password"}
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles={""}
          />
          <CustomButton
            title="Register"
            handlePress={submit}
            containerStyles="mt-10 w-full"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/sign-in"
              className="text-sm text-secondary font-pregular"
            >
              Already Account?
            </Link>
            <Link
              href="/sign-in"
              className="text-sm text-primary font-psemibold"
            >
              Login?
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
