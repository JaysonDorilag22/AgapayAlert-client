import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronRight } from 'lucide-react-native';
import { getUserList } from '@/redux/actions/userActions';
import tw from 'twrnc';
import showToast from '@/utils/toastUtils';
import { useNavigation } from '@react-navigation/native';

const USER_ROLES = [
  'POLICE_OFFICER',
  'POLICE_ADMIN',
  'CITY_ADMIN',
  'SUPER_ADMIN'
];

export default function Users() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { users, loading } = useSelector(state => state.user);

  useEffect(() => {
    loadUsers(1);
  }, [activeFilter, searchText]);

  const loadUsers = async (page = 1) => {
    try {
      const result = await dispatch(getUserList({
        page,
        limit: 10,
        role: activeFilter?.toLowerCase(), // Convert to lowercase only when sending
        search: searchText
      }));
      
      if (result.success) {
        setHasMore(result.data.hasMore);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Failed to load users');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadUsers(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadUsers(nextPage);
    }
  };

  const handleFilterPress = (role) => {
    setActiveFilter(role === activeFilter ? null : role);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleUserPress = (user) => {
    navigation.navigate('UserDetails', { userId: user._id });
  };

  const renderFilterBadges = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={tw`my-3`}
      contentContainerStyle={tw`px-4`}
    >
      <TouchableOpacity
        style={[
          tw`min-w-[90px] h-[40px] rounded-lg mr-2 justify-center items-center border mb-5`,
          !activeFilter ? tw`bg-blue-600 border-blue-600` : tw`bg-white border-gray-300`
        ]}
        onPress={() => handleFilterPress(null)}
      >
        <Text style={[
          tw`text-[14px] font-medium`,
          !activeFilter ? tw`text-white` : tw`text-gray-700`
        ]}>
          All Roles
        </Text>
      </TouchableOpacity>
  
      {USER_ROLES.map((role) => (
        <TouchableOpacity
          key={role}
          style={[
            tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
            activeFilter === role ? tw`bg-blue-600 border-blue-600` : tw`bg-white border-gray-300`
          ]}
          onPress={() => handleFilterPress(role)}
        >
          <Text 
            numberOfLines={1}
            style={[
              tw`text-[14px] font-medium px-3`,
              activeFilter === role ? tw`text-white` : tw`text-gray-700`
            ]}
          >
            {role.split('_').map(word =>
              word.charAt(0) + word.slice(1).toLowerCase()
            ).join(' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderUser = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleUserPress(item)}
      style={tw`bg-white p-4 border-b border-gray-200`}
    >
      <View style={tw`flex-row items-center`}>
        <Image
          source={{ 
            uri: item.avatar?.url || 'https://via.placeholder.com/100'
          }}
          style={tw`w-12 h-12 rounded-full mr-3`}
        />
        
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center mb-1`}>
            <View style={tw`bg-blue-100 rounded-full px-2 py-0.5 mr-2`}>
              <Text style={tw`text-blue-600 text-xs font-medium`}>
                {item.roles[0]?.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ')}
              </Text>
            </View>
            <Text style={tw`text-gray-500 text-xs`}>
              ID #{item._id?.slice(-6)}
            </Text>
          </View>
  
          <Text style={tw`text-gray-900 font-medium`}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={tw`text-gray-500 text-sm`}>{item.email}</Text>
          
          {item.policeStation && (
            <Text style={tw`text-gray-600 text-xs mt-1`}>
              {item.policeStation.name}
            </Text>
          )}
        </View>
  
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-center bg-white rounded-lg px-3 py-2 border border-gray-200`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Search users..."
            style={tw`flex-1 ml-2 text-base text-gray-700`}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
  
      {renderFilterBadges()}
  
      {loading && !users.length ? (
        <View style={tw`flex-1 justify-center items-center mt-5`}>
          <ActivityIndicator size="large" color="#0056A7" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={item => item._id}
          contentContainerStyle={users.length === 1 ? tw`pb-4` : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={tw`py-8`}>
              <Text style={tw`text-gray-500 text-center`}>
                {searchText ? 'No users found matching your search' : 'No users found'}
              </Text>
            </View>
          }
          ListFooterComponent={
            loading && users.length > 0 ? (
              <ActivityIndicator style={tw`py-4`} color="#0056A7" />
            ) : null
          }
        />
      )}
    </View>
  );
}