import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

const CommuColumnOfCards = ({ cards, onPress, cardWidth }) => {
  return (
    <View style={styles.container}>
      {cards.map((community, index) => (
        <Pressable key={index} onPress={() => onPress(community)} style={{userSelect: 'auto'}}>
          <View style={styles.cardContainer}>
            <Image source={require('../../assets/images/bookcover.png')} resizeMode="cover" style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{community.name}</Text>
              <Text style={styles.cardText}>{community.description}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor:'white',
  },
  cardContainer: {
    margin: 10, // เพิ่ม margin เพื่อให้การ์ดมีระยะห่างกัน
    padding: 15,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    width: '95%',
    elevation: 2,
    height: 180,
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '30%', // ปรับขนาดของรูปภาพตามที่ต้องการ
    borderRadius: 10, // จัดให้มีขอบโค้งตาม container
    height: '95%',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center', // จัดให้อยู่ตรงกลางแนวตั้ง
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FD1919'
  },
  cardAuthor: {
    color: '#555',
    fontSize: 14,
  },
  cardText: {
    marginTop: 8,
    fontSize: 12,
    color: '#777',
  },
});

export default CommuColumnOfCards;