import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

const BookColumnOfCards = ({ cards, onPress }) => {
  return (
    <View style={styles.container}>
      {cards.map((book, index) => (
        <Pressable key={index} onPress={() => onPress(book)} style={{ userSelect: 'auto' }}>
          <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
              <Image source={require('../../assets/images/bookcover.png')} resizeMode="contain" style={styles.bookImage} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{book.title}</Text>
              {/* <Text style={styles.cardAuthor}>{book.author}</Text>
              <Text style={styles.cardText}>{book.aboutBook}</Text> */}
            </View>
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
    padding: 13,
    backgroundColor: '#E21E1E',
    borderRadius: 13,
    width: 153,
    height: 230,
    elevation: 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageContainer: {
    width: '88%',
    height: '72%',
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14.4,
    color: 'white', // Set text color to white
  },
  cardAuthor: {
    color: 'white', // Set text color to white
    fontSize: 12.6,
  },
  cardText: {
    marginTop: 7.2,
    fontSize: 10.8,
    color: 'white', // Set text color to white
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
});

export default BookColumnOfCards;