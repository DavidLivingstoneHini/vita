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
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = "http://192.168.100.34:8000/api/";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [passwordVisibility2, setPasswordVisibility2] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '454261196558-pqg607nr354prbj3526uabnohka4lpk1.apps.googleusercontent.com',
    androidClientId: '454261196558-jngnv4vq2rfp79o8h2ju5mu2amrcn614.apps.googleusercontent.com',
    webClientId: '539163820187-og6r7smr5uuo48kvcap399urnfid7blv.apps.googleusercontent.com',
  });

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

      // Store user data
      await SecureStore.setItemAsync("email", userCredential.user.email);
      await SecureStore.setItemAsync("full_name", userCredential.user.displayName || "");

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

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);

      // Initialize Facebook SDK
      await Facebook.initializeAsync({
        appId: 'YOUR_FACEBOOK_APP_ID',
      });

      // Log in with permissions
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (type === 'success') {
        // Create a Firebase credential with the Facebook access token
        const facebookCredential = FacebookAuthProvider.credential(token);

        // Sign in with the credential
        const userCredential = await signInWithCredential(auth, facebookCredential);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Facebook sign-in successful!',
          position: 'bottom',
        });

        router.push("/home");
      } else {
        throw new Error('Facebook login was cancelled');
      }
    } catch (error) {
      console.error('Facebook sign-in error:', error);

      Toast.show({
        type: 'error',
        text1: 'Facebook Sign-In Error',
        text2: error.message,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    let isValid = true;

    // Reset errors
    setFullNameError("");
    setEmailError("");
    setPhoneNumberError("");
    setPasswordError("");
    setRepeatPasswordError("");

    if (!fullName.trim()) {
      setFullNameError("Full name is required");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      setPhoneNumberError("Phone number is required");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords don't match");
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}v1/users/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          phone_number: phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.email?.[0] ||
          data.non_field_errors?.[0] ||
          'Sign-up failed. Please try again.'
        );
      }

      // Store tokens if they exist in response
      if (data.access) {
        await SecureStore.setItemAsync("access_token", data.access);
      }
      if (data.refresh) {
        await SecureStore.setItemAsync("refresh_token", data.refresh);
      }

      // Store user data
      if (data.user) {
        await SecureStore.setItemAsync("full_name", data.user.full_name || "");
        await SecureStore.setItemAsync("email", data.user.email || "");
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });

      router.push("/(tabs)/home");
    } catch (error) {
      console.error("Sign-up error:", error);
      Toast.show({
        type: 'error',
        text1: 'Sign-up Error',
        text2: error.message,
        position: 'top',
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
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, fullNameError ? styles.inputError : null]}
                placeholder="Name"
                placeholderTextColor="#808080"
                value={fullName}
                onChangeText={setFullName}
                onBlur={() => {
                  if (!fullName) {
                    setFullNameError("Full Name is required");
                  } else {
                    setFullNameError("");
                  }
                }}
              />
              {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}
            </View>

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
                style={[styles.input, phoneNumberError ? styles.inputError : null]}
                placeholder="Phone number"
                placeholderTextColor="#808080"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onBlur={() => {
                  if (!phoneNumber) {
                    setPhoneNumberError("Phone Number is required");
                  } else {
                    setPhoneNumberError("");
                  }
                }}
              />
              {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
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

            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, repeatPasswordError ? styles.inputError : null]}
                placeholder="Repeat Password"
                placeholderTextColor="#808080"
                value={repeatPassword}
                onChangeText={(text) => {
                  setRepeatPassword(text);
                  setPasswordMatch(text === password);
                }}
                secureTextEntry={passwordVisibility2}
                onBlur={() => {
                  if (password !== repeatPassword) {
                    setRepeatPasswordError("Passwords do not match");
                  } else {
                    setRepeatPasswordError("");
                  }
                }}
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
              {repeatPasswordError ? <Text style={styles.errorText}>{repeatPasswordError}</Text> : null}
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

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleFacebookSignIn}
                disabled={loading}
              >
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
  inputError: {
    borderColor: "red",
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
});

