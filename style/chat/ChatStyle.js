import { StyleSheet } from 'react-native';

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 15,
    backgroundColor: '#7C4DD7',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D1C4E9',
  },
  partnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  userMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  partnerMessage: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageTextContainer: {
    maxWidth: '80%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 1,
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#7C4DD7',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  }  
});
