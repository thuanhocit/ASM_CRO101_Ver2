import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { signInUser } from "../Screen/api/firebaseAuth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load email & password khi mở app
  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");
      const storedRememberMe = await AsyncStorage.getItem("rememberMe");

      if (storedEmail && storedPassword && storedRememberMe === "true") {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin đăng nhập:", error);
    }
  };

  // Xử lý đăng nhập
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const user = await signInUser(email, password);
      Alert.alert("Thành công", `Đăng nhập thành công: ${user.email}`);

      if (rememberMe) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
        await AsyncStorage.setItem("rememberMe", "true");
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
        await AsyncStorage.setItem("rememberMe", "false");
      }

      navigation.navigate("HomeTabs"); // Chuyển đến màn hình chính
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/icon.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to Lungo !!</Text>
      <Text style={styles.subtitle}>Login to Continue</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={18} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
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

      {/* Ghi nhớ mật khẩu */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={rememberMe}
          onValueChange={setRememberMe}
          color={rememberMe ? "#FF6C22" : undefined}
        />
        <Text style={styles.checkboxText}>Remember Me</Text>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account? Click{" "}
        <Text style={styles.linkText} onPress={() => navigation.navigate("Register")}>Register</Text>
      </Text>
      <Text style={styles.footerText}>
        Forgot Password? Click <Text style={styles.linkText}>Reset</Text>
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

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  checkboxText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
  },

  signInButton: {
    backgroundColor: "#FF6C22",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  signInText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  footerText: { color: "#aaa", fontSize: 14, marginTop: 15 },
  linkText: { color: "#FF6C22", fontWeight: "bold" },
});

export default LoginScreen;
