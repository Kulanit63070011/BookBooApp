import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const BookColumnOfCards = ({ cards, onPress }) => {
  return (
    <View style={styles.container}>
      {cards.map((book, index) => (
        <Pressable key={index} onPress={() => onPress(book)} style={{ userSelect: 'auto' }}>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{book.title}</Text>
            <Text style={styles.cardAuthor}>{book.author}</Text>
            <Text style={styles.cardText}>{book.aboutBook}</Text>
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
    width: 170,
    elevation: 2,
    height: 200,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
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

export default BookColumnOfCards;