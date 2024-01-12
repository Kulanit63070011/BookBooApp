// WelcomeStyle.js
import { StyleSheet } from 'react-native';
import { themeColors } from '../../theme'; // Make sure to import themeColors

export const WelcomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 350,
    height: 350,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '70%',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F04B27',
    borderRadius: 20,
    alignSelf: 'center', // Align the button to the center horizontally
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  // Add other styles as needed
});

export default WelcomeStyle;
