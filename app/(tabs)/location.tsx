import { StyleSheet } from "react-native";
import React from "react";
import EmployeeMaps from "@/components/map/employee-map";
import { BOSS, EMPLOYEE } from "@/constants/enums";
import useAsyncStorage from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import { Redirect } from "expo-router";
import BossMap from "@/components/map/boss-map";

const Location = () => {
  // Hooks
  const [user, loading]: any = useAsyncStorage("@user");

  if (loading) return <Loader isLoading={loading} />;
  if (!loading && !user) return <Redirect href="/sign-in" />;

  return (
    <>
      {user.role === BOSS && <BossMap />}
      {user.role === EMPLOYEE && <EmployeeMaps />}
    </>
  );
};

export default Location;

const styles = StyleSheet.create({});
