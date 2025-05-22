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
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailOrPhoneError, setEmailOrPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '454261196558-pqg607nr354prbj3526uabnohka4lpk1.apps.googleusercontent.com',
    androidClientId: '454261196558-jngnv4vq2rfp79o8h2ju5mu2amrcn614.apps.googleusercontent.com',
    webClientId: '539163820187-og6r7smr5uuo48kvcap399urnfid7blv.apps.googleusercontent.com',
  });

  const API_BASE_URL = "https://www.ozizabackapp.in/api/";

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

    if (!emailOrPhone) {
      setEmailOrPhoneError("Email or phone number is required");
      isValid = false;
    } else {
      setEmailOrPhoneError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

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
          email_or_phone: emailOrPhone,
          password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.email_or_phone?.[0] ||
          responseData.detail ||
          responseData.message ||
          'Login failed. Please try again.';
        throw new Error(errorMessage);
      }

      // Store tokens and user data
      if (responseData.access) {
        await SecureStore.setItemAsync("access_token", responseData.access);
      }
      if (responseData.refresh) {
        await SecureStore.setItemAsync("refresh_token", responseData.refresh);
      }
      if (responseData.user) {
        await SecureStore.setItemAsync("full_name", responseData.user.full_name || "");
        await SecureStore.setItemAsync("email", responseData.user.email || "");
        await SecureStore.setItemAsync("phone_number", responseData.user.phone_number || "");
        await SecureStore.setItemAsync("userProfilePicture", responseData.user.profile_picture || "");
      }

      router.push("/(tabs)/home");

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });

      // Inside your handleLogin function after successful login
      await initializePushNotifications();
    } catch (error) {
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

  const handleForgotPassword = async () => {
    if (!emailOrPhone) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email to reset password',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}v1/users/password/reset/request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: emailOrPhone.includes('@') ? emailOrPhone : null,
        }),
      });

      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Password reset request failed. Please try again.');
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.detail ||
          responseData.email?.[0] ||
          responseData.message ||
          'Password reset request failed'
        );
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'If this email exists, you will receive a password reset link shortly',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to process password reset',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
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
                style={[styles.input, emailOrPhoneError ? styles.inputError : null]}
                placeholder="Email or Phone Number"
                placeholderTextColor="#808080"
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={() => {
                  if (!emailOrPhone) {
                    setEmailOrPhoneError("Email or phone number is required");
                  } else {
                    setEmailOrPhoneError("");
                  }
                }}
              />
              {emailOrPhoneError ? <Text style={styles.errorText}>{emailOrPhoneError}</Text> : null}
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

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
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
            <Text style={styles.promptText}>
              Don't have an account?{" "}
              <Text style={styles.signUpLink}>
                <Link href="/signup" style={styles.linkText}>Sign up</Link>
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