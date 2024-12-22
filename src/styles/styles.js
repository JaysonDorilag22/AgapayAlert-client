import tw from 'twrnc';

// Base colors
const colorPrimary = '#041562';
const colorSecondary = '#11468F';
const colorAccent = '#DA1212';
const colorBackground = '#EEEEEE';
const colorDisabled = '#A9A9A9';
const colorText = '#333333';

const styles = {
  // Container styles
  container: tw.style(`flex-1 justify-center items-center p-4`, { backgroundColor: colorBackground }),

  // Text styles
  textPrimary: tw.style(`text-lg font-bold`, { color: colorPrimary }),
  textSecondary: tw.style(`text-lg font-bold`, { color: colorAccent }),

  // Button styles
  buttonContainer: tw.style(`w-full items-center mt-3`),
  buttonPrimary: tw.style(`p-3 rounded-lg w-full mb-3`, { backgroundColor: colorPrimary, textAlign: 'center' }),
  buttonSecondary: tw.style(`p-3 rounded-lg w-full mb-3`, { backgroundColor: colorAccent, textAlign: 'center' }),

  buttonTextPrimary: tw.style(`text-center`, { color: colorBackground }), 
  buttonOutline: tw.style(`p-3 rounded-lg w-full mb-3 border`, { borderColor: colorPrimary, backgroundColor: 'transparent', textAlign: 'center' }),
  buttonTextOutline: tw.style(`text-center`, { color: colorPrimary }), 
  // Input styles
  input: tw.style(`w-full p-3 mb-2 mt-2 rounded-lg border`, { borderColor: colorDisabled, backgroundColor: colorBackground, color: colorDisabled }),
};

export default styles;