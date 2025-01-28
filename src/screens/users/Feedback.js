import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import { MessageCircle, Star, ChevronRight } from "lucide-react-native";
import {
  createFeedback,
  getMyFeedbacks,
} from "@/redux/actions/feedbackActions";
import FeedbackModal from "./FeedbackModal";
import styles from "@/styles/styles";
import { format } from "date-fns";
import NoDataFound from "@/components/NoDataFound";
import { FeedbackSkeleton } from "@/components/skeletons";
import showToast from "@/utils/toastUtils";
import FeedbackTypeBadges from "@/components/FeedbackTypeBadges";
const CATEGORIES = ["All", "App", "Report", "Police", "Support", "Other"];

export default function Feedback() {
  const dispatch = useDispatch();
  const [showFeedback, setShowFeedback] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { loading, feedbacks, pagination } = useSelector(
    (state) => state.feedback
  );

  const loadFeedbacks = async (
    category = selectedCategory,
    page = 1,
    isNewSearch = false
  ) => {
    try {
      const params = {
        page,
        limit: 10,
        ...(category !== "All" && {
          category: category === "Police" ? "Police" : category,
        }),
        isNewSearch,
      };
      return await dispatch(getMyFeedbacks(params));
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      showToast("Failed to load feedbacks");
    }
  };

  useEffect(() => {
    loadFeedbacks(selectedCategory, 1, true);
  }, []); // Only on mount

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadFeedbacks(selectedCategory, 1, true);
    setRefreshing(false);
  };

  const handleCategorySelect = (category) => {
    if (category !== selectedCategory) {
      setSelectedCategory(category);
      setCurrentPage(1);
      loadFeedbacks(category, 1, true);
    }
  };

  const handleLoadMore = () => {
    if (pagination?.hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadFeedbacks(selectedCategory, nextPage, false);
    }
  };

  const handleSubmitFeedback = async (data) => {
    try {
      const result = await dispatch(createFeedback(data));
      if (result.success) {
        setShowFeedback(false);
        showToast("Feedback submitted successfully");
        loadFeedbacks(selectedCategory, 1);
      } else {
        showToast(result.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showToast("Failed to submit feedback");
    }
  };

  const getRatingDescription = (rating) => {
    switch (rating) {
      case 1:
        return "Very Poor";
      case 2:
        return "Poor";
      case 3:
        return "Average";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "Not Rated";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}
    >
      <View
        style={tw`h-12 w-12 rounded-lg bg-blue-100 mr-3 items-center justify-center`}
      >
        <Star size={24} color="#3B82F6" />
      </View>

      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center mb-1`}>
          <View
            style={[
              tw`rounded-full px-2 py-0.5 mr-2`,
              styles.backgroundColorPrimary,
            ]}
          >
            <Text style={tw`text-white text-xs font-medium`}>
              {item.category === "Police Response" ? "Police" : item.category}
            </Text>
          </View>
          <View style={tw`bg-amber-100 rounded-full px-2 py-0.5 mr-2`}>
            <Text style={tw`text-amber-800 text-xs font-medium`}>
              {getRatingDescription(item.rating)}
            </Text>
          </View>
          <Text style={tw`text-xs text-gray-500`}>
            {format(new Date(item.createdAt), "MMM dd, yyyy 'at' h:mm a")}
          </Text>
        </View>

        <Text style={tw`text-gray-900 font-medium mb-1`} numberOfLines={2}>
          {item.comment}
        </Text>

        {item.adminResponse?.comment && (
          <Text style={tw`text-green-600 text-xs`}>Has Response</Text>
        )}
      </View>

      <ChevronRight size={20} color={styles.colorPrimary} />
    </TouchableOpacity>
  );

  if (loading && !feedbacks?.length) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View>
          <Text style={[tw`font-bold ml-2`, styles.textLarge]}>
            My Feedback
          </Text>
          <FeedbackTypeBadges
            types={CATEGORIES}
            selectedType={selectedCategory}
            onSelectType={handleCategorySelect}
          />
        </View>
        {[...Array(10)].map((_, index) => (
          <FeedbackSkeleton key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
          <View style={tw`flex-row items-center justify-between `}>
            <View style={tw`flex-1`}>
              <Text style={[tw`font-bold ml-2`, styles.textLarge]}>
                My Feedback
              </Text>
            </View>
            <TouchableOpacity
            style={[
              tw`flex-row items-center px-4 py-2 rounded-lg mr-2`,
              styles.backgroundColorPrimary,
            ]}
            onPress={() => setShowFeedback(true)}
          >
            <MessageCircle color="white" size={20} style={tw`mr-2`} />
            <Text style={tw`text-white font-medium`}>Give Feedback</Text>
          </TouchableOpacity>
          </View>
          

      <FeedbackTypeBadges
        types={CATEGORIES}
        selectedType={selectedCategory}
        onSelectType={handleCategorySelect}
      />

      <FlatList
        data={feedbacks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#041562"]}
            progressBackgroundColor="#ffffff"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && (
            <View style={tw`flex-1`}>
              <NoDataFound
                message={
                  selectedCategory && selectedCategory !== "All"
                    ? `No ${
                        selectedCategory?.toLowerCase?.() || ""
                      } feedback found`
                    : "No feedback found"
                }
              />
            </View>
          )
        }
        ListFooterComponent={
          loading && <ActivityIndicator style={tw`py-4`} color="#041562" />
        }
        contentContainerStyle={feedbacks?.length ? tw`pb-20` : tw`flex-1`}
      />

      <FeedbackModal
        visible={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleSubmitFeedback}
        loading={loading}
      />
    </View>
  );
}
