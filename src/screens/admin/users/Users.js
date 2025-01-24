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
import NoDataFound from '@/components/NoDataFound';
import styles from '@/styles/styles';
import { UserSkeleton } from '@/components/skeletons';

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
  const [error, setError] = useState(null);
  const { users, loading } = useSelector(state => state.user);

  useEffect(() => {
    loadUsers(1);
  }, [activeFilter, searchText]);

  const loadUsers = async (page = 1) => {
    try {
      const result = await dispatch(getUserList({
        page,
        limit: 10,
        role: activeFilter?.toLowerCase(),
        search: searchText
      }));
      
      if (result.success) {
        setHasMore(result.data.hasMore);
        setError(null);
      } else {
        setError('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
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
      style={tw`flex-grow-0`}
      contentContainerStyle={tw`p-2 mb-4`}
    >
      <TouchableOpacity
        style={[
          tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
          !activeFilter ? styles.backgroundColorPrimary : tw`bg-white border-gray-300`
        ]}
        onPress={() => handleFilterPress(null)}
      >
        <Text style={tw`${!activeFilter ? 'text-white' : 'text-gray-700'} text-[14px] font-medium`}>
          All Roles
        </Text>
      </TouchableOpacity>
  
      {USER_ROLES.map((role) => (
        <TouchableOpacity
          key={role}
          style={[
            tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
            activeFilter === role ? styles.backgroundColorPrimary : tw`bg-white border-gray-300`
          ]}
          onPress={() => handleFilterPress(role)}
        >
          <Text 
            numberOfLines={1}
            style={tw`${activeFilter === role ? 'text-white' : 'text-gray-700'} text-[14px] font-medium px-3`}
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
      style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}
    >
        <Image
          source={{ 
            uri: item.avatar?.url || 'https://via.placeholder.com/100'
          }}
          style={tw`w-12 h-12 rounded-full mr-3`}
        />
        
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center mb-1`}>
            <View style={[tw`rounded-full px-2 py-0.5 mr-2`, styles.backgroundColorPrimary + '20']}>
              <Text style={[tw`text-xs font-medium`, { color: styles.colorPrimary}]}>
                {item.roles[0]?.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ')}
              </Text>
            </View>
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
  
        <ChevronRight size={20} color={styles.colorPrimary} />
    </TouchableOpacity>
  );

  if (loading && !users.length) {
    return (
      <View style={tw`flex-1 bg-white`}>
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
        {renderFilterBadges()}

        </View>
        {[...Array(10)].map((_, index) => (
          <UserSkeleton key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <NoDataFound 
          message={error}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
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
  
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={tw`pb-20`}
        ListEmptyComponent={() => (
          <NoDataFound 
            message={
              searchText 
                ? `No users found matching "${searchText}"` 
                : activeFilter
                  ? `No ${activeFilter.split('_').map(word => 
                      word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(' ')} users found`
                  : "No users found"
            }
          />
        )}
        ListFooterComponent={
          loading && users.length > 0 ? (
            <ActivityIndicator style={tw`py-4`} color={styles.colorPrimary} />
          ) : null
        }
      />
    </View>
  );
}