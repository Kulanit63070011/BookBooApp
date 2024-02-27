import React, { useState } from 'react';
import { View, Text, Pressable, Image, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { signUpStyles } from '../../style/user/SignUpStyle';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../backend/firebase';
import { auth } from '../../backend/firebase';
import { setDoc, doc } from 'firebase/firestore';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  const handleSignUp = async () => {
    try {
      // สร้างผู้ใช้ใน Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // ดึง UID ของผู้ใช้ที่สร้างมา
      const userId = userCredential.user.uid;
      // บันทึกข้อมูลผู้ใช้ใน Firestore
      const userDocRef = doc(db, 'users', userId); // ปรับให้ใช้ doc และเพิ่มระบุ collection
       // Generate a unique bookshelf ID for the user
      const generateUniqueBookshelfId = () => {
        // Return the generated ID
        return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      const bookshelfId = generateUniqueBookshelfId();
      await setDoc(userDocRef, {
        displayName,
        username,
        email,
        aboutMe,
        bookshelfId,
      });
      alert('Sign up successful');
      navigation.navigate('Login')
      console.log(db);
      // ทำสิ่งที่ต้องการหลังจากการลงทะเบียน
    } catch (error) {
      console.error('Sign up failed', error.message);
      // จัดการข้อผิดพลาด
    }
  }
  
  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={signUpStyles.title}>Register</Text>
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
          <View style={[signUpStyles.socialButtonContainer, { marginBottom: 20 }]}>
            <Pressable style={signUpStyles.socialButton}>
              <Image source={require('../../assets/icons/google.png')} style={signUpStyles.socialButtonImage} />
            </Pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'center', spaceX: 12 }}>
              <Pressable style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 20 }}>
                <Image source={require('../../assets/icons/apple.png')} style={{ width: 40, height: 40 }} />
              </Pressable>
            </View>
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
  )
}