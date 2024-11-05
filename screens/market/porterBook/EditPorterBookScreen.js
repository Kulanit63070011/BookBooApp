import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../backend/firebase'; // Import your Firestore instance

const EditPorterBookScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [about, setAbout] = useState('');
  const [items, setItems] = useState([{ name: '', price: '' }]);

  useEffect(() => {
    // Fetch data of the post to be edited from Firestore
    console.log(post)
    const fetchPostData = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'porterBooks', post.id));
        if (postDoc.exists()) { // เพิ่มการตรวจสอบว่าเอกสารมีอยู่จริงหรือไม่
          const postData = postDoc.data();
          setTitle(postData.title);
          setStartDate(postData.startDate);
          setEndDate(postData.endDate);
          setAbout(postData.about);
          setItems(postData.items);
        } else {
          console.error('Post document does not exist');
        }
      } catch (error) {
        console.error('Error fetching post data:', error.message);
      }
    };

    fetchPostData();
  }, [post]);


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
      // Update the post data in Firestore
      await updateDoc(doc(db, 'porterBooks', post.id), {
        title,
        startDate,
        endDate,
        about,
        items,
      });

      console.log('Porter book post updated successfully');

      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating porter book post:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Porter Book Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.datePickerContainer}>
        <Text>Start Date:</Text>
        <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
          <DateTimePicker
            value={this.state.date}
            mode={mode}
            minimumDate={minDate && this.getDate(minDate)}
            maximumDate={maxDate && this.getDate(maxDate)}
            onChange={(event, date) => this.setState({ date })}
          />
        </View>
      </View>
      <View style={styles.datePickerContainer}>
        <Text>End Date:</Text>
        <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
          <DateTimePicker
            value={this.state.date}
            mode={mode}
            minimumDate={minDate && this.getDate(minDate)}
            maximumDate={maxDate && this.getDate(maxDate)}
            onChange={(event, date) => this.setState({ date })}
          />
        </View>
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

export default EditPorterBookScreen;