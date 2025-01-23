import React, { useState } from "react";
import { View, Text, Pressable, Image, TextInput, ScrollView, Platform, StyleSheet, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { signUpStyles } from "../../style/user/SignUpStyle";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../backend/firebase";
import { setDoc, doc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [birthDate, setBirthDate] = useState(new Date()); // เก็บวันเกิดที่เลือก
  const [showDatePicker, setShowDatePicker] = useState(false); // ควบคุมการแสดง DatePicker
  const storage = getStorage();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const userDocRef = doc(db, "users", userId);

      let userImageUrl = null;
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // กำหนด storageRef สำหรับอัปโหลดไฟล์
        const storageRef = ref(storage, `userImages/${userId}`);

        // อัปโหลดไฟล์ภาพไปยัง Firebase Storage
        await uploadBytes(storageRef, blob);
        userImageUrl = await getDownloadURL(storageRef); // ดึง URL ของภาพที่อัปโหลด
        console.log("Image uploaded to Firebase Storage:", userImageUrl);  // Debug log
      }

      // บันทึกข้อมูลใน Firestore
      await setDoc(userDocRef, {
        displayName,
        username,
        email,
        aboutMe,
        birthDate: birthDate.toISOString(),
        interests: [],
        userImage: userImageUrl, // เก็บ URL ของภาพใน Firestore
      });

      alert("Sign up successful");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Sign up failed", error.message);
    }
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Store the selected image URI
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={signUpStyles.title}>Register</Text>
        </View>
      </SafeAreaView>
      <ScrollView style={signUpStyles.contentContainer}>
        {/* Profile Image Selection */}
        <Pressable onPress={selectImage}>
          <View style={styles.imagePicker}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>
                Select a profile image
              </Text>
            )}
          </View>
        </Pressable>

        <View style={signUpStyles.inputContainer}>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Display Name</Text>
            <TextInput
              style={signUpStyles.textInput}
              value={displayName}
              placeholder="Enter Name"
              onChangeText={(text) => setDisplayName(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Username</Text>
            <TextInput
              style={signUpStyles.textInput}
              value={username}
              placeholder="Enter Username"
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Email Address</Text>
            <TextInput
              style={signUpStyles.textInput}
              value={email}
              placeholder="Enter Email"
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Password</Text>
            <TextInput
              style={signUpStyles.textInput}
              secureTextEntry
              value={password}
              placeholder="Enter Password"
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Password Confirm</Text>
            <TextInput
              style={signUpStyles.textInput}
              secureTextEntry
              value={passwordConfirm}
              placeholder="Enter Password"
              onChangeText={(text) => setPasswordConfirm(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>About me</Text>
            <TextInput
              style={[signUpStyles.textInput, { height: 80 }]}
              multiline={true}
              value={aboutMe}
              placeholder="Enter detail"
              onChangeText={(text) => setAboutMe(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Birth Date</Text>
            {Platform.OS === "web" ? (
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                maxDate={new Date()}
                dateFormat="yyyy-MM-dd"
              />
            ) : (
              <Pressable onPress={() => setShowDatePicker(true)}>
                <Text>{birthDate.toDateString()}</Text>
              </Pressable>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}
          </View>
          <View style={{ paddingBottom: 30 }}>
            <Pressable onPress={() => navigation.navigate("PorterSignUp")}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                Sign Up As Porter
              </Text>
            </Pressable>
          </View>
          <View style={{ paddingBottom: 30 }}>
            <Pressable style={signUpStyles.signUpButton} onPress={handleSignUp}>
              <Text style={signUpStyles.signUpButtonText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePicker: {
    height: 200,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: "#888",
  },
});
