// CalendarCommunityScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { calendarCommuStyles } from '../../../style/community/calendar/CalendarCommuStyle';
import CalendarDetailsModal from '../../../components/Community/Calendar/CalendarDetailsModal';

const CalendarCommunityScreen = () => {
  const [communityEvents, setCommunityEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    const sampleCommunityEvents = [
      { id: 1, eventName: 'Event 1', timestamp: new Date('2023-01-20T08:00:00') },
      { id: 2, eventName: 'Event 2', timestamp: new Date('2023-02-15T15:30:00') },
      { id: 3, eventName: 'Event 3', timestamp: new Date('2023-03-10T18:45:00') },
    ];

    // Sort events by timestamp in ascending order
    const sortedEvents = sampleCommunityEvents.sort(
      (eventA, eventB) => eventA.timestamp - eventB.timestamp
    );

    setCommunityEvents(sortedEvents);
  }, []);

  const renderEventItem = ({ item }) => (
    <Pressable
      style={calendarCommuStyles.card}
      onPress={() => {
        setSelectedEvent(item);
        setDetailsModalVisible(true);
      }}
    >
      <Text style={calendarCommuStyles.eventName}>{item.eventName}</Text>
      <Text style={calendarCommuStyles.timestamp}>{item.timestamp.toDateString()}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={calendarCommuStyles.container}>
      <View style={calendarCommuStyles.header}>
        <Text style={calendarCommuStyles.title}>CalendarCommunity</Text>
      </View>
      <View style={calendarCommuStyles.contentContainer}>
        {communityEvents.length > 0 ? (
          <FlatList
            data={communityEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
          />
        ) : (
          <Text>No community events available</Text>
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
    </SafeAreaView>
  );
};

export default CalendarCommunityScreen;