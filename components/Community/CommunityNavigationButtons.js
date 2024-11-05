import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const CommunityNavigationButtons = () => {
    const navigation = useNavigation();

    const navigateTo = (screen) => {
        navigation.navigate(screen);
    };

    return (
        <View style={styles.buttonContainer}>
            <Button containerStyle={styles.button} title="Find Community" onPress={() => navigateTo('AllCommunity')} titleStyle={styles.buttonTitle} />
            <Button containerStyle={styles.button} title="My Community" onPress={() => navigateTo('MyCommunity')} titleStyle={styles.buttonTitle} />
        </View>
    );
};

export default CommunityNavigationButtons;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    button: {
        marginHorizontal: 5, // เพิ่ม margin ทั้งซ้ายและขวา เพื่อให้ปุ่มห่างกันมากขึ้น
    },
    buttonTitle: {
        fontSize: 14,
    },
});  