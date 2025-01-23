import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native';
import { db } from '../../backend/firebase';
import { collection, query, onSnapshot, orderBy, limit, doc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/common/searchBar';
import BottomNavigator from '../../navigation/BottomNavigator';
import { myBookShelfStyles } from '../../style/bookshelf/MyBookShelfStyle';
import { signUpStyles } from '../../style/user/SignUpStyle';
import { allCommunityStyles } from '../../style/community/AllCommunityStyle';

const AllChatScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchChatRooms(user.uid); // Pass current user's uid
      } else {
        navigation.navigate('Login');
      }
    });

    return unsubscribe;
  }, [navigation]);

  const fetchChatRooms = async (currentUserId) => {
    // Query to find all chat rooms that contain the current user's ID in the room's name (either "userId_partnerId" or "partnerId_userId")
    const chatRoomsQuery = query(collection(db, 'chatRooms'));

    const unsubscribe = onSnapshot(chatRoomsQuery, async (snapshot) => {
      const chatRoomsData = await Promise.all(
        snapshot.docs.map(async (roomDoc) => {
          const roomId = roomDoc.id;
          const [user1, user2] = roomId.split('_');
          
          // Check if the current user is part of this room
          if (user1 === currentUserId || user2 === currentUserId) {
            const partnerId = user1 === currentUserId ? user2 : user1;
            const partnerDoc = await getDoc(doc(db, 'users', partnerId));
            const partnerData = partnerDoc.exists() ? partnerDoc.data() : { displayName: 'Unknown', userImage: '' };

            const lastMessageQuery = query(
              collection(db, 'chatRooms', roomId, 'messages'),
              orderBy('timestamp', 'desc'),
              limit(1)
            );

            const lastMessageSnapshot = await getDocs(lastMessageQuery);
            const lastMessage = lastMessageSnapshot.docs[0]?.data() || { text: 'No messages yet', timestamp: 0 };
            const truncatedMessage = lastMessage.text.length > 50 ? lastMessage.text.slice(0, 50) + '...' : lastMessage.text;

            return {
              id: roomId,
              partnerName: partnerData.displayName,
              partnerAvatar: partnerData.userImage || '',
              lastMessage: truncatedMessage,
            };
          }
          return null;
        })
      );

      setChatRooms(chatRoomsData.filter(Boolean));
      setLoading(false);

      // Log the chat rooms data
      console.log('All Chat Rooms:', chatRoomsData);
    });

    return unsubscribe;
  };

  const handleChatPress = (chatRoom) => {
    const partnerId = chatRoom.id.split('_').find((id) => id !== currentUser.uid);
    navigation.navigate('Chat', { partnerId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={allCommunityStyles.title}>Chat</Text>
        </View>
      </SafeAreaView>
      <View style={[myBookShelfStyles.contentContainer]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <SearchBar />
          <FlatList
            data={chatRooms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleChatPress(item)} style={styles.chatRoomItem}>
                <View style={styles.chatRoomContent}>
                  {item.partnerAvatar ? (
                    <Image source={{ uri: item.partnerAvatar }} style={styles.partnerAvatar} />
                  ) : null}
                  <View style={styles.textContainer}>
                    <Text style={styles.partnerName}>{item.partnerName}</Text>
                    <Text>{item.lastMessage}</Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </ScrollView>
      </View>
      <BottomNavigator style={myBookShelfStyles.bottomNavigator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    backgroundColor: '#4CAF50',
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 70,
  },
  chatRoomItem: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatRoomContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  partnerName: {
    fontWeight: 600,
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  lastMessage: {
    color: '#666666',
    fontSize: 14,
  },
  partnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllChatScreen;
