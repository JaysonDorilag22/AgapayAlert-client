import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { MessageCircle } from 'lucide-react-native';
import FeedbackModal from './FeedbackModal';
import styles from '@/styles/styles';

export default function Feedback() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <TouchableOpacity 
        style={[
          tw`flex-row items-center justify-center p-2 rounded-lg self-end`,
          { 
            borderWidth: 2,
            borderColor: '#041562'
          }
        ]}
        onPress={() => setShowFeedback(true)}
      >
        <MessageCircle color="#041562" size={24} style={tw`mr-2`} />
        <Text style={[tw`text-base`, { color: '#041562' }]}>
          Give Feedback
        </Text>
      </TouchableOpacity>

      <FeedbackModal 
        visible={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </View>
  );
}