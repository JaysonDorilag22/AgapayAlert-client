import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image  } from "react-native";
import {
  AlertCircle,
  PhoneCall,
  Bell,
  Shield,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react-native";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getUserDetails } from "@/redux/actions/userActions";
import UserInfoSkeleton from "@/components/skeletons/UserInfoSkeleton";
import styles from "@/styles/styles";

const ConfirmationModal = ({ onNext }) => {
  const { user, loading } = useSelector((state) => state.user || {});
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getUserDetails(authUser._id));
    }
  }, [dispatch, authUser]);

  const reminders = [
    {
      icon: CheckCircle2,
      title: "Provide Accurate Information:",
      description:
        "Ensure details like the location, time, and description of the incident are correct",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      iconColor: "#059669",
    },
    {
      icon: AlertCircle,
      title: "Avoid False Reports:",
      description:
        "False or misleading reports can delay real emergencies—always be truthful",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "#DC2626",
    },
    {
      icon: Shield,
      title: "Include Visual Evidence:",
      description:
        "Attach photos or videos if possible to help assess the situation better",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "#2563EB",
    },
    {
      icon: Bell,
      title: "Stay Calm and Clear:",
      description: "Use simple, concise language to describe the incident",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      iconColor: "#7C3AED",
    },
    {
      icon: PhoneCall,
      title: "Follow Up:",
      description:
        "Expect calls from authorities and monitor the app for updates",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      iconColor: "#D97706",
    },
  ];

  const renderUserInfo = () => {
    if (loading) {
      return <UserInfoSkeleton />;
    }

    return (
      <View style={tw`bg-white rounded-lg p-3 mb-4 border border-gray-200`}>
        <View style={tw`flex-row items-center mb-4`}>
          <Image
            source={{
              uri: user?.avatar?.url || "https://via.placeholder.com/150",
            }}
            style={tw`w-20 h-20 rounded-full mr-3`}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`${styles.TextBase} font-bold`}>
              {user?.firstName?.charAt(0).toUpperCase() +
                user?.firstName?.slice(1)}{" "}
              {user?.lastName?.charAt(0).toUpperCase() +
                user?.lastName?.slice(1)}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Mail size={16} color="#6B7280" style={tw`mr-2`} />
              <Text style={styles.textSmall}>{user?.email}</Text>
            </View>
            <View style={tw`flex-row items-center mt-1`}>
              <Phone size={16} color="#6B7280" style={tw`mr-2`} />
              <Text style={styles.textSmall}>{user?.number}</Text>
            </View>
            <View style={tw`flex-row items-center mt-1`}>
              <MapPin size={16} color="#6B7280" style={tw`mr-2`} />
              <Text style={styles.textSmall}>
                {user?.address?.streetAddress}, Brgy. {user?.address?.barangay}, {"\n"}
                {user?.address?.zipCode}, {user?.address?.city} City
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={tw`flex-row items-center bg-red-50 p-3 rounded-lg`}>
          <AlertCircle color="#EF4444" size={20} style={tw`mr-2`} />
          <Text style={tw`${styles.textSmall} text-red-600 text-justify`}>
            Please ensure all your information above is correct before
            proceeding. You can edit your profile information from the Profile
            tab.
          </Text>
        </View> */}
      </View>
    );
  };

  return (
    <View style={tw`flex-1 justify-between p-2`}>
        {renderUserInfo()}
        <View style={tw`rounded-lg p-3 mb-4 border border-gray-200`}>
          <Text style={tw`${styles.textLarge} font-bold mb-4`}>
            Important Reminders
          </Text>
          {reminders.map((reminder, index) => {
            const Icon = reminder.icon;
            return (
              <View
                key={index}
                style={tw`flex-row items-start mb-3 ${
                  reminder.bgColor
                } p-2 rounded-lg ${
                  index === reminders.length - 1 ? "mb-0" : ""
                }`}
              >
                <Icon
                  color={reminder.iconColor}
                  size={20}
                  style={tw`mr-2 mt-0.5`}
                />
                <Text
                  style={tw`${reminder.textColor} text-sm flex-1 text-justify`}
                >
                  <Text style={tw`font-bold`}>{reminder.title}</Text>{" "}
                  {reminder.description}
                </Text>
              </View>
            );
          })}
        </View>

      <TouchableOpacity style={styles.buttonPrimary} onPress={onNext}>
        <Text style={styles.buttonTextPrimary}>I Understand, Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

ConfirmationModal.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default ConfirmationModal;
