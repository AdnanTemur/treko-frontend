import { useState } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export default function ImagePickerExample({ setGetAvatar }: any) {
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setGetAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Button title="Upload" /> */}
      {!image && (
        <>
          <EvilIcons
            onPress={pickImage}
            name="image"
            size={100}
            color="black"
          />
          <Text>Upload Image</Text>
        </>
      )}

      {image && (
        <Image
          className="rounded-full"
          source={{ uri: image }}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
});
