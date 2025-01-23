import { StyleSheet } from 'react-native';

export const myProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 10,
    },
    displayName: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#FDC319'
    },
    email: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    aboutMe: {
        fontSize: 25,
        color: '#4542C1',
        marginBottom: 15,
        fontWeight: 'bold'
    },
    greyButton: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 25,
        marginVertical: 10,
        alignSelf: 'center', // แก้จาก alignself เป็น alignSelf
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 160,
        textAlign: 'center', // เพิ่ม textAlign เพื่อจัดวางข้อความให้ตรงกลาง
    },
});
