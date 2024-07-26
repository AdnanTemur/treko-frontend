import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  Image,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import useAsyncStorage from "@/hooks/useAuth";
import Entypo from "@expo/vector-icons/Entypo";
import { setLocationEnabled } from "@/toolkit/slice/locationSlice";
import { useDispatch } from "react-redux";
import BaseUrl from "@/utils/config/baseUrl";

const BossMap = () => {
  const [user, loading] = useAsyncStorage("@user");
  const dispatch = useDispatch();
  const mapRef = useRef<any>(null);

  const [location, setLocation] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [employeeLocations, setEmployeeLocations] = useState<any>([]);
  const checkLocationServices = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setModalVisible(true);
        return;
      }

      const providerStatus = await Location.getProviderStatusAsync();
      if (!providerStatus.locationServicesEnabled) {
        setModalVisible(true);
        setLocation(null);
        dispatch(setLocationEnabled(false));
      } else {
        setModalVisible(false);
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        dispatch(setLocationEnabled(true));
        if (user && location) {
          postLocation(location.coords);
          fetchEmployeeLocations();
        }
      }
    } catch (error) {
      setModalVisible(true);
    }
  }, [dispatch, user]);

  useEffect(() => {
    checkLocationServices();
    const locationInterval = setInterval(checkLocationServices, 10000);
    return () => clearInterval(locationInterval);
  }, [checkLocationServices]);

  const fetchEmployeeLocations = async () => {
    try {
      const response = await BaseUrl.get("/api/v1/get-all-locations");
      const formattedLocations = response.data.locations.map((loc: any) => ({
        _id: loc._id,
        userDetail: {
          name: loc.userDetail.name,
          avatar: loc.userDetail.avatar,
          email: loc.userDetail.email,
          _id: loc.userDetail._id,
        },
        coordinates: {
          latitude: loc.coordinates.latitude,
          longitude: loc.coordinates.longitude,
          latitudeDelta: loc.coordinates.latitudeDelta ?? 0.005,
          longitudeDelta: loc.coordinates.longitudeDelta ?? 0.005,
        },
      }));
      setEmployeeLocations(formattedLocations);
      console.log("Retrieving All Employee Location  📌");
    } catch (error) {
      console.log("Error fetching employee locations:", error);
    }
  };
  useEffect(() => {
    fetchEmployeeLocations();
  }, []);

  const recenterMap = useCallback(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: location.latitudeDelta ?? 0.005,
        longitudeDelta: location.longitudeDelta ?? 0.005,
      });
    }
  }, [location]);

  const handleOpenSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const postLocation = async (location: any) => {
    console.log("Boss Location Sending 📍");

    try {
      await BaseUrl.post("/api/v1/create-location", {
        userId: user?._id,
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: location.latitudeDelta ?? 0.005,
        longitudeDelta: location.longitudeDelta ?? 0.005,
      });
    } catch (error) {
      console.log("Error posting location:", error);
    }
  };

  if (!location && !loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Location services are turned off or not available. Please enable
                them to use the map feature.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handleOpenSettings}
              >
                <Text style={styles.buttonText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude ?? 0,
          longitude: location?.longitude ?? 0,
          latitudeDelta: location?.latitudeDelta ?? 0.005,
          longitudeDelta: location?.longitudeDelta ?? 0.005,
        }}
        showsUserLocation={true}
      >
        {employeeLocations.map((empLocation: any) => {
          return (
            <Marker
              key={empLocation._id}
              coordinate={empLocation.coordinates}
              title={empLocation.userDetail.name}
              description={empLocation.userDetail.email}
            >
              <View style={styles.marker}>
                <Image
                  source={{ uri: empLocation.userDetail.avatar }}
                  style={styles.avatar}
                />
              </View>
              <Callout>
                <View>
                  <Text style={styles.name}>{empLocation.userDetail.name}</Text>
                  <Text>{empLocation.userDetail.email}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.buttonContainer}>
        <Entypo
          name="location-pin"
          size={24}
          color="#09648C"
          onPress={recenterMap}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default BossMap;
