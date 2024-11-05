import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MyCommuColumnOfCards = ({ cards, onPress, onLeave, cardWidth, isOwner }) => {
  return (
    <View style={styles.container}>
      {cards.map((community, index) => (
        <Pressable key={index} onPress={() => onPress(community)}>
          <View style={[styles.cardContainer, { width: cardWidth }]}>
            <View style={styles.rowContainer}>
              <View style={styles.leftContainer}>
                <Image source={require('../../assets/images/bookcover.png')} style={styles.image} />
              </View>
              <View style={styles.rightContainer}>
                {/* ตำแหน่งสำหรับชื่อชุมชน */}
                <Text style={styles.cardTitle}>{community.name.length > 30 ? community.name.substring(0, 30) + '...' : community.name}</Text>
              </View>
            </View>
            {isOwner(community) && (
              <Pressable onPress={() => alert('Edit pressed for ' + community.name)} style={styles.leaveButton}>
                <MaterialIcons name="edit" size={16} color="blue" />
              </Pressable>
            )}
            {!isOwner(community) && (
              <Pressable onPress={() => onLeave(community)} style={[styles.leaveButton, styles.leaveButtonSmall]}>
                <Text style={styles.leaveButtonText}>Leave</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    margin: 10,
    padding: 15,
    backgroundColor: '#E21E1E',
    borderRadius: 10,
    elevation: 2,
    height: 160,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    marginLeft: 10, // ปรับระยะห่างตามต้องการ
  },
  image: {
    width: 50, // ปรับขนาดของรูปภาพตามต้องการ
    height: 70, // ปรับขนาดของรูปภาพตามต้องการ
    borderRadius: 5, // ปรับรูปร่างของรูปภาพตามต้องการ
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  leaveButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  leaveButtonText: {
    color: '#E21E1E',
    fontWeight: 'bold',
  },
  leaveButtonSmall: {
    padding: 5,
    right: 5,
    bottom: 5,
  },
});

export default MyCommuColumnOfCards;
