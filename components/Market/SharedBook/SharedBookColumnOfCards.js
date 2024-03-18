import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SharedBookColumnOfCards = ({ cards, onPress, renderEditIcon }) => {
  return (
    <View style={styles.container}>
      {cards.map((book, index) => (
        <Pressable key={index} onPress={() => onPress(book)} style={styles.cardContainer}>
          <Image
            source={require('../../../assets/images/bookcover.png')}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{book.title}</Text>
            {/* <Text style={styles.cardAuthor}>{book.author}</Text> */}
            <Text style={styles.cardText}>{book.aboutBook}</Text>
            {/* <Text style={styles.cardStatus}>{book.status}</Text> */}
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
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#E21E1E',
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  cardAuthor: {
    color: 'white',
  },
  cardText: {
    color: 'white',
  },
  cardStatus: {
    marginTop: 5,
    color: 'white',
  },
  editIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 70,
    marginRight: 10,
  },
});

export default SharedBookColumnOfCards;
