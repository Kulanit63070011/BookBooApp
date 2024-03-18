import { StyleSheet } from 'react-native';

export const createCommunityStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color:'#4542C1'
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: 'blue',
  },
  button: {
    backgroundColor: '#5B42C1',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  bookImageContainer: {
    position: 'relative', // ต้องเป็น 'relative' เพื่อให้ปุ่มใช้ position: 'absolute' ในลูกศรอ้างอิงตำแหน่งมัน
  },
  bookImage: {
    width: 170, 
    height: 200, 
    borderRadius: 30,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#C3C3C3',
    padding: 5, // เพิ่มการเพิ่มขนาดของปุ่มเพื่อให้เห็นรูปร่างกลม
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  addButtonIcon: {
    color: 'white',
    fontSize: 20, // เพิ่มขนาดของ icon เพื่อให้เห็นรูปร่างกลม
    fontWeight:'bold',
  },  
});