import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../backend/firebase";
import { useNavigation } from "@react-navigation/native";

const CommunityDetailsModal = ({ visible, communityDetails, onClose }) => {
  const navigation = useNavigation();
  const [updatedDetails, setUpdatedDetails] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (communityDetails) {
      setUpdatedDetails({
        name: communityDetails.name,
        description: communityDetails.description,
      });
    }
  }, [communityDetails]);

  const handleInputChange = (property, value) => {
    setUpdatedDetails({
      ...updatedDetails,
      [property]: value,
    });
  };

  const handleJoinCommunity = async () => {
    try {
      const user = auth.currentUser;

      if (user && communityDetails) {
        // อัปเดตเอกสารของชุมชนเพื่อเพิ่มผู้ใช้ในอาเรย์ 'members'
        const communityDocRef = doc(db, "communities", communityDetails.name);
        await updateDoc(communityDocRef, {
          members: arrayUnion(user.uid),
        });

        // อัปเดตความสนใจของผู้ใช้ในคอลเลกชัน interests
        const interestsDocRef = doc(db, "interests", user.uid);
        await updateUserInterests(user.uid, communityDetails.type); // อัปเดตความสนใจ

        // อัปเดตความสนใจของผู้ใช้ในเอกสาร users
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          interests: arrayUnion(communityDetails.type),
        });

        onClose();
        navigation.navigate("AllCommunity", { refresh: true });
      } else {
        console.error("No user or community details found");
      }
    } catch (error) {
      console.error("Error joining community:", error.message);
    }
  };

  const updateUserInterests = async (userUid, newType) => {
    try {
      const userInterestsRef = doc(db, "interests", userUid);
      const userDoc = await getDoc(userInterestsRef);

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

        // อัปเดต Firestore
        await updateDoc(userInterestsRef, { interests });
      } else {
        // ถ้าไม่มีข้อมูลผู้ใช้ สร้างใหม่
        await setDoc(userInterestsRef, {
          interests: [newType],
        });
      }
    } catch (error) {
      console.error("Error updating user interests:", error.message);
    }
  };

  if (!visible || !communityDetails) {
    return null;
  }

  const { name, description, members } = communityDetails;

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.topBar}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={30} color="white" />
              </Pressable>
            </View>
            <View style={styles.content}>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/bookcover.png")}
                  resizeMode="contain"
                  style={styles.bookImage}
                />
              </View>
              <Text style={styles.label}>Community Name:</Text>
              <Text style={styles.detail}>{name}</Text>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.detail}>{description}</Text>
              <Text style={styles.memberCount}>{members.length} members</Text>
            </View>
            <View style={styles.actionButtonsContainer}>
              <Pressable
                onPress={handleJoinCommunity}
                style={styles.joinButton}
              >
                <Text style={styles.buttonText}>Join Community</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FD1919",
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  topBar: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  memberCount: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  joinButton: {
    backgroundColor: "#5B42C1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  bookImage: {
    width: 170,
    height: 200,
  },
});

export default CommunityDetailsModal;
