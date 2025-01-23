import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from "../../../backend/firebase"; // เพิ่มการ import จาก firebase
import { doc, getDoc } from '../../../backend/firebase';

const PromotionColumnOfCards = ({ promotions, onPress }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();

  // ฟังก์ชันตรวจสอบว่า user เป็น admin หรือไม่
  const checkUserRole = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setIsAdmin(userDoc.data().role === "admin");
      }
    }
  };

  useEffect(() => {
    checkUserRole(); // เรียกใช้เมื่อคอมโพเนนต์ถูกโหลด
  }, []);

  const navigateToEdit = (promotionId) => {
    navigation.navigate('EditPromotion', { promotionId });
  };

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
              source={promotion.promotionImage ? { uri: promotion.promotionImage } : require('../../../assets/images/promotion.png')}
              style={styles.cardImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {promotion.title}
              </Text>
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                {promotion.description}
              </Text>
            </View>
            {isAdmin && (
              <Pressable
                style={styles.editButton}
                onPress={() => navigateToEdit(promotion.id)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  card: {
    height: 100, // Fixed height for the card
    padding: 10,
    marginBottom: 10,
    borderRadius: 10, // Rounded corners for better aesthetics
    flexDirection: 'row', // Arrange image and text side by side
    alignItems: 'center', // Center align items vertically
    elevation: 3, // Add shadow for a slight 3D effect
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
    position: 'relative', // Required to position the edit button
  },
  cardImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#F0F0F0', // Fallback background color
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 18, // Adjust line height for better readability
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'gray',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PromotionColumnOfCards;
