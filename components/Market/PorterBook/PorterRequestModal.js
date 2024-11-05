import React, { useState, useEffect } from "react"; 
import { View, Text, TextInput, Button, CheckBox, StyleSheet, Alert, Modal, TouchableOpacity } from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db, auth } from "../../../backend/firebase";
import { useNavigation } from "@react-navigation/native";

const PorterRequestModal = ({ visible, onClose, eventId }) => {
  const navigation = useNavigation();
  const [requestDetails, setRequestDetails] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [displayName, setDisplayName] = useState("ผู้ใช้ไม่ระบุชื่อ"); // สร้าง state สำหรับ displayName

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDisplayName(userData.displayName || "ผู้ใช้ไม่ระบุชื่อ");
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitRequest = async () => {
    if (!isConfirmed) {
      Alert.alert("กรุณายืนยันก่อนส่งคำขอ");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const porterRequestRef = doc(db, "events", eventId, "porterMembers", userId);

      const porterRequest = {
        userId,
        displayName, // ใช้ displayName ที่ดึงมา
        details: requestDetails,
        createdAt: new Date(),
      };

      await setDoc(porterRequestRef, porterRequest);
      Alert.alert("สมัครเรียบร้อยแล้ว", "คุณได้สมัครรับหิ้ว event นี้แล้ว!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding porter to event:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถสมัครรับหิ้ว event ได้");
    }
  };  

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <Text style={styles.title}>รายละเอียดการสมัคร</Text>
        <TextInput
          style={styles.input}
          placeholder="กรุณากรอกรายละเอียด"
          value={requestDetails}
          onChangeText={setRequestDetails}
        />
        <View style={styles.checkboxContainer}>
          <CheckBox value={isConfirmed} onValueChange={setIsConfirmed} />
          <Text>ยืนยันการสมัคร</Text>
        </View>
        <Button title="ส่งคำขอ" onPress={handleSubmitRequest} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },
});

export default PorterRequestModal;
