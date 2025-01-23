import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateDoc, doc, getDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../../backend/firebase';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from "react-datepicker"; // For 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditPorterBookScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [about, setAbout] = useState('');
  const [items, setItems] = useState([{ name: '', price: '', itemImage: null }]);
  const [eventImage, setEventImage] = useState(null);  // For event image
  const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        console.log("Received post data from route params:", post);
        const postDoc = await getDoc(doc(db, 'events', post.id));
        if (postDoc.exists()) {
          const postData = postDoc.data();

          const fetchedStartDate = postData.startDate ? new Date(postData.startDate.seconds * 1000) : null;
          const fetchedEndDate = postData.endDate ? new Date(postData.endDate.seconds * 1000) : null;

          setStartDate(fetchedStartDate instanceof Date && !isNaN(fetchedStartDate) ? fetchedStartDate : new Date());
          setEndDate(fetchedEndDate instanceof Date && !isNaN(fetchedEndDate) ? fetchedEndDate : new Date());

          setTitle(postData.title || '');
          setAbout(postData.about || '');

          // Set event image URL
          setEventImage(postData.eventImage || null);

          const itemsSnapshot = await getDocs(collection(db, `events/${post.id}/items`));
          const fetchedItems = itemsSnapshot.docs.map(doc => doc.data());
          setItems(fetchedItems);
        }
      } catch (error) {
        console.error('Error fetching post data:', error.message);
      }
    };

    fetchPostData();
  }, [post]);

  const handleAddItem = () => {
    if (items.length < 10) {
      setItems([...items, { name: '', price: '', itemImage: null }]);
    } else {
      Alert.alert("Limit Reached", "You can add up to 10 items only.");
    }
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
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
      setEventImage(result.assets[0].uri);  // Update event image URL
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
      newItems[index].itemImage = result.assets[0].uri;
      setItems(newItems);
    }
  };

  const handleSubmit = async () => {
    try {
      // Upload event image if there is one
      let eventImageUrl = null;
      if (eventImage) {
        eventImageUrl = await uploadEventImage(eventImage);
      }

      // Update the event document in Firestore
      await updateDoc(doc(db, 'events', post.id), {
        title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        about,
        eventImage: eventImageUrl || post.eventImage,
      });

      // Get reference to the items subcollection
      const itemsCollectionRef = collection(db, `events/${post.id}/items`);

      // Delete all existing items before adding new ones
      const existingItemsSnapshot = await getDocs(itemsCollectionRef);
      existingItemsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);  // Delete each item
      });

      // Add the updated items
      for (const [index, item] of items.entries()) {
        if (item.name && item.price) {
          let itemImageUrl = null;
          if (item.itemImage) {
            itemImageUrl = await uploadItemImage(item.itemImage, index);
          }
          // Add item to the items subcollection
          await addDoc(itemsCollectionRef, {
            name: item.name,
            price: item.price,
            itemImage: itemImageUrl || item.itemImage,  // Use old item image if no new one is selected
          });
        }
      }

      // Display success message and navigate back
      Alert.alert("Success", "Porter book updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error('Error updating porter book post:', error.message);
      Alert.alert("Error", "Could not save changes. Please try again.");
    }
  };

  const renderDatePicker = (currentDate, onDateChange, field) => {
    return Platform.OS === 'web' ? (
      <DatePicker
        selected={currentDate}
        onChange={(date) => onDateChange(date)}
        dateFormat="yyyy-MM-dd"
        className="custom-datepicker"
      />
    ) : (
      <>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker((prev) => ({ ...prev, [field]: true }))}
        >
          <MaterialIcons name="calendar-today" size={24} color="#4CAF50" />
          <Text style={styles.dateText}>
            {field === 'start' ? `Start Date: ${currentDate.toDateString()}` : `End Date: ${currentDate.toDateString()}`}
          </Text>
        </TouchableOpacity>
        {showDatePicker[field] && (
          <DateTimePicker
            value={currentDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker((prev) => ({ ...prev, [field]: false }));
              if (date) onDateChange(date);
            }}
            maximumDate={new Date()}
          />
        )}
      </>
    );
  };

  const uploadItemImage = async (uri, itemIndex) => {
    if (!uri) return null;

    setUploading(true);
    try {
      let imageUri = uri;

      // Check if it's a local file or a URL
      if (uri.startsWith('file://')) {
        imageUri = uri; // Local file, no need for fetch
      } else {
        const response = await fetch(uri); // Fetch remote image
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        imageUri = await response.blob(); // Convert to blob
      }

      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `itemImages/${post.id}/${itemIndex}_${Date.now()}`);
      await uploadBytes(imageRef, imageUri);
      const downloadURL = await getDownloadURL(imageRef); // Get the download URL

      setUploading(false);
      return downloadURL;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading item image:", error.message);
      Alert.alert("Error uploading image. Please try again.");
      return null;
    }
  };

  const uploadEventImage = async (uri) => {
    if (!uri) return null;

    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob(); // Convert the file into a blob
      const imageRef = ref(storage, `eventImages/${post.id}/${Date.now()}`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      setUploading(false);
      return downloadURL;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading event image:", error.message);
      Alert.alert("Error uploading image. Please try again.");
      return null;
    }
  };

  const handleDelete = async () => {
    try {
      const eventRef = doc(db, 'events', post.id);
      await deleteDoc(eventRef); // Delete the main event document

      // Optionally, delete all related items in the subcollection
      const itemsSnapshot = await getDocs(collection(db, `events/${post.id}/items`));
      itemsSnapshot.forEach(async (itemDoc) => {
        await deleteDoc(itemDoc.ref);
      });

      Alert.alert("Success", "Event deleted successfully!");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error deleting event:", error.message);
      Alert.alert("Error", "Could not delete the event. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Porter Book</Text>

      <Text style={styles.label}>Event Image</Text>
      <TouchableOpacity onPress={pickEventImage}>
        <View style={styles.imagePicker}>
          {eventImage ? (
            <Image source={{ uri: eventImage }} style={styles.image} resizeMode="cover" />
          ) : (
            <Text style={styles.imagePlaceholder}>Select Event Image</Text>
          )}
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Start Date</Text>
      {renderDatePicker(startDate, setStartDate, 'start')}

      <Text style={styles.label}>End Date</Text>
      {renderDatePicker(endDate, setEndDate, 'end')}

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Event Description"
        multiline={true}
        value={about}
        onChangeText={setAbout}
      />

      <Text style={styles.sectionTitle}>Items for Porter</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
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
              {item.itemImage ? (
                <Image source={{ uri: item.itemImage }} style={styles.image} resizeMode="cover" />
              ) : (
                <Text style={styles.imagePlaceholder}>Select Item Image</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={handleAddItem} style={styles.addItemButton}>
        <Text style={styles.addItemText}>+ Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  dateButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dateText: { marginLeft: 10, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  itemContainer: { marginBottom: 20 },
  itemInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5 },
  imagePicker: { borderWidth: 1, borderColor: '#ccc', height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { textAlign: 'center', color: '#ccc' },
  addItemButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginBottom: 20 },
  addItemText: { textAlign: 'center', color: 'white', fontSize: 16 },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5 },
  saveButtonText: { textAlign: 'center', color: 'white', fontSize: 16 },
  deleteButton: { backgroundColor: 'red', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10, },
  deleteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
});

export default EditPorterBookScreen;