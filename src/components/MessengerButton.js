import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, View, TextInput, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { linkMessengerAccount, unlinkMessengerAccount, getMessengerStatus } from '@/redux/actions/messengerActions';
import { X } from 'lucide-react-native';
import tw from 'twrnc';
import showToast from '@/utils/toastUtils';
import styles from '@/styles/styles';
const MessengerButton = () => {
  const dispatch = useDispatch();
  const { isLinked, loading } = useSelector((state) => state.messenger);
  const [showModal, setShowModal] = useState(false);
  const [psid, setPsid] = useState('');

  // Check Messenger status on mount
  useEffect(() => {
    dispatch(getMessengerStatus());
  }, [dispatch]);

  const handleMessengerConnect = async () => {
    if (isLinked) {
      try {
        const result = await dispatch(unlinkMessengerAccount());
        if (result?.success) {
          showToast('✅ Messenger disconnected');
        }
      } catch (error) {
        console.error('❌ Error unlinking:', error);
        showToast('Failed to disconnect Messenger');
      }
    } else {
      try {
        // Your Facebook page ID
        const fbPageId = '514454438410782';
        const ref = 'welcome'; // Reference parameter for tracking
        const url = `https://m.me/${fbPageId}?ref=${ref}`;
        
        await Linking.openURL(url);
        setShowModal(true);
        showToast('📱 Opening Messenger... Send a message to receive your PSID');
      } catch (error) {
        console.error('❌ Error opening Messenger:', error);
        showToast('Failed to open Messenger');
      }
    }
  };

  const handlePsidSubmit = async () => {
    if (!psid.trim()) {
      showToast('Please enter your PSID');
      return;
    }

    try {
      const result = await dispatch(linkMessengerAccount(psid.trim()));
      if (result?.success) {
        showToast('✅ Messenger connected successfully!');
        setShowModal(false);
        setPsid('');
      } else {
        showToast(result?.error || 'Failed to link Messenger');
      }
    } catch (error) {
      console.error('❌ Error linking:', error);
      showToast('Failed to link Messenger');
    }
  };

  return (
    <>
      <TouchableOpacity 
       style={styles.buttonPrimary}
        onPress={handleMessengerConnect}
        disabled={loading}
      >
        <Text style={styles.buttonTextPrimary}>
          {loading ? 'Loading...' : 
           isLinked ? 'Connected to Messenger ✓' : 
           'Connect to Messenger'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white w-11/12 rounded-lg p-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold`}>Link Messenger Account</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={tw`mb-4 text-gray-600`}>
              1. Send a message to AgapayAlert{'\n'}
              2. Copy the PSID from our response{'\n'}
              3. Paste your PSID below and tap Link
            </Text>

            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
              placeholder="Enter your PSID here"
              value={psid}
              onChangeText={setPsid}
            />

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handlePsidSubmit}
              disabled={!psid.trim() || loading}
            >
              <Text style={styles.buttonTextPrimary}>
                {loading ? 'Linking...' : 'Link Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MessengerButton;