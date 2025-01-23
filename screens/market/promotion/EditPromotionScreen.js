import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, Pressable, StyleSheet } from "react-native";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../../backend/firebase";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditPromotionScreen = ({ route, navigation }) => {
  const { promotionId } = route.params; // Get promotion ID from navigation params
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promotionImage, setPromotionImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const docRef = doc(db, "promotions", promotionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const promotionData = docSnap.data();
          setTitle(promotionData.title);
          setDescription(promotionData.description);
          setPromotionImage(promotionData.promotionImage || null);
        } else {
          Alert.alert("Promotion not found");
        }
      } catch (error) {
        console.error("Error fetching promotion:", error.message);
      }
    };

    fetchPromotion();
  }, [promotionId]);

  const pickPromotionImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access media is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image Picker Result:", result); // Log the result

    if (!result.canceled) {
      setPromotionImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!promotionImage) return null;
  
    setUploading(true);
    try {
      const response = await fetch(promotionImage);
      const blob = await response.blob(); // Convert the file into a blob
      const imageRef = ref(storage, `promotions/${Date.now()}`); // Use a unique path for each image
      await uploadBytes(imageRef, blob); // Upload the image to Firebase Storage
      const downloadURL = await getDownloadURL(imageRef); // Get the download URL after upload
      setUploading(false);
      return downloadURL;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error.message);
      Alert.alert("Error uploading image. Please try again.");
      return null;
    }
  };
    

  const updatePromotion = async () => {
    if (!title || !description) {
      Alert.alert("Please enter all required information");
      return;
    }

    try {
      // ใช้ภาพเดิมหากไม่มีการอัปโหลดใหม่
      const imageUrl = promotionImage ? await uploadImage() : promotionImage;

      // ตรวจสอบกรณีที่ promotionImage เป็น null
      const promotionData = {
        title,
        description,
        promotionImage: imageUrl || promotionImage, // ใช้ URL ของภาพเดิมหรือตั้งเป็น null หากไม่มีภาพ
      };

      const promotionRef = doc(db, "promotions", promotionId);
      await updateDoc(promotionRef, promotionData);

      Alert.alert("Promotion updated successfully!");
      navigation.goBack(); // Go back to previous screen after update
    } catch (error) {
      console.error("Error updating promotion:", error.message);
      Alert.alert("Error updating promotion. Please try again.");
    }
  };

  const deletePromotion = async () => {
    try {
      const promotionRef = doc(db, "promotions", promotionId);
      await deleteDoc(promotionRef);
      Alert.alert("Promotion deleted successfully!");
      navigation.goBack(); // Go back to previous screen after deletion
    } catch (error) {
      console.error("Error deleting promotion:", error.message);
      Alert.alert("Error deleting promotion. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Promotion</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity onPress={pickPromotionImage}>
        <View style={styles.imagePicker}>
          {promotionImage ? (
            <Image source={{ uri: promotionImage }} style={styles.image} resizeMode="cover" />
          ) : (
            <Text style={styles.imagePlaceholder}>Tap to select promotion image</Text>
          )}
        </View>
      </TouchableOpacity>
      <Pressable
        style={[
          styles.updateButton,
          uploading ? { backgroundColor: "gray" } : {},
        ]}
        onPress={updatePromotion}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Update Promotion"}
        </Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={deletePromotion}>
        <Text style={styles.buttonText}>Delete Promotion</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    width: 300,
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: "#888",
  },
});

export default EditPromotionScreen;
