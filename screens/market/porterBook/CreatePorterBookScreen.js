import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../backend/firebase'; // Import your Firestore instance and Firebase Authentication

const CreatePorterBookScreen = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [about, setAbout] = useState('');
  const [items, setItems] = useState([{ name: '', price: '' }]);

  const handleAddItem = () => {
    if (items.length < 10) {
      setItems([...items, { name: '', price: '' }]);
    }
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      // Get the current user's ID
      const userId = auth.currentUser.uid;

      // Create a new post document in Firebase Firestore
      const docRef = await addDoc(collection(db, 'porterBooks'), {
        title,
        startDate,
        endDate,
        about,
        items,
        createdBy: userId, // Add the user ID to the created by field
      });

      console.log('Porter book post created successfully:', docRef.id);

      // Clear the form data after successfully creating the post
      setTitle('');
      setStartDate('');
      setEndDate('');
      setAbout('');
      setItems([{ name: '', price: '' }]);
    } catch (error) {
      console.error('Error creating porter book post:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Porter Book Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
        <DateTimePicker
          value={this.state.date}
          mode={mode}
          minimumDate={minDate && this.getDate(minDate)}
          maximumDate={maxDate && this.getDate(maxDate)}
          onChange={(event, date) => this.setState({ date })}
        />
      </View>
      <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
        <DateTimePicker
          value={this.state.date}
          mode={mode}
          minimumDate={minDate && this.getDate(minDate)}
          maximumDate={maxDate && this.getDate(maxDate)}
          onChange={(event, date) => this.setState({ date })}
        />
      </View>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="About"
        multiline={true}
        value={about}
        onChangeText={setAbout}
      />
      <Text style={styles.sectionTitle}>Items for Porter</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Porter Item {index + 1} of 10</Text>
          <TextInput
            style={styles.itemInput}
            placeholder="Item Name"
            value={item.name}
            onChangeText={(value) => handleItemChange(index, 'name', value)}
          />
          <TextInput
            style={styles.itemInput}
            placeholder="Price (THB)"
            keyboardType="numeric"
            value={item.price}
            onChangeText={(value) => handleItemChange(index, 'price', value)}
          />
        </View>
      ))}
      <Button title="Add Item" onPress={handleAddItem} disabled={items.length >= 10} />
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePicker: {
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemInput: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default CreatePorterBookScreen;