import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

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
        "http:13.60.86.56:8000/api/v1/users/signup/",
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

      await SecureStore.setItemAsync("access_token", response.access);
      await SecureStore.setItemAsync("refresh_token", response.refresh);

      const expiresIn = response.expires_in;
      const expirationTime = new Date(expiresIn).getTime();
      await SecureStore.setItemAsync(
        "expiration_time",
        expirationTime.toString()
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Sign-up successful! Please log in with your credentials.',
        position: 'bottom',
        visibilityTime: 4000,
      });
      
      router.push("/login");
    } catch (error) {
      console.error("Sign-up error:", error?.message || "Unknown error");
      const errorMessage = getErrorMessage(error);
      Toast.show({
        type: 'error',
        text1: 'Sign-up Error',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    if (error.response && error.response.data) {
      return error?.message || "Invalid email or password";
    } else {
      return "An unknown error occurred. Please try again.";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign up</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/oziza.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>...health, for all</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={passwordVisibility}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisibility(!passwordVisibility)}
              >
                <MaterialCommunityIcons
                  name={passwordVisibility ? "eye-off" : "eye"}
                  size={24}
                  color="#808080"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Repeat Password"
                value={repeatPassword}
                onChangeText={(text) => {
                  setRepeatPassword(text);
                  setPasswordMatch(text === password);
                }}
                secureTextEntry={passwordVisibility2}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisibility2(!passwordVisibility2)}
              >
                <MaterialCommunityIcons
                  name={passwordVisibility2 ? "eye-off" : "eye"}
                  size={24}
                  color="#808080"
                />
              </TouchableOpacity>
              {!passwordMatch && repeatPassword.length > 0 && (
                <Text style={styles.errorText}>Passwords do not match.</Text>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={loading || !passwordMatch}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.alternativeSignIn}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../assets/images/devicon_google.png")}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../assets/images/logos_facebook.png")}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signInPrompt}>
            <Text>
              Already have an account?{" "}
              <Text style={styles.signInLink}>
                <Link href="/login">Sign in</Link>
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 14,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: height * 0.02,
    paddingTop: height * 0.01,
  },
  logo: {
    width: width * 0.4,
    height: height * 0.06,
  },
  logoText: {
    fontSize: 14,
    marginTop: -8,
    marginLeft: 40,
    color: "#525252",
  },
  inputContainer: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    marginBottom: height * 0.01,
  },
  input: {
    height: height * 0.06,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 2,
    borderRadius: 5,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: "30%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  buttonContainer: {
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  signUpButton: {
    backgroundColor: "#000",
    paddingVertical: height * 0.015,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  alternativeSignIn: {
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.01,
    width: "80%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9D9D9",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#6F6F6F",
  },
  socialButtonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.05,
    width: "98%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 5,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  socialButtonText: {
    fontSize: 14,
    marginLeft: width * 0.15,
    color: "#6F6F6F",
  },
  signInPrompt: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  signInLink: {
    color: "#525252",
    fontWeight: "700",
    fontSize: 14,
  },
};