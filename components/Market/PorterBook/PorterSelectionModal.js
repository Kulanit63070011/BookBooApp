import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { doc, getDocs, collection, getDoc } from "firebase/firestore";
import { db } from "../../../backend/firebase";
import { useNavigation } from "@react-navigation/native";

const PorterSelectionModal = ({ visible, onClose, eventId, onSelectPorter }) => {
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
    }
  };

  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose a Porter to carry your stuff</Text>
        {porters.length === 0 ? (
          <Text style={styles.noPorterText}>There are currently no Porter options available.</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.containerCard}>
              {porters.map((porter) => (
                <TouchableOpacity
                  key={porter.userId}
                  onPress={() => setSelectedPorterId(porter.userId)}
                  style={[
                    styles.porterItem,
                    selectedPorterId === porter.userId && styles.selectedPorterItem,
                  ]}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioCircle,
                        selectedPorterId === porter.userId && styles.selectedRadioCircle,
                      ]}
                    />
                    <Text style={styles.porterName}>{porter.displayName}</Text>
                  </View>
                  <Text style={styles.porterRating}>
                    Score: {porter.rating ? porter.rating : "No scores yet"}
                  </Text>
                  <Text style={styles.porterRating}>Chat Score: {porter.chatRating}</Text>
                  <Text style={styles.porterDetails}>Delivery details: {porter.details}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleConfirmSelection}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: 30,
    color: "red",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  noPorterText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  scrollView: {
    paddingBottom: 20,
  },
  porterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  selectedPorterItem: {
    backgroundColor: "#e0f7fa",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 10,
  },
  selectedRadioCircle: {
    backgroundColor: "#007BFF",
  },
  porterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#333",
  },
  porterRating: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  porterDetails: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  confirmButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    elevation: 2,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default PorterSelectionModal;
