// MyBookShelfStyle.js
import { StyleSheet } from 'react-native';
import { themeColors } from '../../theme';

export const myBookShelfStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 40,
    padding: 6,
    fontWeight: 'bold',
  },
  header: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingStart: 20,
  },
  bookInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#CEE3F3',
    color: 'black',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  subheader: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  bottomNavigator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
