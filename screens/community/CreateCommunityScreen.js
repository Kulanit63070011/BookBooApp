
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../backend/firebase';
import { createCommunityStyles } from '../../style/community/CreateCommunityStyle';

const CreateCommunityScreen = () => {
  const navigation = useNavigation();
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [imageCommu, setImageCommu] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [createdDate, setCreatedDate] = useState('');

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
      <View style={createCommunityStyles.content}>
        <Text style={createCommunityStyles.label}>ประเภท:</Text>
        <TextInput
          style={createCommunityStyles.input}
          value={type}
          onChangeText={(text) => setType(text)}
        />
        <Text style={createCommunityStyles.label}>ชื่อ:</Text>
        <TextInput
          style={createCommunityStyles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={createCommunityStyles.label}>รูปภาพ:</Text>
        <TextInput
          style={createCommunityStyles.input}
          value={imageCommu}
          onChangeText={(text) => setImageCommu(text)}
        />
        <Text style={createCommunityStyles.label}>รายละเอียด:</Text>
        <TextInput
          style={createCommunityStyles.input}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View>
      <Pressable onPress={handleCreateCommunity} style={createCommunityStyles.button}>
        <Text style={createCommunityStyles.buttonText}>สร้างชุมชน</Text>
      </Pressable>
    </View>
  );
};

export default CreateCommunityScreen;