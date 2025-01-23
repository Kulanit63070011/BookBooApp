import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PorterRequestModal from "./PorterRequestModal";
import PorterSelectionModal from "./PorterSelectionModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../backend/firebase";

const PorterBookDetailModal = ({ visible, postData, onClose, userRole }) => {
  const navigation = useNavigation();
  const [isRequestModalVisible, setRequestModalVisible] = useState(false);
  const [isSelectionModalVisible, setSelectionModalVisible] = useState(false);
  const [porters, setPorters] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (postData) {
      fetchItems();
      fetchPorters();
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
      const itemsRef = collection(db, `events/${postData.id}/items`);
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
      return <Text style={styles.noItemsText}>No items available.</Text>;
    }

    return items.map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Price: {item.price} THB</Text>
        <View style={styles.imageGrid}>
          <Image
            source={
              item.itemImage
                ? { uri: item.itemImage }
                : require("../../../assets/images/bookcover.png")
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
    setSelectionModalVisible(false);
  };

  if (!visible) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short", // Day of the week
      year: "numeric", // Full year
      month: "short", // Abbreviated month
      day: "numeric", // Day of the month
    });
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{postData.title}</Text>
          <Text style={styles.date}>
            Start Date: {formatDate(postData.startDate)} | End Date: {formatDate(postData.endDate)}
          </Text>
          <ScrollView style={styles.scrollView}>{renderPostItems()}</ScrollView>
          <Text style={styles.about}>{postData.about}</Text>

          {userRole === "porter" ? (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={handleRequestPress}
            >
              <Text style={styles.chatButtonText}>Apply to be a carrier for this event.</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => setSelectionModalVisible(true)}
            >
              <Text style={styles.chatButtonText}>See all porters in this event</Text>
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
          onClose();
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
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF5733",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
  itemContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bookImage: {
    width: 90,
    height: 140,
    marginBottom: 5,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    maxHeight: 300,
  },
  about: {
    fontSize: 16,
    color: "#444",
    marginTop: 15,
  },
  noItemsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
  },
  chatButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  chatButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default PorterBookDetailModal;
