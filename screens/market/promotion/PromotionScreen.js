import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import PromotionColumnOfCards from '../../../components/Market/Promotion/PromotionColumnOfCards';
import PromotionDetailsModal from '../../../components/Market/Promotion/PromotionDetailsModal';
import BottomNavigator from '../../../navigation/BottomNavigator';
import { signUpStyles } from '../../../style/user/SignUpStyle';
import FloatingButton from '../../../components/common/FloatingAddButton';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth, } from '../../../backend/firebase';
import { getDocs } from 'firebase/firestore';
// import { analytics } from '../../../backend/firebase';

const PromotionScreen = () => {
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Add state to track admin status

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const promotionsSnapshot = await getDocs(collection(db, 'promotions'));
        const promotionList = [];
        promotionsSnapshot.forEach((doc) => {
          const promotionData = doc.data();
          promotionList.push({
            id: doc.id,
            title: promotionData.title,
            description: promotionData.description,
          });
        });
        setPromotions(promotionList);
      } catch (error) {
        console.error('Error fetching promotions:', error.message);
      }
    };

    fetchPromotions();

    // Check if current user is admin
    const user = auth.currentUser;
    if (user && user.email && user.email.includes('@bookboo.com')) {
      setIsAdmin(true);
    }

    // Subscribe to realtime updates on promotions
    const unsubscribe = onSnapshot(collection(db, 'promotions'), (snapshot) => {
      const updatedPromotions = [];
      snapshot.forEach((doc) => {
        updatedPromotions.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPromotions(updatedPromotions);
    });

    return () => unsubscribe();
  }, []);

  const openPromotionDetails = (promotion) => {
    setSelectedPromotion(promotion);
    setIsModalVisible(true);
    
    // Log event when user opens promotion details
    // analytics().logEvent('promotion_view', {
    //   promotion_id: promotion.id,
    //   promotion_title: promotion.title,
    // });
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={signUpStyles.title}>Promotion/Code</Text>
        </View>
      </SafeAreaView>
      <View style={signUpStyles.contentContainer}>
        <ScrollView>
          <PromotionColumnOfCards promotions={promotions} onPress={openPromotionDetails} />
        </ScrollView>
      </View>
      <BottomNavigator />
      {isAdmin && <FloatingButton targetScreen="CreatePromotion" />}
      <PromotionDetailsModal
        visible={isModalVisible}
        promotion={selectedPromotion}
        onClose={closeModal}
      />
    </View>
  );
};

export default PromotionScreen;