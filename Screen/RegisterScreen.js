import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { registerUser } from "../Screen/api/firebaseAuth"; // Import hàm đăng ký từ Firebase

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Xử lý đăng ký
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const user = await registerUser(email, password);
      Alert.alert("Thành công", `Đăng ký thành công: ${user.email}`);
      navigation.navigate("Login"); // Điều hướng đến màn hình đăng nhập sau khi đăng ký thành công
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/icon.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to Lungo !!</Text>
      <Text style={styles.subtitle}>Register to Continue</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={18} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={18} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Entypo name={showPassword ? "eye-with-line" : "eye"} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Re-type password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Entypo name={showConfirmPassword ? "eye-with-line" : "eye"} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        You have an account? Click{" "}
        <Text style={styles.linkText} onPress={() => navigation.navigate("Login")}>Sign in</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0F11",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#aaa", fontSize: 14, marginBottom: 20 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#fff", fontSize: 14 },

  registerButton: {
    backgroundColor: "#FF6C22",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  registerText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  footerText: { color: "#aaa", fontSize: 14, marginTop: 15 },
  linkText: { color: "#FF6C22", fontWeight: "bold" },
});

export default RegisterScreen;
