import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { AlertCircle, BellRing, Share2, Shield } from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";
import PropTypes from "prop-types";

const ConsentModal = ({ visible, onConfirm, onCancel }) => {
  const [hasConsent, setHasConsent] = useState(false);

  const consentPoints = [
    {
      icon: Share2,
      title: "Information Sharing",
      description:
        "Helps expand the reach of your report by involving law enforcement and relevant organizations.",
      color: "#2563EB",
    },
    {
      icon: BellRing,
      title: "Public Broadcast",
      description:
        "Ensures quick dissemination of details through push notifications, social media, and SMS alerts.",
      color: "#059669",
    },
    {
      icon: Shield,
      title: "Data Protection",
      description:
        "Provides secure handling of your sensitive information, shared only with trusted parties.",
      color: "#7C3AED",
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white w-full max-w-md rounded-xl p-4`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
            Broadcast Consent
          </Text>

          <ScrollView style={tw`mb-4`}>
            <View style={tw`bg-amber-50 p-3 rounded-lg mb-4`}>
              <View style={tw`flex-row items-start`}>
                <AlertCircle
                  size={20}
                  color="#B45309"
                  style={tw`mr-2 mt-0.5`}
                />
                <Text style={tw`text-amber-800 flex-1`}>
                  Giving your consent to broadcast this report through various
                  channels can help maximize the chances of finding the person,
                  but it is optional, and you may skip this step.
                </Text>
              </View>
            </View>

            {consentPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <View
                  key={index}
                  style={tw`flex-row items-start mb-3 p-3 rounded-lg border border-gray-200`}
                >
                  <Icon size={20} color={point.color} style={tw`mr-3 mt-1`} />
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-bold text-gray-800 mb-1`}>
                      {point.title}
                    </Text>
                    <Text style={tw`text-gray-600`}>{point.description}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View
            style={tw`flex-row items-center justify-between p-3 bg-gray-50 rounded-lg mb-4`}
          >
            <Text style={tw`text-gray-800 font-medium flex-1`}>
              I agree to broadcast this report
            </Text>
            <Switch
              value={hasConsent}
              onValueChange={setHasConsent}
              trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
              thumbColor={hasConsent ? "#2563eb" : "#9ca3af"}
            />
          </View>

          <View style={tw`flex-row`}>
          <TouchableOpacity
  style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
  onPress={() => onConfirm(false)}
>
  <Text style={styles.buttonTextPrimary}>Skip</Text>
</TouchableOpacity>
<TouchableOpacity
  style={[styles.buttonPrimary, tw`flex-1`]}
  onPress={() => onConfirm(true)}
>
  <Text style={styles.buttonTextPrimary}>Continue</Text>
</TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

ConsentModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConsentModal;
