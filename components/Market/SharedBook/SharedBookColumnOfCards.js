import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

const SharedBookColumnOfCards = ({ cards, onPress, renderEditIcon }) => {
  return (
    <View style={styles.container}>
      {cards.map((book, index) => (
        <Pressable key={index} onPress={() => onPress(book)} style={styles.cardContainer}>
          <Image
            source={{ uri: book.thumbnail }} // ใช้ URL จาก book.thumbnail
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {book.title}
            </Text>
            <Text style={styles.cardText} numberOfLines={2}>
              {book.aboutBook}
            </Text>
          </View>
          {renderEditIcon && (
            <View style={styles.editIconContainer}>
              {renderEditIcon(book)}
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 10, // เพิ่มระยะขอบซ้ายและขวาของ container
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8, // ลดระยะห่างระหว่างการ์ด
    padding: 12,
    backgroundColor: '#E21E1E',
    borderRadius: 8,
    height: 100, // กำหนดความสูงคงที่ของการ์ด
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
  },
  cardText: {
    fontSize: 12,
    color: 'white',
  },
  editIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60, // ขยายความกว้างของรูปเล็กน้อย
    height: 80, // เพิ่มความสูงของรูป
    borderRadius: 5, // มุมโค้งมน
  },
});

export default SharedBookColumnOfCards;
