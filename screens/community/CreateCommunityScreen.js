import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, Platform, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db, storage } from "../../backend/firebase"; // Ensure storage is imported here
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { createCommunityStyles } from "../../style/community/CreateCommunityStyle";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateCommunityScreen = () => {
  const navigation = useNavigation();
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [imageCommu, setImageCommu] = useState("");
  const [description, setDescription] = useState("");

  const filtersData = [
    { category: "General novels" },
    { category: "Romantic novels" },
    { category: "Fantasy novels" },
    { category: "Sci-fi novels" },
    { category: "Adventure novels" },
    { category: "Detective novels" },
    { category: "Horror novels" },
    { category: "Serial novels" },
    { category: "General cartoons" },
    { category: "Romantic cartoons" },
    { category: "Fantasy cartoons" },
    { category: "Sci-fi cartoons" },
    { category: "Adventure cartoons" },
    { category: "Detective cartoons" },
    { category: "Horror cartoons" },
    { category: "Serial cartoons" },
    { category: "Finance and Investment" },
    { category: "Market Accounting" },
    { category: "Psychology" },
    { category: "Self-Development" },
    { category: "Education" },
    { category: "Language" },
    { category: "Law" },
    { category: "Creative Design" },
    { category: "Politics" },
    { category: "Computer Science" },
    { category: "History" },
    { category: "Religious Beliefs" },
    { category: "Pets" },
    { category: "Health" },
    { category: "Travel" },
    { category: "Music and Entertainment" },
    { category: "Food" },
    { category: "Art" },
    { category: "Others" },
  ];

  const updateUserInterests = async (userUid, newType) => {
    try {
      const userInterestsRef = doc(db, "interests", userUid);
      const userDocRef = doc(db, "users", userUid); // Reference to user document in "users" collection
      const userDoc = await getDoc(userInterestsRef);
      const userDocSnapshot = await getDoc(userDocRef); // Fetch the user's document

      // ถ้าผู้ใช้มีข้อมูลความสนใจแล้ว
      if (userDoc.exists()) {
        let interests = userDoc.data().interests || [];
        // ลบประเภทที่ซ้ำกัน (ถ้ามี) และเพิ่มที่ท้ายสุด
        interests = interests.filter((interest) => interest !== newType);
        interests.push(newType);

        // ถ้าจำนวนความสนใจเกิน 10 ลบประเภทที่เก่าออก
        if (interests.length > 10) {
          interests.shift();
        }

        // อัปเดต Firestore ใน "interests"
        await updateDoc(userInterestsRef, { interests });
      } else {
        // ถ้าไม่มีข้อมูลผู้ใช้ใน "interests" ให้สร้างใหม่
        await setDoc(userInterestsRef, {
          interests: [newType],
        });
      }

      // อัปเดตความสนใจใน field "interests" ของเอกสารใน "users"
      if (userDocSnapshot.exists()) {
        let userInterests = userDocSnapshot.data().interests || [];

        // ลบประเภทที่ซ้ำกัน (ถ้ามี) และเพิ่มที่ท้ายสุด
        userInterests = userInterests.filter(
          (interest) => interest !== newType
        );
        userInterests.push(newType);

        // ถ้าจำนวนความสนใจเกิน 10 ลบประเภทที่เก่าออก
        if (userInterests.length > 10) {
          userInterests.shift();
        }

        // อัปเดต Firestore ใน "users"
        await updateDoc(userDocRef, { interests: userInterests });
      } else {
        // ถ้าไม่มีข้อมูลใน "users" ให้สร้างใหม่
        await setDoc(userDocRef, {
          interests: [newType],
        });
      }
    } catch (error) {
      console.error("Error updating user interests:", error.message);
    }
  };

  const handleCreateCommunity = async () => {
    try {
      const user = auth.currentUser;
  
      // Validate that type, name, and image are provided
      if (!type || !name || !user) {
        alert("Please fill in required information (Type, Name, and Creator)");
        return;
      }
  
      if (!imageCommu) {
        alert("Please upload an image for the community");
        return;
      }
  
      const createdByUser = user.uid;
      const creationTimestamp = new Date();
      const membersArray = [createdByUser];
  
      // Upload image to Firebase Storage
      let communityImageUrl = null;
      if (imageCommu) {
        const response = await fetch(imageCommu);
        const blob = await response.blob();
        const storageRef = ref(storage, `communityImages/${name}`);
        await uploadBytes(storageRef, blob);
        communityImageUrl = await getDownloadURL(storageRef);
      }
  
      // Community data to be stored in Firestore
      const communityData = {
        communityId: name,
        type,
        name,
        imageCommu: communityImageUrl, // Store image URL
        description,
        members: membersArray,
        createdBy: createdByUser,
        createdDate: creationTimestamp,
      };
  
      const communityDocRef = doc(db, "communities", name);
      await setDoc(communityDocRef, communityData);
  
      // Update user's interests when creating a community
      await updateUserInterests(user.uid, type);
      alert("Community created successfully");
      navigation.navigate("AllCommunity", { refresh: true });
    } catch (error) {
      console.error("Error creating community:", error.message);
    }
  };  

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageCommu(result.assets[0].uri);
    }
  };

  return (
    <View style={createCommunityStyles.container}>
      <View style={createCommunityStyles.bookImageContainer}>
        <Image
          source={
            imageCommu
              ? { uri: imageCommu }
              : require("../../assets/images/commuImg.png")
          }
          resizeMode="cover"
          style={createCommunityStyles.bookImage}
        />
        <Pressable style={createCommunityStyles.addButton} onPress={pickImage}>
          <Text style={createCommunityStyles.addButtonIcon}>+</Text>
        </Pressable>
      </View>
      <View style={createCommunityStyles.content}>
        <Text style={createCommunityStyles.label}>Community Type:</Text>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={createCommunityStyles.input}
        >
          {filtersData.map((filter, index) => (
            <Picker.Item
              label={filter.category}
              value={filter.category}
              key={index}
              color="#000000"
            />
          ))}
        </Picker>
        <Text style={createCommunityStyles.label}>Community Name:</Text>
        <TextInput
          style={createCommunityStyles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={createCommunityStyles.label}>Detail:</Text>
        <TextInput
          style={[createCommunityStyles.input, { height: 80 }]}
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline={true}
          numberOfLines={4}
        />
      </View>
      <Pressable
        onPress={handleCreateCommunity}
        style={createCommunityStyles.button}
      >
        <Text style={createCommunityStyles.buttonText}>Create</Text>
      </Pressable>
    </View>
  );
};

export default CreateCommunityScreen;