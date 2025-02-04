import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-simple-toast";

export default function SignUpScreen() {
  const [passwordVisibility, setPasswordVisibility] = React.useState(true);
  const [passwordVisibility2, setPasswordVisibility2] = React.useState(true);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [passwordMatch, setPasswordMatch] = React.useState(true);
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== repeatPassword) {
      setPasswordMatch(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.apiRequest(
        "http://192.168.169.90:8000/api/v1/users/signup/",
        {
          method: "POST",
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            phone_number: phoneNumber,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from server:", response);

      // Save tokens to SecureStore
      await SecureStore.setItemAsync("access_token", response.access);
      await SecureStore.setItemAsync("refresh_token", response.refresh);

      // Calculate and store expiration time
      const expiresIn = response.expires_in;
      const expirationTime = new Date(expiresIn).getTime();
      await SecureStore.setItemAsync(
        "expiration_time",
        expirationTime.toString()
      );

      // Alert.alert(
      //   "Success",
      //   "Sign-up successful! Please log in with your credentials."
      // );
      Toast.show("sign-up successful, please log in with your credentials");
      router.push("/login");
    } catch (error) {
      console.error("Sign-up error:", error?.message || "Unknown error");
      const errorMessage = getErrorMessage(error);
      Toast.show(errorMessage, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract or generate a user-friendly error message
  const getErrorMessage = (error) => {
    if (error.response && error.response.data) {
      // Assuming your API returns error details in the response data
      return error?.message || "Invalid email or password";
    } else {
      return "An unknown error occurred. Please try again.";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
        }}
      >
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 14 }}>
          Sign up
        </Text>
      </View>

      {/* Logo Section */}
      <View
        style={{
          alignItems: "center",
          marginVertical: 20,
          flexDirection: "column",
          top: 4,
        }}
      >
        <Image
          source={require("../../assets/images/oziza.png")}
          style={{ width: 146, height: 58 }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 14,
            marginTop: -8,
            marginLeft: 40,
            color: "#525252",
          }}
        >
          ...health, for all
        </Text>
      </View>

      {/* Input Fields */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20, marginTop: 4 }}>
        <View
          style={{ paddingHorizontal: 10, paddingVertical: 1, marginBottom: 5 }}
        >
          <TextInput
            style={{
              height: 50,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 10,
              marginVertical: 2,
              borderRadius: 5,
            }}
            placeholder="Name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View
          style={{ paddingHorizontal: 10, paddingVertical: 1, marginBottom: 5 }}
        >
          <TextInput
            style={{
              height: 50,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 10,
              marginVertical: 2,
              borderRadius: 5,
            }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View
          style={{ paddingHorizontal: 10, paddingVertical: 1, marginBottom: 5 }}
        >
          <TextInput
            style={{
              height: 50,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 10,
              marginVertical: 2,
              borderRadius: 5,
            }}
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 1,
            marginBottom: 10,
          }}
        >
          <TextInput
            style={{
              height: 50,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 10,
              marginVertical: 2,
              borderRadius: 5,
            }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={passwordVisibility}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 20,
              top: 16,
              color: "gray",
            }}
            onPress={() => setPasswordVisibility(!passwordVisibility)}
          >
            {passwordVisibility ? (
              <MaterialCommunityIcons
                name="eye-off"
                size={24}
                color="#808080"
              />
            ) : (
              <MaterialCommunityIcons name="eye" size={24} color="#808080" />
            )}
          </TouchableOpacity>
        </View>

        {/* Repeat Password Field */}
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 1,
            marginBottom: 10,
          }}
        >
          <TextInput
            style={{
              height: 50,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 10,
              marginVertical: 2,
              borderRadius: 5,
            }}
            placeholder="Repeat Password"
            value={repeatPassword}
            onChangeText={(text) => {
              setRepeatPassword(text);
              setPasswordMatch(text === password);
            }}
            secureTextEntry={passwordVisibility2}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 20,
              top: 16,
              color: "gray",
            }}
            onPress={() => setPasswordVisibility2(!passwordVisibility2)}
          >
            {passwordVisibility2 ? (
              <MaterialCommunityIcons
                name="eye-off"
                size={24}
                color="#808080"
              />
            ) : (
              <MaterialCommunityIcons name="eye" size={24} color="#808080" />
            )}
          </TouchableOpacity>
          {!passwordMatch && repeatPassword.length > 0 && (
            <Text style={{ color: "red", fontSize: 12 }}>
              Passwords do not match.
            </Text>
          )}
        </View>
      </View>

      {/* Sign Up Button */}
      <View style={{ marginHorizontal: 20, marginBottom: 15 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 5,
          }}
          onPress={handleSignUp}
          disabled={loading || !passwordMatch}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
              Sign Up
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Alternative Sign In Options */}
      <View style={{ alignItems: "center", marginBottom: 6 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            marginHorizontal: 40,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#D9D9D9" }} />
          <Text
            style={{ marginHorizontal: 10, fontSize: 16, color: "#6F6F6F" }}
          >
            or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D9D9D9" }} />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 5,
              paddingVertical: 9,
              paddingHorizontal: 20,
              width: "98%",
              borderColor: "#ccc",
              borderWidth: 1,
              marginVertical: 5,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../../assets/images/devicon_google.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 14, marginLeft: 60, color: "#6F6F6F" }}>
              Continue with Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 5,
              paddingVertical: 9,
              paddingHorizontal: 20,
              width: "98%",
              borderColor: "#ccc",
              borderWidth: 1,
              marginVertical: 5,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../../assets/images/logos_facebook.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 14, marginLeft: 60, color: "#6F6F6F" }}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Up Prompt */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <Text>
          Already have an account?{" "}
          <Text style={{ color: "#525252", fontWeight: 700, fontSize: 14 }}>
            <Link href="/login">Sign in</Link>
          </Text>
        </Text>
      </View>
    </View>
  );
}
