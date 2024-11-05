import React, { useState } from 'react';
import { View, Text, Pressable, Image, TextInput, ScrollView, Alert, CheckBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signUpStyles } from '../../style/user/SignUpStyle';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../backend/firebase';
import { setDoc, doc } from 'firebase/firestore';

export default function PorterSignUpScreen() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = async () => {
    if (!termsAccepted) {
      Alert.alert("Please accept the terms and conditions.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const userDocRef = doc(db, 'users', userId);
      const bookshelfId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await setDoc(userDocRef, {
        displayName,
        username,
        email,
        aboutMe,
        bookshelfId,
        role: 'porter', // ตั้งค่า role เป็น 'porter'
      });

      Alert.alert('Sign up successful');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign up failed', error.message);
      Alert.alert('Sign up failed', error.message);
    }
  };

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={signUpStyles.title}>Porter Registration</Text>
        </View>
      </SafeAreaView>
      <ScrollView style={signUpStyles.contentContainer}>
        <Pressable>
          <Image source={require('../../assets/images/human.png')} style={signUpStyles.profileImage} />
        </Pressable>
        <View style={signUpStyles.inputContainer}>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Display Name</Text>
            <TextInput
              style={signUpStyles.textInput}
              value={displayName}
              placeholder='Enter Name'
              onChangeText={(text) => setDisplayName(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Username</Text>
            <TextInput
              style={signUpStyles.textInput}
              value={username}
              placeholder='Enter Username'
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Email Address</Text>
            <TextInput
              style={signUpStyles.textInput}
              value={email}
              placeholder='Enter Email'
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Password</Text>
            <TextInput
              style={signUpStyles.textInput}
              secureTextEntry
              value={password}
              placeholder='Enter Password'
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>Password Confirm</Text>
            <TextInput
              style={signUpStyles.textInput}
              secureTextEntry
              value={passwordConfirm}
              placeholder='Enter Password'
              onChangeText={(text) => setPasswordConfirm(text)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={signUpStyles.inputLabel}>About me</Text>
            <TextInput
              style={[signUpStyles.textInput, { height: 80 }]}
              multiline={true}
              value={aboutMe}
              placeholder='Enter detail'
              onChangeText={(text) => setAboutMe(text)}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <CheckBox value={termsAccepted} onValueChange={setTermsAccepted} />
            <Text style={{ marginLeft: 10 }}>I accept the terms and conditions</Text>
          </View>
          <View style={{ paddingBottom: 30 }}>
            <Pressable style={signUpStyles.signUpButton} onPress={handleSignUp}>
              <Text style={signUpStyles.signUpButtonText}>
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
