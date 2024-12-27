import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

const TermsModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
      <View style={tw`bg-white w-11/12 p-3 rounded-lg mt-10 mb-10 max-h-150`}>

        <ScrollView>
            <Text style={tw`text-lg font-bold`}>Terms of Service and Privacy Policy</Text>
            <Text style={tw`text-sm`}>
              {'\n\n'}
              <Text style={tw`font-bold`}>1. Terms of Use</Text>
              {'\n\n'}
              Welcome to Agapay Alert! By using this app, you agree to the following terms:
              {'\n\n'}
              <Text style={tw`font-bold`}>Purpose:</Text> Agapay Alert is designed for reporting missing persons and providing safety updates. Users must use this app responsibly and ethically.
              {'\n\n'}
              <Text style={tw`font-bold`}>Accuracy:</Text> You agree to provide accurate and truthful information when submitting reports or updates.
              {'\n\n'}
              <Text style={tw`font-bold`}>Prohibited Actions:</Text> You must not misuse the app by submitting false reports, offensive content, or unauthorized access attempts.
              {'\n\n'}
              <Text style={tw`font-bold`}>2. Privacy Policy</Text>
              {'\n\n'}
              Agapay Alert values your privacy and is committed to protecting your personal data.
              {'\n\n'}
              <Text style={tw`font-bold`}>Data Collection:</Text>
              {'\n\n'}
              We collect information such as your name, contact details, location, and uploaded files (e.g., photos for missing person reports).
              {'\n\n'}
              Your location data may be used to customize alerts within your area.
              {'\n\n'}
              <Text style={tw`font-bold`}>Data Usage:</Text>
              {'\n\n'}
              Your data is used solely for the purpose of managing reports and enhancing community safety.
              {'\n\n'}
              We will never sell or share your personal information with third parties without your consent.
              {'\n\n'}
              <Text style={tw`font-bold`}>Data Security:</Text>
              {'\n\n'}
              All information you provide is securely stored. While we take all necessary precautions, we cannot guarantee 100% security of your data due to risks inherent to digital platforms.
              {'\n\n'}
              <Text style={tw`font-bold`}>User Responsibilities:</Text>
              {'\n\n'}
              Ensure you do not share your account details with others.
              {'\n\n'}
              Immediately report suspicious activity or misuse to our support team.
              {'\n\n'}
              <Text style={tw`font-bold`}>Updates to Terms and Privacy Policy:</Text>
              {'\n\n'}
              We may update these terms from time to time. Users will be notified of significant changes.
              {'\n\n'}
              If you have concerns or questions, please contact us at support@agapayalert.com.
              {'\n\n'}
              <Text style={tw`font-bold`}>1. Mga Tuntunin ng Paggamit</Text>
              {'\n\n'}
              Maligayang pagdating sa Agapay Alert! Sa paggamit ng app na ito, sumasang-ayon ka sa sumusunod:
              {'\n\n'}
              <Text style={tw`font-bold`}>Layunin:</Text> Ang Agapay Alert ay ginawa para sa pagrereport ng mga nawawalang tao at pagbibigay ng safety updates. Gamitin ang app nang responsable at may integridad.
              {'\n\n'}
              <Text style={tw`font-bold`}>Katotohanan:</Text> Sumasang-ayon kang magbigay ng tumpak at totoo na impormasyon sa pag-submit ng reports o updates.
              {'\n\n'}
              <Text style={tw`font-bold`}>Bawal na Gawain:</Text> Ipinagbabawal ang pagpapasa ng pekeng report, hindi kanais-nais na content, o anumang pagtatangkang hindi awtorisadong pag-access sa app.
              {'\n\n'}
              <Text style={tw`font-bold`}>2. Patakaran sa Privacy</Text>
              {'\n\n'}
              Pinapahalagahan ng Agapay Alert ang iyong privacy at nangangakong poprotektahan ang iyong personal na datos.
              {'\n\n'}
              <Text style={tw`font-bold`}>Pagkolekta ng Datos:</Text>
              {'\n\n'}
              Kinokolekta namin ang iyong pangalan, contact details, lokasyon, at mga in-upload na file (e.g., litrato para sa mga ulat ng nawawalang tao).
              {'\n\n'}
              Maaaring gamitin ang iyong lokasyon upang i-customize ang mga alerto sa iyong lugar.
              {'\n\n'}
              <Text style={tw`font-bold`}>Paggamit ng Datos:</Text>
              {'\n\n'}
              Ang iyong datos ay gagamitin lamang para sa pamamahala ng mga ulat at pagpapahusay ng kaligtasan sa komunidad.
              {'\n\n'}
              Hindi namin ibebenta o ibabahagi ang iyong personal na impormasyon sa iba nang walang pahintulot mo.
              {'\n\n'}
              <Text style={tw`font-bold`}>Seguridad ng Datos:</Text>
              {'\n\n'}
              Ang lahat ng impormasyon ay ligtas na iniimbak. Bagama’t ginagawa namin ang lahat ng hakbang para sa proteksyon, hindi namin magagarantiya ang 100% na seguridad ng iyong datos dahil sa mga panganib sa digital platforms.
              {'\n\n'}
              <Text style={tw`font-bold`}>Mga Responsibilidad ng User:</Text>
              {'\n\n'}
              Huwag ipamahagi ang iyong account details sa iba.
              {'\n\n'}
              Iulat kaagad ang kahina-hinalang aktibidad o maling paggamit sa aming support team.
              {'\n\n'}
              <Text style={tw`font-bold`}>Pag-update ng Mga Tuntunin at Patakaran:</Text>
              {'\n\n'}
              Maaaring baguhin ang mga tuntunin mula sa oras-oras. Ang mga user ay aabisuhan sa anumang mahahalagang pagbabago.
              {'\n\n'}
              Kung may mga katanungan, makipag-ugnayan sa amin sa support{" "}
              <Text style={tw`text-blue-500 underline`}>  
              @agapayalert.com.
              </Text>
            </Text>
          <TouchableOpacity onPress={onClose} style={tw`mt-2`}>
            <Text style={tw`text-center text-blue-500`}>Close</Text>
          </TouchableOpacity>
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;