import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { myProfileStyles } from "../../style/user/MyProfileStyle";
import { myBookShelfStyles } from "../../style/bookshelf/MyBookShelfStyle";
import { auth, db } from "../../backend/firebase";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { Divider } from "react-native-elements";
import BottomNavigator from "../../navigation/BottomNavigator";

const MyProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userAuth = auth.currentUser;

      if (userAuth) {
        const userId = userAuth.uid;
        const userDocRef = doc(db, "users", userId);

        try {
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: userId,
              displayName: userData.displayName || "Default Display Name",
              email: userData.email || "Default Email",
              aboutMe: userData.aboutMe || "Default About Me",
              userImage: userData.userImage || null, // ดึง URL ของรูปภาพ
            });
          } else {
            console.error("User document does not exist in Firestore");
          }
        } catch (error) {
          console.error(
            "Error fetching user data from Firestore",
            error.message
          );
        }
      } else {
        setUser({
          id: null,
          displayName: "Default Display Name",
          email: "Default Email",
          aboutMe: "Default About Me",
          userImage: null,
        });
      }
    };

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchUserData();
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <View style={myProfileStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User signed out");
      // นำผู้ใช้ไปยังหน้าล็อกอินหลังจากการล็อกเอาท์สำเร็จ
      navigation.navigate("Welcome");
    } catch (error) {
      console.error("Logout failed", error.message);
    }
  };

  // MyProfileScreen.js
  const handleEditProfile = async () => {
    navigation.navigate("EditProfile", {
      visible: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        aboutMe: user.aboutMe,
      },
      setUser: setUser, // เพิ่มการส่ง setUser ไปยังหน้า EditProfileScreen
      onSave: async (updatedUser) => {
        // ทำการอัปเดท state หรือทำการ refresh หน้าข้อมูล
        setUser(updatedUser);

        // เพิ่มการอัปเดทข้อมูลใน Firestore โดยใช้ user.id
        const userDocRef = doc(getFirestore(), "users", updatedUser.id);

        try {
          await updateDoc(userDocRef, {
            displayName: updatedUser.displayName,
            username: updatedUser.username,
            email: updatedUser.email,
            aboutMe: updatedUser.aboutMe,
          });
          console.log("User data updated in Firestore"); // เพิ่มบรรทัดนี้
        } catch (error) {
          console.error("Error updating user data in Firestore", error.message);
        }
      },
      onClose: () => {
        // ปิด Modal
        navigation.navigate("MyProfile");
      },
    });
  };

  return (
    <View style={myProfileStyles.container}>
      <View style={[myProfileStyles.profileContainer, myProfileStyles.shadow]}>
        {user.userImage ? (
          <Image
            source={{ uri: user.userImage }}
            style={myProfileStyles.profileImage}
          />
        ) : (
          <Image
            source={require("../../assets/images/human.png")}
            style={myProfileStyles.profileImage}
          />
        )}
      </View>
      <Text style={myProfileStyles.displayName}>{user.displayName}</Text>
      <Divider
        style={{
          backgroundColor: "grey",
          height: 1,
          width: "80%",
          marginVertical: 10,
        }}
      />
      <Text style={myProfileStyles.email}>{user.email}</Text>
      <Text style={myProfileStyles.aboutMe}>{user.aboutMe}</Text>
      <Pressable style={myProfileStyles.greyButton} onPress={handleEditProfile}>
        <Text style={[myProfileStyles.buttonText, { color: "#4542C1" }]}>
          ✏️Edit Profile
        </Text>
      </Pressable>
      <Pressable style={myProfileStyles.greyButton} onPress={handleLogout}>
        <Text style={[myProfileStyles.buttonText, { color: "#FD1919" }]}>
          Logout
        </Text>
      </Pressable>
      <BottomNavigator style={myBookShelfStyles.bottomNavigator} />
    </View>
  );
};

export default MyProfileScreen;
