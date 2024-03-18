import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';

const PromotionColumnOfCards = ({ promotions, onPress }) => {
  return (
    <View style={styles.container}>
      {promotions.map((promotion) => (
        <Pressable
          key={promotion.id}
          onPress={() => onPress(promotion)}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: pressed ? '#CCCCCC' : '#EAEAEA',
            },
          ]}
        >
          <View style={styles.cardContent}>
            <Image
              source={require('../../../assets/images/promotion.png')}
              style={styles.cardImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{promotion.title}</Text>
              <Text style={styles.description}>{promotion.description}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 80, // ปรับขนาดภาพตามความเหมาะสม
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#555',
  },
});

export default PromotionColumnOfCards;