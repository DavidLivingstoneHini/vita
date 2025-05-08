import React, { useState, useEffect } from "react";
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
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '454261196558-pqg607nr354prbj3526uabnohka4lpk1.apps.googleusercontent.com',
    androidClientId: '454261196558-jngnv4vq2rfp79o8h2ju5mu2amrcn614.apps.googleusercontent.com',
    webClientId: '539163820187-og6r7smr5uuo48kvcap399urnfid7blv.apps.googleusercontent.com',
    // redirectUri: 'https://auth.expo.io/@your-username/your-app-slug'
  });

  const API_BASE_URL = "http://192.168.100.34:8000/api/";

  // Handle Google Auth Response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn(response);
    }
  }, [response]);

  const handleGoogleSignIn = async (authResponse) => {
    try {
      setLoading(true);
      const { id_token } = authResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const userCredential = await signInWithCredential(auth, credential);

      // Store user data in SecureStore
      await SecureStore.setItemAsync("access_token", userCredential.user.accessToken);
      await SecureStore.setItemAsync("email", userCredential.user.email);
      await SecureStore.setItemAsync("full_name", userCredential.user.displayName || "");
      await SecureStore.setItemAsync("userProfilePicture", userCredential.user.photoURL || "");

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Google sign-in successful!',
      });

      router.push("/(tabs)/home");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    const goToHomeTab = () => {
      navigation.navigate("tabs", { screen: "Home" }); // Navigate to the Home tab
    };

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}v1/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle different error response formats
        const errorMessage = responseData.detail ||
          responseData.message ||
          (responseData.email ? responseData.email[0] : null) ||
          'Login failed. Please try again.';
        throw new Error(errorMessage);
      }

      // Store tokens only if they exist in response
      if (responseData.access) {
        await SecureStore.setItemAsync("access_token", responseData.access);
      }
      if (responseData.refresh) {
        await SecureStore.setItemAsync("refresh_token", responseData.refresh);
      }

      // Store user data
      if (responseData.user) {
        await SecureStore.setItemAsync("full_name", responseData.user.full_name || "");
        await SecureStore.setItemAsync("email", responseData.user.email || "");
        await SecureStore.setItemAsync("userProfilePicture", responseData.user.profile_picture || "");
      }

      // Navigate to home
      router.push("/(tabs)/home");

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
    } catch (error) {
      console.error("Sign-in error:", error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: error.message || 'Login failed. Please try again.',
        position: 'top',
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
        <Text style={styles.headerText}>Sign in</Text>
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
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Email"
                placeholderTextColor="#808080"
                value={email}
                onChangeText={setEmail}
                onBlur={() => {
                  if (!email) {
                    setEmailError("Email is required");
                  } else {
                    setEmailError("");
                  }
                }}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Password"
                placeholderTextColor="#808080"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={passwordVisibility}
                onBlur={() => {
                  if (!password) {
                    setPasswordError("Password is required");
                  } else {
                    setPasswordError("");
                  }
                }}
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
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
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
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => promptAsync()}
                disabled={loading || !request}
              >
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

          <View style={styles.signUpPrompt}>
            <Text>
              Don't have an account?{" "}
              <Text style={styles.signUpLink}>
                <Link href="/signup">Sign up</Link>
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginVertical: height * 0.03,
    paddingTop: height * 0.02,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.09,
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
    marginTop: height * 0.02,
  },
  inputWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: height * 0.01,
  },
  input: {
    height: height * 0.06,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  inputError: {
    borderColor: "red",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: "35%",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    paddingRight: 10,
    marginTop: height * 0.01,
  },
  forgotPasswordText: {
    color: "#525252",
    fontSize: 14,
  },
  buttonContainer: {
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  signInButton: {
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
    marginBottom: height * 0.02,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.02,
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
  signUpPrompt: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  signUpLink: {
    color: "#525252",
    fontWeight: "700",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

