import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { myNotificationStyles } from '../../style/user/MyNotificationStyle';

const MyNotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [allSeen, setAllSeen] = useState(false);

  useEffect(() => {
    const sampleNotifications = [
      { id: 1, message: 'You have a new message.', timestamp: '2 hours ago', seen: false },
      { id: 2, message: 'Your post was liked.', timestamp: '1 day ago', seen: false },
      { id: 3, message: 'New updates available for your app.', timestamp: '3 days ago', seen: false },
    ];

    setNotifications(sampleNotifications);
  }, []);

  const renderNotificationItem = ({ item }) => (
    <View style={myNotificationStyles.notificationItem}>
      <Text style={[myNotificationStyles.notificationMessage, item.seen ? myNotificationStyles.seenText : null]}>
        {item.message}
      </Text>
      <Text style={myNotificationStyles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  const markAllAsSeen = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      seen: true,
    }));
    setNotifications(updatedNotifications);
    setAllSeen(true);
  };

  return (
    <SafeAreaView style={myNotificationStyles.container}>
      <View style={myNotificationStyles.contentContainer}>
        <Pressable onPress={markAllAsSeen} style={myNotificationStyles.markAsSeenButton}>
          <Text style={myNotificationStyles.markAsSeenText}>
            {allSeen ? 'All Marked as Seen' : 'Mark All as Seen'}
          </Text>
        </Pressable>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNotificationItem}
          />
        ) : (
          <Text>No notifications available</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyNotificationScreen;