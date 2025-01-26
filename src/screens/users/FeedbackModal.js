import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
import { X } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";
import styles from "@/styles/styles";

const customStyles = {
  selectedBorder: '#041562',
  defaultBorder: '#D1D5DB' 
};

const emojiRatings = [
  { emoji: "😡", description: "Very Dissatisfied" },
  { emoji: "😕", description: "Dissatisfied" },
  { emoji: "😐", description: "Neutral" },
  { emoji: "🙂", description: "Satisfied" },
  { emoji: "😄", description: "Very Satisfied" },
];

export default function FeedbackModal({ visible, onClose }) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");

  const categories = ["App", "Report", "Police Response", "Support", "Other"];

  const handleSubmit = () => {
    if (rating === 0 || !category || !comment.trim()) {
      alert("Please fill all fields");
      return;
    }
    // TODO: Submit feedback to backend
    console.log({ rating, category, comment });
    onClose();
    // Reset form
    setRating(0);
    setCategory("");
    setComment("");
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
            <Text style={[tw`font-bold`, styles.textLarge]}>
              Give Feedback
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Category Picker */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-lg mb-2`}>Category</Text>
              <View style={tw`border border-gray-300 rounded-lg`}>
                <Picker
                  selectedValue={category}
                  onValueChange={setCategory}
                  style={styles.input}
                >
                  <Picker.Item label="Select a category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-lg mb-3`}>Rating</Text>
              <View style={tw`flex-row justify-center`}>
                {emojiRatings.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setRating(index + 1)}
                    style={tw`mx-2`}
                  >
                    <Text
                      style={[
                        tw`text-2xl p-2 rounded-md`,
                        {
                          borderWidth: rating === index + 1 ? 2 : 1,
                          borderColor: rating === index + 1 ? customStyles.selectedBorder : customStyles.defaultBorder,
                        }
                      ]}
                    >
                      {item.emoji}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
              style={[styles.buttonPrimary, tw`mb-4`]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonTextPrimary}>Submit Feedback</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}