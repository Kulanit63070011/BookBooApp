import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { doc, getDocs, collection, getDoc } from "firebase/firestore";
import { db } from "../../../backend/firebase";
import { useNavigation } from "@react-navigation/native";

const PorterSelectionModal = ({
  visible,
  onClose,
  eventId,
  onSelectPorter,
}) => {
  const [porters, setPorters] = useState([]);
  const [selectedPorterId, setSelectedPorterId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPorters = async () => {
      if (!eventId) return;

      try {
        const portersRef = collection(db, "events", eventId, "porterMembers");
        const querySnapshot = await getDocs(portersRef);

        const portersList = await Promise.all(
          querySnapshot.docs.map(async (porterDoc) => {
            const porterData = porterDoc.data();
            const userDocRef = doc(db, "users", porterData.userId);
            const userDoc = await getDoc(userDocRef);

            return {
              userId: porterData.userId,
              details: porterData.details,
              displayName: userDoc.exists() ? userDoc.data().displayName : 'ไม่มีชื่อ',
              rating: porterData.rating,
              chatRating: porterData.chatRating,
            };
          })
        );

        if (portersList.length === 0) {
          console.log("No porters found");
        } else {
          setPorters(portersList);
        }
      } catch (error) {
        console.error("Error fetching porters:", error);
      }
    };

    if (visible) {
      fetchPorters();
    }
  }, [visible, eventId]);

  const handleConfirmSelection = () => {
    const selectedPorter = porters.find(
      (porter) => porter.userId === selectedPorterId
    );
    if (selectedPorter) {
      onSelectPorter(selectedPorter);
      onClose(); // ปิด PorterSelectionModal
      // เรียก onClose() เพื่อปิด PorterBookDetailModal
    }
  };  

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <Text style={styles.title}>เลือก Porter ที่จะฝากหิ้ว</Text>
        {porters.length === 0 ? (
          <Text>ไม่มี Porter ให้เลือกในขณะนี้</Text>
        ) : (
          <ScrollView>
            {porters.map((porter) => (
              <TouchableOpacity
                key={porter.userId}
                onPress={() => setSelectedPorterId(porter.userId)}
                style={styles.porterItem}
              >
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPorterId === porter.userId &&
                        styles.selectedRadioCircle,
                    ]}
                  />
                  <Text style={styles.porterName}>{porter.displayName}</Text>
                </View>
                <Text>
                  คะแนน: {porter.rating ? porter.rating : "ยังไม่มีคะแนน"}
                </Text>
                <Text>คะแนนการตอบแชท: {porter.chatRating}</Text>
                <Text>รายละเอียด: {porter.details}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={handleConfirmSelection}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>ยืนยันการเลือก</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  closeButton: { position: "absolute", top: 10, right: 10 },
  closeText: { fontSize: 24, fontWeight: "bold", color: "red" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  porterItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  radioContainer: { flexDirection: "row", alignItems: "center" },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRadioCircle: { backgroundColor: "#007BFF" },
  porterName: { fontSize: 16 },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: { color: "#FFFFFF", fontSize: 18 },
});

export default PorterSelectionModal;
