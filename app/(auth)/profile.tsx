import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager, { Toast } from "toastify-react-native";
import Loader from "@/components/Loader";
import BaseUrl from "@/utils/config/baseUrl";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImagePickerExample from "@/components/ImagePicker";

const Profile = () => {
  const { employeeId }: any = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openImageUpdate, setOpenImageUpdate] = useState(false);
  const [openInputField, setOpenInputField] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [avatar, setAvatar] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await BaseUrl.get(
          `/api/v1/get-user/${JSON.parse(employeeId)}`
        );
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching employee:", error);
        Toast.error("Failed to fetch employee", "top");
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);

      const formData = new FormData();

      if (avatar) {
        const filename = avatar.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: avatar,
          name: filename,
          type,
        });
      }

      if (inputValue.trim() !== "") {
        formData.append("name", inputValue);
      }
      const response = await BaseUrl.post(
        `/api/v1/update-user/${JSON.parse(employeeId)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Toast.success("Profile updated successfully", "top");
      setUser(response.data.user);
      setOpenImageUpdate(false);
      setOpenInputField(false);
    } catch (error: any) {
      if (error.response) {
        // If the response was received but indicates an error
        Toast.error(
          `Failed to update profile: ${error.response.data.message}`,
          "top"
        );
      } else if (error.request) {
        // If the request was made but no response was received
        Toast.error("Failed to update profile: No response from server", "top");
      } else {
        // If something else happened during the request
        Toast.error(`Failed to update profile: ${error.message}`, "top");
      }
    } finally {
      setUpdateLoading(false);
    }
  };
  if (loading) {
    return <Loader isLoading={loading} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
      <ToastManager />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <AntDesign
              onPress={() => router.back()}
              name="arrowleft"
              size={24}
              color="black"
            />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Profile
            </Text>
            <TouchableOpacity style={{ padding: 10 }}>
              <AntDesign name="setting" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {user && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                {user.avatar ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {openImageUpdate ? (
                      <View
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 60,
                          marginBottom: 10,
                        }}
                      >
                        <ImagePickerExample setGetAvatar={setAvatar} />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: user.avatar }}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 60,
                          marginBottom: 10,
                        }}
                      />
                    )}

                    <AntDesign
                      name="edit"
                      size={24}
                      color="black"
                      onPress={() => setOpenImageUpdate(!openImageUpdate)}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: "#D1D5DB",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 36,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: "#E5E5E5",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: "#E5E5E5",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{ fontWeight: "bold", fontSize: 20, width: "40%" }}
                    >
                      Name:
                    </Text>
                    {openInputField ? (
                      <TextInput
                        placeholder="Enter Name"
                        value={inputValue}
                        onChangeText={(text) => setInputValue(text)}
                      />
                    ) : (
                      <Text style={{ fontSize: 18 }}>{user.name}</Text>
                    )}
                  </View>
                  <AntDesign
                    name="edit"
                    onPress={() => setOpenInputField(!openInputField)}
                    size={24}
                    color="black"
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: "#E5E5E5",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: "white",
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 20, width: "40%" }}
                  >
                    Email:
                  </Text>
                  <Text style={{ fontSize: 15 }}>{user.email}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: "white",
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 20, width: "40%" }}
                  >
                    Role:
                  </Text>
                  <Text style={{ fontSize: 18 }}>{user.role}</Text>
                </View>
              </View>
            </View>
          )}
          {updateLoading ? (
            <View style={{ marginTop: 50, marginBottom: 50 }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={{ marginTop: 50, marginBottom: 50 }}>
              {(openImageUpdate || openInputField) && (
                <Button title="Update Profile" onPress={handleUpdateProfile} />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
