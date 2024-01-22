import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUpStyles } from '../../style/user/SignUpStyle';
import { auth } from '../../backend/firebase';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';

const EditProfileScreen = ({ route }) => {
  const { user, onClose } = route.params;
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [aboutMe, setAboutMe] = useState(user.aboutMe);

  const handleSaveEdit = async () => {
    if (user.id) {
      const userDocRef = doc(getFirestore(), 'users', user.id);

      try {
        await setDoc(userDocRef, {
          displayName,
          username: username || '',
          email,
          aboutMe,
        });

        // Update the navigation options with the new user data
        navigation.setOptions({
          headerRight: () => (
            <Pressable onPress={() => onSaveUser()}>
              {/* Render your save button or icon */}
              <Text>Save</Text>
            </Pressable>
          ),
        });

        console.log('User data updated in Firestore');
      } catch (error) {
        console.error('Error updating user data in Firestore', error.message);
      }

      onClose();
    }
  };

  const onSaveUser = () => {
    // Your onSave logic here
    console.log('Save user function called');
  };

  const navigation = useNavigation();

  useEffect(() => {
    // Update navigation options when the component mounts
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => onSaveUser()}>
          {/* Render your save button or icon */}
          <Text>Save</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView>
      <Pressable>
        <Image source={require('../../assets/images/human.png')} style={signUpStyles.profileImage} />
      </Pressable>
      <View style={signUpStyles.inputContainer}>
        <View style={{ marginBottom: 20 }}>
          <Text style={signUpStyles.inputLabel}>Display Name</Text>
          <TextInput
            style={signUpStyles.textInput}
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
            placeholder='Enter Name'
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={signUpStyles.inputLabel}>Username</Text>
          <TextInput
            style={signUpStyles.textInput}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder='Enter Username'
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={signUpStyles.inputLabel}>Email Address</Text>
          <TextInput
            style={signUpStyles.textInput}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder='Enter Email'
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={signUpStyles.inputLabel}>About me</Text>
          <TextInput
            style={[signUpStyles.textInput, { height: 80 }]}
            value={aboutMe}
            onChangeText={(text) => setAboutMe(text)}
            placeholder='Enter detail'
            multiline={true}
          />
        </View>
        <View style={{ paddingBottom: 30 }}>
          <Pressable style={signUpStyles.signUpButton} onPress={handleSaveEdit}>
            <Text style={signUpStyles.signUpButtonText}>
              Save Edit
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
