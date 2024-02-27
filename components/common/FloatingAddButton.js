import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FloatingButton = ({ targetScreen }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(targetScreen);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, {userSelect: 'auto'}]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = {
  container: {
    position: 'absolute',
    bottom: 70,
    right: 16,
    zIndex: 2,
  },
  button: {
    backgroundColor: 'red',
    width: 80,
    height: 80,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
  },
};

export default FloatingButton;