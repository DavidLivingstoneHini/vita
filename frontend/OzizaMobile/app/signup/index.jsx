import React, { useState } from "react";
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
  StyleSheet, // Import StyleSheet
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

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

  // Error state variables
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const router = useRouter();

  const validateFields = () => {
    let isValid = true;

    if (!fullName) {
      setFullNameError("Full Name is required");
      isValid = false;
    } else {
      setFullNameError("");
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone Number is required");
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setRepeatPasswordError("");
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.apiRequest(
        "https://djbackend-9d8q.onrender.com/api/v1/users/signup/",
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

