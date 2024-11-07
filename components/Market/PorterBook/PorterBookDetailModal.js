import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PorterRequestModal from "./PorterRequestModal";
import PorterSelectionModal from "./PorterSelectionModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../backend/firebase";

const PorterBookDetailModal = ({ visible, postData, onClose, userRole }) => {
  const navigation = useNavigation();

  // State for modals
  const [isRequestModalVisible, setRequestModalVisible] = useState(false);
  const [isSelectionModalVisible, setSelectionModalVisible] = useState(false);
  const [porters, setPorters] = useState([]);
  const [items, setItems] = useState([]); // State for items

  useEffect(() => {
    if (postData) {
      fetchItems(); // ดึง items เมื่อ postData มีการเปลี่ยนแปลง
      fetchPorters(); // ดึง porters ด้วย
    }
  }, [postData]);

  const fetchPorters = async () => {
    try {
      const portersRef = collection(db, "porters");
      const q = query(portersRef, where("eventId", "==", postData.id));
      const querySnapshot = await getDocs(q);

      const portersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPorters(portersList);
    } catch (error) {
      console.error("Error fetching porters:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const itemsRef = collection(db, `events/${postData.id}/items`); // Correct path to fetch items
      const querySnapshot = await getDocs(itemsRef);

      const itemsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(itemsList);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const renderPostItems = () => {
    if (!items || items.length === 0) {
      return <Text>No items available.</Text>;
    }

    return items.map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Price: {item.price} THB</Text>
        <View style={styles.imageGrid}>
          <Image
            source={
              item.itemImage // Ensure this points to the image URL from Firebase Storage
                ? { uri: item.itemImage }
                : require("../../../assets/images/bookcover.png") // Fallback image if no image is provided
            }
            style={styles.bookImage}
          />
        </View>
      </View>
    ));
  };

  const handleRequestPress = () => {
    setRequestModalVisible(true);
  };

  const handleSelectPorter = (porter) => {
    navigation.navigate("Chat", { partnerId: porter.userId });
    setSelectionModalVisible(false); // ปิด PorterSelectionModal
  };

  if (!visible) return null;

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{postData.title}</Text>
          <Text style={styles.date}>
            Start Date: {postData.startDate} | End Date: {postData.endDate}
          </Text>
          <ScrollView style={styles.scrollView}>{renderPostItems()}</ScrollView>
          <Text style={styles.about}>{postData.about}</Text>

          {userRole === "porter" ? (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={handleRequestPress}
            >
              <Text style={styles.chatButtonText}>สมัครรับหิ้ว event นี้</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                setSelectionModalVisible(true); // เปิด PorterSelectionModal
              }}
            >
              <Text style={styles.chatButtonText}>ฝากหิ้วชิ้นนี้</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <PorterRequestModal
        visible={isRequestModalVisible}
        onClose={() => setRequestModalVisible(false)}
        eventId={postData.id}
      />
      <PorterSelectionModal
        visible={isSelectionModalVisible}
        onClose={() => {
          setSelectionModalVisible(false);
          onClose(); // ปิด PorterBookDetailModal เมื่อปิด PorterSelectionModal
        }}
        eventId={postData.id}
        onSelectPorter={handleSelectPorter}
      />
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  date: {
    marginBottom: 10,
    color: "#666",
  },
  itemContainer: {
    marginBottom: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bookImage: {
    width: 70,
    height: 100,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    maxHeight: 250,
  },
  about: {
    marginTop: 10,
    fontSize: 16,
    color: "#444",
  },
  chatButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  chatButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PorterBookDetailModal;
