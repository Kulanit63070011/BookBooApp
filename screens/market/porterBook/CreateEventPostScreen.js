import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db, auth, storage } from "../../../backend/firebase"; // Add storage import
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions

const CreateEventPostScreen = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [about, setAbout] = useState("");
  const [items, setItems] = useState([{ name: "", price: "", image: null }]); // State for items with image
  const [eventImage, setEventImage] = useState(null); // State for event image

  const handleAddItem = () => {
    if (items.length < 10) {
      setItems([...items, { name: "", price: "", image: null }]); // Include image for each item
    }
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  // Function to upload an image to Firebase Storage
  const uploadImage = async (uri, path) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, path); // Generate a path for the image in Firebase Storage
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser.uid;

      // Create event data
      const eventData = {
        title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        about,
        createdBy: userId,
      };

      // Upload event image to Firebase Storage if exists
      let eventImageUrl = null;
      if (eventImage) {
        eventImageUrl = await uploadImage(
          eventImage,
          `eventImages/${userId}/${Date.now()}`
        );
      }

      // Add event document to Firestore
      const eventDocRef = await addDoc(collection(db, "events"), {
        ...eventData,
        eventImage: eventImageUrl,
      });

      // Add items to the items collection
      for (const item of items) {
        if (item.name && item.price) {
          // Only add items that have a name and price
          let itemImageUrl = null;
          if (item.image) {
            // Upload item image if exists
            itemImageUrl = await uploadImage(
              item.image,
              `itemImages/${userId}/${Date.now()}`
            );
          }
          // Add item document to items subcollection
          await addDoc(collection(db, `events/${eventDocRef.id}/items`), {
            name: item.name,
            price: item.price,
            itemImage: itemImageUrl,
          });
        }
      }

      console.log("Event post created successfully");
      setTitle("");
      setStartDate(new Date());
      setEndDate(new Date());
      setAbout("");
      setItems([{ name: "", price: "", image: null }]); // Reset items
      setEventImage(null); // Reset the event image
    } catch (error) {
      console.error("Error creating event post:", error.message);
    }
  };

  const renderDatePicker = (
    date,
    setDate,
    showDatePicker,
    setShowDatePicker
  ) => {
    return Platform.OS === "web" ? (
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date.toISOString().split("T")[0]}
        onChange={(e) => {
          const inputDate = e.target.value;
          if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
            setDate(new Date(inputDate));
          }
        }}
      />
    ) : (
      <>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={date.toLocaleDateString()}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </>
    );
  };

  const pickEventImage = async () => {
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
      setEventImage(result.assets[0].uri);
    }
  };

  const pickItemImage = async (index) => {
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
      const newItems = [...items];
      newItems[index].image = result.assets[0].uri;
      setItems(newItems);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Event Post for Porter</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text>Start Date</Text>
      {renderDatePicker(
        startDate,
        setStartDate,
        showStartDatePicker,
        setShowStartDatePicker
      )}

      <Text>End Date</Text>
      {renderDatePicker(
        endDate,
        setEndDate,
        showEndDatePicker,
        setShowEndDatePicker
      )}

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="About"
        multiline={true}
        value={about}
        onChangeText={setAbout}
      />

      {/* Event Image Picker Section */}
      <TouchableOpacity onPress={pickEventImage}>
        <View style={styles.imagePicker}>
          {eventImage ? (
            <Image source={{ uri: eventImage }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>
              Tap to select event image
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Items for Porter</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Porter Item {index + 1} of 10</Text>
          <TextInput
            style={styles.itemInput}
            placeholder="Item Name"
            value={item.name}
            onChangeText={(value) => handleItemChange(index, "name", value)}
          />
          <TextInput
            style={styles.itemInput}
            placeholder="Price (THB)"
            keyboardType="numeric"
            value={item.price}
            onChangeText={(value) => handleItemChange(index, "price", value)}
          />
          {/* Item Image Picker Section */}
          <TouchableOpacity onPress={() => pickItemImage(index)}>
            <View style={styles.imagePicker}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <Text style={styles.imagePlaceholder}>
                  Tap to select item image
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
      <Button
        title="Add Item"
        onPress={handleAddItem}
        disabled={items.length >= 10}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemInput: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  imagePicker: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
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

export default CreateEventPostScreen;
