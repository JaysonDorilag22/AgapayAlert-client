import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  X,
  Smartphone,
  AlertTriangle,
  Shield,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";
import showToast from "@/utils/toastUtils";

const categoryOptions = [
  {
    id: "app",
    label: "App",
    icon: (isSelected) => (
      <Smartphone size={20} color={isSelected ? "#ffffff" : "#041562"} />
    ),
  },
  {
    id: "report",
    label: "Report",
    icon: (isSelected) => (
      <AlertTriangle size={20} color={isSelected ? "#ffffff" : "#041562"} />
    ),
  },
  {
    id: "police",
    label: "Police",
    icon: (isSelected) => (
      <Shield size={20} color={isSelected ? "#ffffff" : "#041562"} />
    ),
  },
  {
    id: "support",
    label: "Support",
    icon: (isSelected) => (
      <HelpCircle size={20} color={isSelected ? "#ffffff" : "#041562"} />
    ),
  },
  {
    id: "other",
    label: "Other",
    icon: (isSelected) => (
      <MoreHorizontal size={20} color={isSelected ? "#ffffff" : "#041562"} />
    ),
  },
];

const emojiRatings = [
  { emoji: "😡", description: "Very Dissatisfied", value: 1 },
  { emoji: "😕", description: "Dissatisfied", value: 2 },
  { emoji: "😐", description: "Neutral", value: 3 },
  { emoji: "🙂", description: "Satisfied", value: 4 },
  { emoji: "😄", description: "Very Satisfied", value: 5 },
];

export default function FeedbackModal({ visible, onClose, onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      if (rating === 0 || !category || !comment.trim()) {
        showToast("Please fill all fields");
        return;
      }

      await onSubmit({
        rating: rating, // Already a number from emojiRatings
        category,
        comment: comment.trim(),
      });

      // Form will be reset after successful submission
    } catch (error) {
      showToast(error.message || "Failed to submit feedback");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white w-full rounded-xl p-4 max-h-[90%]`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={[tw`font-bold`, styles.textLarge]}>Give Feedback</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Category Selection */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg mb-3`}>Category</Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {categoryOptions.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.label)}
                    style={[
                      tw`flex-row items-center px-4 py-2 rounded-full`,
                      {
                        backgroundColor:
                          category === cat.label ? "#041562" : "#F3F4F6",
                      },
                    ]}
                  >
                    <View style={tw`mr-2`}>
                      {cat.icon(category === cat.label)}
                    </View>
                    <Text
                      style={[
                        tw`font-medium`,
                        { color: category === cat.label ? "#ffffff" : "#374151" },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating Selection */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg mb-3`}>Rating</Text>
              <View style={tw`flex-row justify-around`}>
                {emojiRatings.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setRating(item.value)}
                    style={tw`items-center`}
                  >
                    <Text
                      style={[
                        tw`text-2xl p-2 rounded-md`,
                        {
                          borderWidth: rating === item.value ? 2 : 1,
                          borderColor:
                            rating === item.value ? "#041562" : "#D1D5DB",
                        },
                      ]}
                    >
                      {item.emoji}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <Text style={tw`text-center mt-3 text-gray-600`}>
                  {emojiRatings.find((item) => item.value === rating)?.description}
                </Text>
              )}
            </View>

            {/* Comment Input */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg mb-2`}>Additional Comment</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-4 text-base`}
                multiline
                numberOfLines={4}
                placeholder="Tell us your experience..."
                value={comment}
                onChangeText={setComment}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.buttonPrimary, loading && tw`opacity-50`]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonTextPrimary}>Submit Feedback</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}