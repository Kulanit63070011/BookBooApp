import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../backend/firebase';
import { createCommunityStyles } from '../../style/community/CreateCommunityStyle';
import { Picker } from '@react-native-picker/picker';

const CreateCommunityScreen = () => {
  const navigation = useNavigation();
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [imageCommu, setImageCommu] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [createdDate, setCreatedDate] = useState('');

  const filtersData = [
    { category: 'General novels' },
    { category: 'Romantic novels' },
    { category: 'Fantasy novels' },
    { category: 'Sci-fi novels' },
    { category: 'Adventure novels' },
    { category: 'Detective novels' },
    { category: 'Horror novels' },
    { category: 'Serial novels' },
    { category: 'General novels' },
    { category: 'Fantasy novels' },
    { category: 'Sci-fi novels' },
    { category: 'Adventure novels' },
    { category: 'Detective novels' },
    { category: 'Horror novels' },
    { category: 'Serial novels' },

    { category: 'General cartoons' },
    { category: 'Romantic cartoons' },
    { category: 'Fantasy cartoons' },
    { category: 'Sci-fi cartoons' },
    { category: 'Adventure cartoons' },
    { category: 'Detective cartoons' },
    { category: 'Horror cartoons' },
    { category: 'Serial cartoons' },
    { category: 'General cartoons' },
    { category: 'Fantasy cartoons' },
    { category: 'Sci-fi cartoons' },
    { category: 'Adventure cartoons' },
    { category: 'Detective cartoons' },
    { category: 'Horror cartoons' },
    { category: 'Serial cartoons' },

    { category: 'Finance and Investment' },
    { category: 'Market Accounting' },
    { category: 'Psychology' },
    { category: 'Self-Development' },
    { category: 'Education' },
    { category: 'Language' },
    { category: 'Law' },
    { category: 'Creative Design' },
    { category: 'Politics' },
    { category: 'Computer Science' },
    { category: 'History' },
    { category: 'Religious Beliefs' },
    { category: 'Pets' },
    { category: 'Health' },
    { category: 'Travel' },
    { category: 'Music and Entertainment' },
    { category: 'Food' },
    { category: 'Art' },
    { category: 'Others' }
  ];

  const handleCreateCommunity = async () => {
    try {
      const user = auth.currentUser;

      if (!type || !name || !user) {
        alert('Please fill in required information (Type, Name, and Creator)');
        return;
      }

      // Use the user's UID as the creator of the community
      const createdByUser = user.uid;

      // Use the current timestamp as the creation date
      const creationTimestamp = new Date();

      // Use the user's UID as a member of the community
      const membersArray = [createdByUser];

      const communityData = {
        communityId: name,
        type,
        name,
        imageCommu,
        description,
        members: membersArray,
        createdBy: createdByUser,
        createdDate: creationTimestamp,
      };

      const communityDocRef = doc(db, 'communities', name);
      await setDoc(communityDocRef, communityData);

      alert('Community created successfully');

      navigation.navigate('AllCommunity', { refresh: true });
    } catch (error) {
      console.error('Error creating community:', error.message);
    }
  };

  return (
    <View style={createCommunityStyles.container}>
      <View style={createCommunityStyles.bookImageContainer}>
        <Image source={require('../../assets/images/commuImg.png')} resizeMode="contain" style={createCommunityStyles.bookImage} />
        <Pressable style={createCommunityStyles.addButton}>
          <Text style={createCommunityStyles.addButtonIcon}>+</Text>
        </Pressable>
      </View>
      <View style={createCommunityStyles.content}>
        <Text style={createCommunityStyles.label}>Community Type:</Text>
        {Platform.OS === 'ios' ? (
          <View style={createCommunityStyles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              style={createCommunityStyles.picker}
            >
              {filtersData.map((filter, index) => (
                <Picker.Item label={filter.category} value={filter.category} key={index} color="#000000" />
              ))}
            </Picker>
          </View>
        ) : (
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            style={createCommunityStyles.input}
          >
            {filtersData.map((filter, index) => (
              <Picker.Item label={filter.category} value={filter.category} key={index} color="#000000" />
            ))}
          </Picker>
        )}
        <Text style={createCommunityStyles.label}>Community Name:</Text>
        <TextInput
          style={createCommunityStyles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={createCommunityStyles.label}>Image:</Text>
        <TextInput
          style={createCommunityStyles.input}
          value={imageCommu}
          onChangeText={(text) => setImageCommu(text)}
        />
        <Text style={createCommunityStyles.label}>Detail:</Text>
        <TextInput
          style={[createCommunityStyles.input, { height: 80 }]}
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline={true}
          numberOfLines={4}
        />
      </View>
      <Pressable onPress={handleCreateCommunity} style={createCommunityStyles.button}>
        <Text style={createCommunityStyles.buttonText}>Create</Text>
      </Pressable>
    </View>
  );
};

export default CreateCommunityScreen;
