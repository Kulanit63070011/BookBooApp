import { StyleSheet } from 'react-native';

export const createMyBookStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20, // เพิ่ม paddingTop เพื่อให้ modalContainer ไม่ชิดขอบจนเกินไปด้านบน
    paddingBottom: 20,
  },
  modalContent: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingLeft: 5,
    borderRadius: 15, // ปรับเป็น 15 เพื่อให้โค้งมน
    backgroundColor: '#EAF6FF',
    borderWidth: 1, // เพิ่มเส้นกรอบ
    borderColor: 'blue', // สีเส้นกรอบ
  },
  actionButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  modalImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default createMyBookStyles;
