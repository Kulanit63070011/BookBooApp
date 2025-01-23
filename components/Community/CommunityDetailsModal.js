import React, { useState, useEffect } from "react";
import { Modal, View, Text, Pressable, ScrollView, Image, StyleSheet } from "react-native";
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

  const handleJoinCommunity = async () => {
    try {
      const user = auth.currentUser;
      if (user && communityDetails) {
        const communityDocRef = doc(db, "communities", communityDetails.name);
        await updateDoc(communityDocRef, {
          members: arrayUnion(user.uid),
        });
        const interestsDocRef = doc(db, "interests", user.uid);
        await updateUserInterests(user.uid, communityDetails.type);
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
      if (userDoc.exists()) {
        let interests = userDoc.data().interests || [];
        interests = interests.filter((interest) => interest !== newType);
        interests.push(newType);
        if (interests.length > 10) {
          interests.shift();
        }
        await updateDoc(userInterestsRef, { interests });
      } else {
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

  const { name, description, members, imageCommu } = communityDetails;

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.topBar}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={30} color="#333" />
              </Pressable>
            </View>
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    imageCommu
                      ? { uri: imageCommu }
                      : require("../../assets/images/bookcover.png")
                  }
                  resizeMode="cover"
                  style={styles.bookImage}
                />
              </View>
              <Text style={styles.label}>Community Name</Text>
              <Text style={styles.detail}>{name}</Text>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.detail}>{description}</Text>
              <Text style={styles.memberCount}>{members.length} members</Text>
            </View>
            <View style={styles.actionButtonsContainer}>
              <Pressable onPress={handleJoinCommunity} style={styles.joinButton}>
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
    backgroundColor: "red",
    borderRadius: 15,
    width: "85%",
    maxHeight: "85%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  topBar: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    padding: 10,
  },
  content: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  bookImage: {
    width: 180,
    height: 200,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 600,
    color: "white",
    marginBottom: 5,
  },
  detail: {
    fontSize: 17,
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  memberCount: {
    fontSize: 14,
    color: "white",
    fontWeight: 600,
    marginTop: 5,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  joinButton: {
    backgroundColor: "#5B42C1",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CommunityDetailsModal;