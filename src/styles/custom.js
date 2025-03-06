import tw from 'twrnc'


// colors
const primary = '#041562';
const secondary = '#11468F';

//action colors
const success = '#22b33a';
const danger = '#FF0000';

//background
const background = '#ffffff';

// disable
const disable = '#e6e8eb';


const font = {
    // Thin variants
    thin: {
        fontFamily: 'Poppins_100Thin'
    },
    thinItalic: {
        fontFamily: 'Poppins_100Thin_Italic'
    },

    // ExtraLight variants
    extraLight: {
        fontFamily: 'Poppins_200ExtraLight'
    },
    extraLightItalic: {
        fontFamily: 'Poppins_200ExtraLight_Italic'
    },

    // Light variants
    light: {
        fontFamily: 'Poppins_300Light'
    },
    lightItalic: {
        fontFamily: 'Poppins_300Light_Italic'
    },

    // Regular variants
    regular: {
        fontFamily: 'Poppins_400Regular'
    },
    regularItalic: {
        fontFamily: 'Poppins_400Regular_Italic'
    },

    // Medium variants
    medium: {
        fontFamily: 'Poppins_500Medium'
    },
    mediumItalic: {
        fontFamily: 'Poppins_500Medium_Italic'
    },

    // SemiBold variants
    semiBold: {
        fontFamily: 'Poppins_600SemiBold'
    },
    semiBoldItalic: {
        fontFamily: 'Poppins_600SemiBold_Italic'
    },

    // Bold variants
    bold: {
        fontFamily: 'Poppins_700Bold'
    },
    boldItalic: {
        fontFamily: 'Poppins_700Bold_Italic'
    },

    // ExtraBold variants
    extraBold: {
        fontFamily: 'Poppins_800ExtraBold'
    },
    extraBoldItalic: {
        fontFamily: 'Poppins_800ExtraBold_Italic'
    },

    // Black variants
    black: {
        fontFamily: 'Poppins_900Black'
    },
    blackItalic: {
        fontFamily: 'Poppins_900Black_Italic'
    }
}

const components = {
    input: tw.style(``, {
        fontFamily: font.light
    })
}


