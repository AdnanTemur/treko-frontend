import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook to retrieve data from AsyncStorage
const useAsyncStorage = (key: any) => {
  const [storedValue, setStoredValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setStoredValue(JSON.parse(value));
        }
      } catch (error) {
        console.log(
          `Error fetching data from AsyncStorage with key ${key}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key]);

  return [storedValue, loading];
};

export default useAsyncStorage;
