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

const styles = {
  fontText: {
    fontFamily: 'Poppins_500Medium',
  },

  fontTextSecondary: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  headingTwo: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: colorPrimary
  },

  headingOne: {
    fontSize: 25,
    fontFamily: 'Poppins_600SemiBold',
    color: colorPrimary
  },

  backgroundColorPrimary: {backgroundColor: colorPrimary},
  
  // Container styles
  container: tw.style(`flex-1 p-4 items-center`, { 
    backgroundColor: colorWhite,
    fontFamily: 'Poppins_400Regular'
  }),

  // Text styles 
  textPrimary: tw.style(`text-sm`, { 
    color: colorPrimary,
    fontFamily: 'Poppins_600SemiBold'
  }),
  
  textSecondary: tw.style(`text-sm font-bold`, { 
    color: colorAccent,
    fontFamily: 'Poppins_600SemiBold'
  }),

  // Button styles
  buttonContainer: tw.style(`w-full items-center mt-3`, {
    fontFamily: 'Poppins_500Medium'
  }),
  buttonPrimary: tw.style(`p-3 rounded-lg w-full mb-3`, { 
    backgroundColor: colorPrimary, 
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium'
  }),
  buttonSecondary: tw.style(`p-3 rounded-lg w-full mb-3`, { 
    backgroundColor: colorSecondary, 
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium'
  }),

  // Button text styles
  buttonTextPrimary: tw.style(`text-center text-sm p-2`, { 
    color: colorBackground, 
    fontFamily: 'Poppins_500Medium'
  }),
  buttonOutline: tw.style(`p-3 rounded-lg w-full mb-3 border`, { 
    borderColor: colorSecondary, 
    backgroundColor: 'transparent', 
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium'
  }),
  buttonTextOutline: tw.style(`text-center`, { 
    color: colorSecondary, 
    fontFamily: 'Poppins_500Medium'
  }),

  // Input styles
  input: tw.style(`w-full p-5 mb-2 mt-2 rounded-lg border`, { 
    borderColor: colorDisabled, 
    backgroundColor: colorWhite, 
    color: colorText, 
    fontFamily: 'Poppins_400Regular'
  }),
  input2: tw.style(`w-full p-1 mb-2 mt-2 rounded-lg border border-gray-300 bg-white`, {
    fontFamily: 'Poppins_400Regular'
  }),
  activeInput: tw.style(`w-full p-3 mb-2 mt-2 rounded-lg border`, { 
    borderColor: '#000000', 
    backgroundColor: '#ffffff', 
    color: '#000000',
    fontFamily: 'Poppins_400Regular'
  }),

  buttonDanger: tw.style(`bg-red-600 px-4 py-2 rounded-lg`, {
    fontFamily: 'Poppins_500Medium'
  }),
  buttonTextDanger: tw.style(`text-white font-medium text-center`, {
    fontFamily: 'Poppins_500Medium'
  }),

  // Text sizes with Poppins
  textSmall: tw.style(`text-sm`, {
    fontFamily: 'Poppins_400Regular'
  }),
  textMedium: tw.style(`text-sm`, {
    fontFamily: 'Poppins_500Medium'
  }), 
  TextBase: tw.style(`text-base`, {
    fontFamily: 'Poppins_400Regular'
  }),
  textLarge: tw.style(`text-lg`, {
    fontFamily: 'Poppins_500Medium'
  }),
  textExtraLarge: tw.style(`text-xl`, {
    fontFamily: 'Poppins_600SemiBold'
  }),

  elevation: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
};

export default styles;