import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { db, auth } from '../../../backend/firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import CalendarDetailsModal from '../../../components/Community/Calendar/CalendarDetailsModal';
import { MaterialIcons } from '@expo/vector-icons';
import UserDetailsModal from '../../../components/User/UserDetailsModal';
import { useNavigation } from '@react-navigation/native';
import FloatingCreateCommunityButton from '../../../components/common/FloatingCreateCommunityButton';

const CalendarCommunityScreen = ({ route }) => {
  const navigation = useNavigation();
  const { communityId } = route.params || {};
  const [communityEvents, setCommunityEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [userProfiles, setUserProfiles] = useState({});
  const [isUserDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [selectedPostDetails, setSelectedPostDetails] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [partnerUid, setPartnerUid] = useState(null);

  useEffect(() => {
    const fetchCommunityEvents = async () => {
      try {
        const communityEventsRef = collection(db, 'communities', communityId, 'Calendars');
        const eventsSnapshot = await getDocs(communityEventsRef);
        const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCommunityEvents(eventsData);

        // Fetch user names and images for the 'createdBy' field
        const userIds = eventsData.map(event => event.createdBy);
        const userNamesData = {};
        const userImagesData = {};

        // Fetch user data for each 'createdBy' user
        for (let userId of userIds) {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            userNamesData[userId] = userDoc.data().displayName;
            userImagesData[userId] = userDoc.data().profileImage || 'default_image_url'; // Adjust the field for the user's image
          }
        }
        const userDataPromises = userIds.map(userId =>
          getDoc(doc(db, 'users', userId))
            .then(userDoc => ({ userId, data: userDoc.data() }))
        );
        const userDataResults = await Promise.all(userDataPromises);
        const userProfilesData = userDataResults.reduce((acc, { userId, data }) => {
          acc[userId] = data;
          return acc;
        }, {});

        setUserNames(userNamesData);
        setUserProfiles(userProfilesData);
      } catch (error) {
        console.error('Error fetching community events:', error.message);
      }
    };

    fetchCommunityEvents();
  }, [communityId]);

  useEffect(() => {
    if (selectedPostDetails) {
      const createdBy = selectedPostDetails.createdBy;
      handleSelectUser(createdBy);
    }
  }, [selectedPostDetails]);

  const handleSelectUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      // สมมติว่า 'userProfile' เป็น URL ของรูปภาพผู้ใช้
      setSelectedUser(userData);  // เก็บข้อมูล userData ที่ได้จาก 'users'
      setPartnerUid(userId); // เก็บ userId เพื่อนำไปใช้งาน
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleCreateChatRoom = async (partnerUid) => {
    try {
      navigation.navigate('Chat', { partnerId: partnerUid });
    } catch (error) {
      console.error('Error navigating to chat:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short', // e.g., Mon, Tue
      year: 'numeric',
      month: 'short', // e.g., Jan, Feb
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // e.g., 2:30 PM
    });
  };

  const renderEventItem = ({ item }) => {
    const isOwner = item.createdBy === auth.currentUser?.uid;

    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          setSelectedEvent(item);
          setDetailsModalVisible(true);
        }}
      >
        <View style={styles.eventHeader}>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => { handleSelectUser(item.createdBy); setUserDetailsModalVisible(true); }}
          >
            <Image
              source={{ uri: userProfiles[item.createdBy]?.userImage || 'default_image_url' }}
              style={styles.creatorImage}
            />
            <Text style={styles.creatorName}>{userNames[item.createdBy] || 'Unknown'}</Text>
          </Pressable>
          {isOwner && (
            <Pressable
              style={styles.editButton}
              onPress={() => navigation.navigate('EditCalendar', { communityId, eventId: item.id })}
            >
              <MaterialIcons name="edit" size={24} color="black" />
            </Pressable>
          )}
        </View>

        <Text style={styles.eventName}>{item.name || 'No Name Available'}</Text>
        <Text style={styles.eventDescription}>{item.description || 'No Description Available'}</Text>
        <Text style={styles.timestamp}>
          Start: {formatDateTime(item.startDateTime)} {'\n'}
          {/* Reminder: {formatDateTime(item.reminderDateTime)} */}
        </Text>

        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.eventImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text>No Image Available</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Calendar📅</Text>
      </View>
      <View style={styles.contentContainer}>
        {communityEvents.length > 0 ? (
          <FlatList
            data={communityEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.noEventsText}>No community events available</Text>
        )}
      </View>

      {selectedEvent && (
        <CalendarDetailsModal
          isVisible={isDetailsModalVisible}
          onClose={() => {
            setSelectedEvent(null);
            setDetailsModalVisible(false);
          }}
          event={selectedEvent}
        />
      )}
      <UserDetailsModal
        visible={isUserDetailsModalVisible}
        userDetails={selectedUser}
        partnerUid={partnerUid}
        onClose={() => setUserDetailsModalVisible(false)}
        handleCreateChatRoom={handleCreateChatRoom}
      />
      <FloatingCreateCommunityButton targetScreen="CreateCalendar" communityId={communityId}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#b0ccf5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default CalendarCommunityScreen;