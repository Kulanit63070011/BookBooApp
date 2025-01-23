import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Image } from 'react-native';
import { chatStyles } from '../../style/chat/ChatStyle';
import { db } from '../../backend/firebase';
import { getAuth } from 'firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, setDoc, query, doc, onSnapshot, orderBy, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ChatScreen = () => {
  const route = useRoute();
  const partnerId = route.params.partnerId;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerAvatar, setPartnerAvatar] = useState('');
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        navigation.navigate('Login');
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!currentUser || !partnerId) return;

    const fetchPartnerData = async () => {
      const partnerDoc = await getDoc(doc(db, 'users', partnerId));
      if (partnerDoc.exists()) {
        setPartnerName(partnerDoc.data().displayName);
        setPartnerAvatar(partnerDoc.data().userImage || '');
      }
    };

    fetchPartnerData();

    // Fetch chat messages from Firestore
    const chatRoomId = [currentUser.uid, partnerId].sort().join('_');
    const messagesQuery = query(
      collection(db, 'chatRooms', chatRoomId, 'messages'),
      orderBy('timestamp')
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => doc.data());
      setMessages(messagesData);
    });

    return unsubscribeMessages;
  }, [currentUser, partnerId]);

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Function to handle sending a message with an image
  const handleSend = async () => {
    if (inputText.trim() || selectedImage) {
      if (!currentUser) {
        console.error('User is not logged in');
        return;
      }

      try {
        const memberId = currentUser.uid;
        const chatRoomId = [memberId, partnerId].sort().join('_'); // Generate chatRoomId

        // Check if the chat room already exists
        const chatRoomDoc = await getDoc(doc(db, 'chatRooms', chatRoomId));

        if (!chatRoomDoc.exists()) {
          console.log('Chat room does not exist, creating a new one');
          // Create a new chat room if it doesn't exist yet
          await setDoc(doc(db, 'chatRooms', chatRoomId), {
            createdAt: new Date().toISOString(),
            participants: [memberId, partnerId],
          });
          console.log('New chat room created with ID:', chatRoomId);
        } else {
          console.log('Chat room already exists, using existing ID:', chatRoomId);
        }

        // Handle image upload and message creation
        let imageUrl = '';
        if (selectedImage) {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          const storageRef = ref(getStorage(), `chatImages/${Date.now()}`);
          await uploadBytes(storageRef, blob);
          imageUrl = await getDownloadURL(storageRef);
        }

        const messageData = {
          text: inputText.trim(),
          senderId: memberId,
          receiverId: partnerId,
          timestamp: new Date().toISOString(),
          imageUrl: imageUrl,
        };

        // Add the message to Firebase
        await addDoc(collection(db, 'chatRooms', chatRoomId, 'messages'), messageData);

        setInputText('');
        setSelectedImage(null);
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
    } else {
      console.error('Input text is empty');
    }
  };

  // Modify the renderItem function to display images
  const renderItem = ({ item }) => {
    const timestamp = new Date(item.timestamp);
    const formattedDate = timestamp.toLocaleDateString('th-TH', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = timestamp.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[chatStyles.messageContainer, item.senderId === currentUser.uid ? chatStyles.userMessage : chatStyles.partnerMessage]}>
        {/* Display partner avatar only if sender is not the current user */}
        {item.senderId !== currentUser.uid && partnerAvatar ? (
          <Image source={{ uri: partnerAvatar || '' }} style={chatStyles.avatar} />
        ) : null}

        <View style={chatStyles.messageTextContainer}>
          <Text style={chatStyles.messageTime}>
            {formattedDate} {formattedTime}
          </Text>

          {/* Display message text */}
          <Text style={chatStyles.messageText}>
            {item.senderId === currentUser.uid
              ? `You: ${item.text || 'No message'}`
              : `${partnerName || 'Partner'}: ${item.text || 'No message'}`}
          </Text>

          {/* Display image if exists */}
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={chatStyles.messageImage} />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={chatStyles.container}>
      <View style={chatStyles.header}>
        {partnerAvatar ? (
          <Image source={{ uri: partnerAvatar }} style={chatStyles.partnerAvatar} />
        ) : null}
        {partnerName ? (
          <Text style={chatStyles.partnerName}>{partnerName}</Text>
        ) : null}
      </View>

      <FlatList
        data={messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))} // Sort by timestamp
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={chatStyles.inputContainer}>
        <TextInput
          style={chatStyles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
        />
        <Pressable style={chatStyles.sendButton} onPress={handleSend}>
          <Text style={chatStyles.sendButtonText}>Send</Text>
        </Pressable>
        <Pressable style={chatStyles.sendButton} onPress={pickImage}>
          <Text style={chatStyles.sendButtonText}>Pick Image</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChatScreen;
