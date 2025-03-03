import { TextBase, Platform } from 'react-native';
import tw from 'twrnc';

// Base colors
const colorPrimary = '#041562';
const colorSecondary = '#11468F';
const colorAccent = '#DA1212';
const colorBackground = '#EEEEEE';
const colorDisabled = '#A9A9A9';
const colorText = '#333333';
const colorWhite = '#FFFFFF';

// System font family based on platform


const styles = {

  fontText:{
    fontFamily: 'BebasNeue_400Regular',
  },

  fontTextSecondary:{
    fontFamily: 'Nunito_400Regular',
  },

  headingTwo:{
    fontSize: 25,
    fontFamily: 'BebasNeue_400Regular',
    color: colorPrimary
  },

  headingOne: {
    fontSize: 80,
    fontFamily: 'BebasNeue_400Regular',
    color: colorPrimary
  },

  backgroundColorPrimary: {backgroundColor: colorPrimary},
  // Container styles
  container: tw.style(`flex-1 justify-center items-center p-4`, { backgroundColor: colorWhite }),

  // Text styles
  textPrimary: tw.style(`text-lg font-bold`, { color: colorPrimary }),
  textSecondary: tw.style(`text-lg font-bold`, { color: colorAccent }),

  // Button styles
  buttonContainer: tw.style(`w-full items-center mt-3`),
  buttonPrimary: tw.style(`p-3 rounded-lg w-full mb-3`, { backgroundColor: colorPrimary, textAlign: 'center' }),
  buttonSecondary: tw.style(`p-3 rounded-lg w-full mb-3`, { backgroundColor: colorSecondary, textAlign: 'center' }),

  buttonTextPrimary: tw.style(`text-center text-base`, { color: colorBackground, fontFamily: 'BebasNeue_400Regular' }), 
  buttonOutline: tw.style(`p-3 rounded-lg w-full mb-3 border`, { borderColor: colorSecondary, backgroundColor: 'transparent', textAlign: 'center' }),
  buttonTextOutline: tw.style(`text-center`, { color: colorSecondary }), 
  // Input styles
  input: tw.style(`w-full p-5 mb-2 mt-2 rounded-lg border text-base`, { borderColor: colorDisabled, backgroundColor: colorWhite, color: colorText, fontFamily: 'Nunito_400Regular' }),
  input2: tw.style(`w-full p-3 mb-2 mt-2 rounded-lg border border-gray-300 bg-white`),
  activeInput: tw.style(`w-full p-3 mb-2 mt-2 rounded-lg border`, { borderColor: '#000000', backgroundColor: '#ffffff', color: '#000000' }),

  buttonDanger: tw`bg-red-600 px-4 py-2 rounded-lg`,
  buttonTextDanger: tw`text-white font-medium text-center`,


  //Text size
  textSmall: tw.style(`text-sm`),
  textMedium: tw.style(`text-sm`),
  TextBase: tw.style(`text-base`),
  textLarge: tw.style(`text-lg`),
  textExtraLarge: tw.style(`text-xl`),


  elevation: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
};

export default styles;