import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Search, Clock, MapPin, User } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchPublicReports } from "@/redux/actions/reportActions";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import styles from "@/styles/styles";
import NoDataFound from "@/components/NoDataFound";

const RECENT_SEARCHES_KEY = "@recent_searches";
const MAX_RECENT_SEARCHES = 5;

export default function SearchScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  const { reports = [], loading: searchLoading } = useSelector((state) => state.report.publicSearchResults || {});

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearch = async (query) => {
    try {
      let searches = [...recentSearches];
      searches = searches.filter((item) => item !== query);
      searches.unshift(query);
      searches = searches.slice(0, MAX_RECENT_SEARCHES);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
  
    setLoading(true);
    try {
      // Clear previous results first
      dispatch({
        type: "SEARCH_PUBLIC_REPORTS_REQUEST" // Use the request action instead
      });
  
      const result = await dispatch(searchPublicReports({ 
        searchQuery: query,
        isNewSearch: true // Add this flag to indicate new search
      }));
      
      console.log('Search query:', query);
      console.log('Reports data:', result?.data?.reports);
  
      if (result.success) {
        saveRecentSearch(query);
      }
  
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={tw`bg-white p-4 border-b border-gray-200 flex-row`}
      onPress={() => navigation.navigate("ReportDetails", { reportId: item.id })}
    >
      <Image source={{ uri: item.photo }} style={tw`w-20 h-20 rounded-lg mr-3`} resizeMode="cover" />
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center mb-1`}>
          <View style={tw`bg-blue-100 px-2 py-0.5 rounded-full mr-2`}>
            <Text style={tw`text-blue-800 text-xs font-medium`}>{item.type}</Text>
          </View>
        </View>

        <Text style={tw`font-bold text-gray-800 mb-1`}>{item.personName}</Text>

        <View style={tw`flex-row items-center mb-1`}>
          <User size={14} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-gray-600 text-sm`}>Age: {item.age}</Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <MapPin size={14} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-gray-600 text-sm`}>
            {item.location.barangay}, {item.location.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 border-b border-gray-200`}>
        <View style={tw`flex-row items-center space-x-2`}>
          <View style={tw`flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2`}>
            <Search color="#6B7280" size={20} />
            <TextInput
              style={tw`flex-1 ml-2 text-base`}
              placeholder="Search by name, location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={[tw`px-4 py-2 rounded-lg`, styles.backgroundColorPrimary]}
            onPress={() => handleSearch(searchQuery)}
          >
            <Text style={tw`text-white font-medium`}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!searchQuery && recentSearches.length > 0 && (
        <View style={tw`mt-2`}>
          <View style={tw`flex-row justify-between items-center px-4 py-2`}>
            <Text style={tw`font-medium text-gray-700`}>Recent Searches</Text>
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
                setRecentSearches([]);
              }}
            >
              <Text style={tw`text-blue-600`}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentSearches}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}
                onPress={() => {
                  setSearchQuery(item);
                  handleSearch(item);
                }}
              >
                <View style={tw`flex-row items-center`}>
                  <Clock size={20} color="#6B7280" />
                  <Text style={tw`ml-3 text-gray-700`}>{item}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const newSearches = recentSearches.filter((s) => s !== item);
                    setRecentSearches(newSearches);
                    AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
                  }}
                >
                  <Text style={tw`text-red-500`}>Remove</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `recent-${index}`}
          />
        </View>
      )}

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={styles.colorPrimary} />
        </View>
      ) : (
        <FlatList
  data={reports}
  renderItem={renderSearchResult}
  keyExtractor={(item) => {
    // Create a more unique key using multiple unique fields
    const uniqueKey = `search-${item.id}-${item.type}-${item.personName?.replace(/\s+/g, '')}-${Date.now()}`;
    return uniqueKey;
  }}
  ListEmptyComponent={searchQuery ? <NoDataFound message="No results found" /> : null}
  contentContainerStyle={tw`pb-4`}
/>
      )}
    </View>
  );
}
