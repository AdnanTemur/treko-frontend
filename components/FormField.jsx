import { useState } from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";
import { StyleSheet } from "react-native";
import { icons } from "../constants";

const FormField = ({
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View
        style={styles.border}
        className="w-full mb-3 mt-3 h-16 px-4 bg-black-100 rounded-2xl border-red-100 border-2  focus:border-secondary flex flex-row items-center"
      >
        <TextInput
          className="flex-1 text-black font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9098B1"
          onChangeText={handleChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  border: {
    borderColor: "#C2C1C1",
  },
});
