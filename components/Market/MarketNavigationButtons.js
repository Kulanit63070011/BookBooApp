import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const MarketNavigationButtons = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.buttonContainer}>
      <Button containerStyle={styles.button} title="Fyp" onPress={() => navigateTo('Promotion')} titleStyle={styles.buttonTitle}/>
      <Button containerStyle={styles.button} title="PorterBook" onPress={() => navigateTo('AllPorterBook')} titleStyle={styles.buttonTitle}/>
      <Button containerStyle={styles.button} title="SharedBook" onPress={() => navigateTo('AllSharedBook')} titleStyle={styles.buttonTitle}/>
      {/* <Button containerStyle={styles.button} title="fyp" titleStyle={styles.buttonTitle}/> */}
    </View>
  );
};

export default MarketNavigationButtons;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: '30%',
  },
  buttonTitle: {
    fontSize: 14, // กำหนดขนาดตัวอักษร
  },
});