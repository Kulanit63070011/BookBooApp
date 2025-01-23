import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db, auth, storage } from "../../../backend/firebase";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker"; // For web
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

const CreateEventPostScreen = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [about, setAbout] = useState("");
  const [items, setItems] = useState([{ name: "", price: "", image: null }]);
  const [eventImage, setEventImage] = useState(null);

  const handleAddItem = () => {
    if (items.length < 10) {
      setItems([...items, { name: "", price: "", image: null }]);
    }
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const uploadImage = async (uri, path) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser.uid;
      const eventData = {
        title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        about,
        createdBy: userId,
      };

      let eventImageUrl = null;
      if (eventImage) {
        eventImageUrl = await uploadImage(eventImage, `eventImages/${userId}/${Date.now()}`);
      }

      const eventDocRef = await addDoc(collection(db, "events"), {
        ...eventData,
        eventImage: eventImageUrl,
      });

      for (const item of items) {
        if (item.name && item.price) {
          let itemImageUrl = null;
          if (item.image) {
            itemImageUrl = await uploadImage(item.image, `itemImages/${userId}/${Date.now()}`);
          }
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
      setItems([{ name: "", price: "", image: null }]);
      setEventImage(null);
    } catch (error) {
      console.error("Error creating event post:", error.message);
    }
  };

  const renderDatePicker = (date, setDate, showDatePicker, setShowDatePicker, field) => {
    return Platform.OS === "web" ? (
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="yyyy-MM-dd"
        className="custom-datepicker"
      />
    ) : (
      <>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={date.toLocaleDateString()}
            editable={true}  // Allow editing of the date manually
            onChangeText={(text) => {
              const inputDate = new Date(text);
              if (!isNaN(inputDate.getTime())) {
                setDate(inputDate);
              }
            }}
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Start Date</Text>
      {renderDatePicker(startDate, setStartDate, showStartDatePicker, setShowStartDatePicker, 'start')}

      <Text style={styles.label}>End Date</Text>
      {renderDatePicker(endDate, setEndDate, showEndDatePicker, setShowEndDatePicker, 'end')}

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Event Description"
        multiline={true}
        value={about}
        onChangeText={setAbout}
      />

      {/* Event Image Picker */}
      <TouchableOpacity onPress={pickEventImage}>
        <View style={styles.imagePicker}>
          {eventImage ? (
            <Image source={{ uri: eventImage }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Select Event Image</Text>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Items for Porter</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Item {index + 1}</Text>
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
          <TouchableOpacity onPress={() => pickItemImage(index)}>
            <View style={styles.imagePicker}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <Text style={styles.imagePlaceholder}>Select Item Image</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 15,
    color: "#444",
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
  },
  itemInput: {
    width: "100%",
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  imagePicker: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    color: "#888",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default CreateEventPostScreen;