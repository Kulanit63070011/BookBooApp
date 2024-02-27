import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Image, StyleSheet } from 'react-native';
import { chatStyles } from '../../style/chat/ChatStyle';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    setMessages([
      { text: 'สวัสดีครับ', avatar: require('../../assets/images/human.png'), time: '12:01 PM' },
      { text: 'สวัสดีครับ', avatar: require('../../assets/images/human.png'), time: '12:02 PM' },
    ]);
  }, []);

  const handleSend = () => {
    // ในที่นี้คุณสามารถเพิ่มตรรกะที่ต้องการก่อนที่จะส่งข้อความได้
    if (inputText.trim() !== '') {
      const newMessage = { text: inputText, avatar: require('../../assets/images/human.png'), time: getCurrentTime() };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => (
    <View style={chatStyles.messageContainer}>
      {item.avatar && <Image source={item.avatar} style={chatStyles.avatar} />}
      <View style={chatStyles.messageContent}>
        <Text style={chatStyles.messageText}>{item.text}</Text>
        <Text style={chatStyles.timeText}> {item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={chatStyles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <View style={chatStyles.inputContainer}>
        <TextInput
          style={chatStyles.input}
          placeholder="พิมพ์ข้อความ..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <Pressable style={chatStyles.sendButton} onPress={handleSend}>
          <Text style={chatStyles.sendButtonText}>ส่ง</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChatScreen;