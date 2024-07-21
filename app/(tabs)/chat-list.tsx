import { icons } from "@/constants";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import useAsyncStorage from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

const baseURL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/get-all-employees`;

const ChatList = () => {
  // hooks
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [accessToken, loading]: any = useAsyncStorage("@access_token");

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(baseURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch employees");
      console.error(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchEmployees();
    }
  }, [accessToken]);

  const handleEmployeePress = (employee: any) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };
  const handleNavigate = () => {
    console.log(selectedEmployee?._id, "selectedEmployee");

    const serializedEmployees = JSON.stringify(selectedEmployee?._id);
    router.push({
      pathname: `/employee-chat`,
      params: { employeeId: serializedEmployees },
    });
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleEmployeePress(item)}>
      <View className="flex-row justify-between items-center bg-[#F8F8F8] p-4 rounded-lg mb-4">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-sm text-gray-600">
            {item.position || "Employee"}
          </Text>
          <Text className="text-sm text-gray-600">
            {item.workTime || "8:00 am - 5:00 pm"}
          </Text>
        </View>
        <Image
          resizeMode="contain"
          className="w-6 h-6"
          source={icons.rightarrow}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 p-5 bg-white">
        <View className="flex-row justify-between items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/location")}>
            <Image
              resizeMode="contain"
              className="w-5 h-5"
              source={icons.whitepeople}
            />
          </TouchableOpacity>
          <Text className="text-2xl text-primary font-bold">
            List Of Employees
          </Text>
          <TouchableOpacity onPress={() => router.push("/location")}>
            <Image
              resizeMode="contain"
              className="w-5 h-5"
              source={icons.bell}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={employees}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end items-center mb-20 w-full bg-black bg-opacity-50">
            <View className="bg-white rounded-lg p-6 w-full">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="absolute top-2 right-2"
              >
                <Text className="text-5xl">×</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold mb-4 text-center">
                Trace employee
              </Text>
              <ScrollView>
                <Text className="text-sm text-gray-600 mb-4 text-center">
                  Lorem ipsum dolor sit amet consectetur. Sagittis pellentesque
                  eu sem sodales ut. Lorem sed mi duis nibh at fringilla nunc
                  consequat parturient. In aliquam quis aliquam libero in. Vel
                  feugiat tempor eget faucibus lorem laoreet.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    router.push("/location");
                  }}
                  className="bg-primary rounded-lg p-4 mb-4"
                >
                  <Text className="text-white text-center">Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    handleNavigate();
                  }}
                  className="bg-primary rounded-lg p-4"
                >
                  <Text className="text-white text-center">Chats</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ChatList;

// import React, { useEffect, useState } from "react";
// import {
//   Text,
//   View,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   Alert,
// } from "react-native";
// import axios from "axios";
// import useAsyncStorage from "@/hooks/useAuth";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { icons } from "@/constants";
// import { useRouter } from "expo-router";
// import EmployeeListItem from "@/components/molecules/EmployeeListItem";
// import SearchBar from "@/components/SearchBar";
// import { StyleSheet, ActivityIndicator } from "react-native";

// // const baseURL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/get-all-employees`;

// // const ChatList = () => {
// //   const [user]: any = useAsyncStorage("@user");
// //   const [employees, setEmployees] = useState([]);
// //   const [filteredEmployees, setFilteredEmployees] = useState([]);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [accessToken, loading]: any = useAsyncStorage("@access_token");
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const fetchEmployees = async () => {
// //     try {
// //       const response = await axios.get(baseURL, {
// //         headers: {
// //           Authorization: `Bearer ${accessToken}`,
// //         },
// //       });

// //       // Exclude the current user from the employees list
// //       const filtered = response.data.employees.filter(
// //         (employee: any) => employee.email !== user.email
// //       );
// //       setEmployees(filtered);
// //       setFilteredEmployees(filtered);
// //     } catch (error) {
// //       Alert.alert("Error", "Failed to fetch employees");
// //       console.error(error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (accessToken) {
// //       fetchEmployees();
// //     }
// //   }, [accessToken]);

// //   useEffect(() => {
// //     // Apply search
// //     const result = employees.filter((employee: any) =>
// //       employee.name.toLowerCase().includes(searchQuery.toLowerCase())
// //     );
// //     setFilteredEmployees(result);
// //   }, [searchQuery, employees]);

// //   const handleEmployeePress = (employee: any) => {
// //     setSelectedEmployee(employee);
// //     setModalVisible(true);
// //   };

// //   const renderItem = ({ item }: any) => (
// //     <EmployeeListItem item={item} onPress={handleEmployeePress} />
// //   );

// //   return (
// //     <SafeAreaView className="bg-white h-full">
// //       <View className="flex-1 p-5 bg-white">
// //         <View className="flex-row justify-between items-center mb-10">
// //           <TouchableOpacity onPress={() => router.push("/location")}>
// //             <Image
// //               resizeMode="contain"
// //               className="w-5 h-5"
// //               source={icons.whitepeople}
// //             />
// //           </TouchableOpacity>
// //           <Text className="text-2xl text-primary font-bold">
// //             List Of Employees
// //           </Text>
// //           <TouchableOpacity onPress={() => router.push("/location")}>
// //             <Image
// //               resizeMode="contain"
// //               className="w-5 h-5"
// //               source={icons.bell}
// //             />
// //           </TouchableOpacity>
// //         </View>

// //         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

// //         <FlatList
// //           data={filteredEmployees}
// //           renderItem={renderItem}
// //           keyExtractor={(item: any) => item._id}
// //         />

// //         <Modal
// //           visible={modalVisible}
// //           animationType="slide"
// //           transparent={true}
// //           onRequestClose={() => setModalVisible(false)}
// //         >
// //           <View className="flex-1 justify-end items-center mb-20 w-full bg-black bg-opacity-50">
// //             <View className="bg-white rounded-lg p-6 w-full">
// //               <TouchableOpacity
// //                 onPress={() => setModalVisible(false)}
// //                 className="absolute top-2 right-2"
// //               >
// //                 <Text className="text-5xl">×</Text>
// //               </TouchableOpacity>
// //               <Text className="text-lg font-bold mb-4 text-center">
// //                 Trace employee
// //               </Text>
// //               <ScrollView>
// //                 <Text className="text-sm text-gray-600 mb-4 text-center">
// //                   Lorem ipsum dolor sit amet consectetur. Sagittis pellentesque
// //                   eu sem sodales ut. Lorem sed mi duis nibh at fringilla nunc
// //                   consequat parturient. In aliquam quis aliquam libero in. Vel
// //                   feugiat tempor eget faucibus lorem laoreet.
// //                 </Text>
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     Alert.alert("Coming Soon");
// //                   }}
// //                   className="bg-primary rounded-lg p-4 mb-4"
// //                 >
// //                   <Text className="text-white text-center">Location</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     setModalVisible(false);
// //                     handleNavigate();
// //                   }}
// //                   className="bg-primary rounded-lg p-4"
// //                 >
// //                   <Text className="text-white text-center">Chats</Text>
// //                 </TouchableOpacity>
// //               </ScrollView>
// //             </View>
// //           </View>
// //         </Modal>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // export default ChatList;

// const ChatList = () => {
//   // hooks
//   const router = useRouter();

//   // states
//   const [coworkerChats, setCoworkerChats] = useState([]);
//   const [userDetails, setUserDetails] = useState({});
//   const [accessToken, accessTokenLoading] = useAsyncStorage("@access_token");
//   const [user, userLoading] = useAsyncStorage("@user");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!accessTokenLoading && !userLoading && accessToken && user) {
//       fetchData();
//     } else {
//       console.log("Waiting for access token or user data");
//     }
//   }, [accessTokenLoading, userLoading, accessToken, user]);

//   const fetchData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Fetch coworker chats
//       const chatResponse = await axios.get(
//         `${process.env.EXPO_PUBLIC_BACKEND_URL}/coworker-chats/${user._id}/messages`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       setCoworkerChats(chatResponse.data.coworkerChats);

//       // Fetch user details for each coworkerId
//       const userDetailPromises = chatResponse.data.coworkerChats.map(
//         async (chat) => {
//           try {
//             const userResponse = await axios.get(
//               `${process.env.EXPO_PUBLIC_BACKEND_URL}/get-user/${chat.coworkerId._id}`,
//               {
//                 headers: {
//                   Authorization: `Bearer ${accessToken}`,
//                 },
//               }
//             );

//             setUserDetails((prevDetails) => ({
//               ...prevDetails,
//               [chat.coworkerId._id]: userResponse.data,
//             }));
//           } catch (userError) {
//             console.error(
//               `Error fetching user details for ${chat.coworkerId._id}:`,
//               userError
//             );
//           }
//         }
//       );

//       // Wait for all user detail requests to complete
//       await Promise.all(userDetailPromises);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.message || "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (accessTokenLoading || userLoading || isLoading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (error) {
//     return <Text>Error: {error}</Text>;
//   }

//   // navigation
//   const handleNavigate = (chat) => {
//     const serializedEmployees = JSON.stringify([chat.coworkerId]);
//     router.push({
//       pathname: `/employee-chat`,
//       params: { employees: serializedEmployees },
//     });
//   };
//   return (
//     <View style={styles.container}>
//       {coworkerChats.length === 0 ? (
//         <Text>No chats available</Text>
//       ) : (
//         coworkerChats.map((chat) => {
//           return (
//             <View key={chat._id} style={styles.chatContainer}>
//               {userDetails[chat.coworkerId._id] && (
//                 <View style={styles.userInfo}>
//                   <Image
//                     source={{ uri: userDetails[chat.coworkerId._id].avatar }}
//                     style={styles.avatar}
//                   />
//                   <View style={styles.userDetails}>
//                     <Text style={styles.userName}>
//                       {userDetails[chat.coworkerId._id].name}
//                     </Text>
//                     <Text style={styles.userRole}>
//                       {userDetails[chat.coworkerId._id].role}
//                     </Text>
//                     <Text style={styles.workTime}>
//                       Work Time: 8:00 am - 5:00 pm
//                     </Text>
//                   </View>
//                 </View>
//               )}
//               <Text>Sent Messages:</Text>
//               {chat.messageSent.map((message) => (
//                 <View key={message._id} style={styles.messageContainer}>
//                   <Text>{message.text}</Text>
//                   <Text>{new Date(message.timestamp).toLocaleString()}</Text>
//                 </View>
//               ))}
//               <Text>Received Messages:</Text>
//               {chat.messageReceived.map((message) => (
//                 <View key={message._id} style={styles.messageContainer}>
//                   <Text>{message.text}</Text>
//                   <Text>{new Date(message.timestamp).toLocaleString()}</Text>
//                 </View>
//               ))}

//               <TouchableOpacity onPress={() => handleNavigate(chat)}>
//                 <Text style={styles.startChatText}>Start Chat</Text>
//               </TouchableOpacity>
//             </View>
//           );
//         })
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   chatContainer: {
//     marginBottom: 20,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   userDetails: {
//     flexDirection: "column",
//   },
//   userName: {
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   userRole: {
//     color: "#888",
//   },
//   workTime: {
//     color: "#888",
//   },
//   messageContainer: {
//     marginBottom: 10,
//   },
//   startChatText: {
//     fontSize: 20,
//     color: "#0000ff",
//   },
// });

// export default ChatList;
