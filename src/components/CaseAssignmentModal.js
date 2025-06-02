import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import {
  MapPin,
  Clock,
  User,
  Badge,
  X,
  Phone,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Home,
  Info
} from 'lucide-react-native';
import tw from 'twrnc';
import styles from '../styles/styles'; // Import your styles

const { width, height } = Dimensions.get('window');

const CaseAssignmentModal = ({ visible, notification, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(height));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  if (!notification || !notification.data) {
    return null;
  }

  const { data } = notification;
  const report = data.report;

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') {
      return 'Address not available';
    }
    
    const parts = [];
    if (address.streetAddress) parts.push(address.streetAddress);
    if (address.barangay) parts.push(`Brgy. ${address.barangay}`);
    if (address.city) parts.push(address.city);
    if (address.zipCode) parts.push(address.zipCode);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };

  const formatPersonName = (person) => {
    if (!person) return 'Unknown';
    const firstName = person.firstName || '';
    const lastName = person.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown';
  };

  const formatDateTime = (date, time) => {
    let result = '';
    if (date) {
      result = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (time) {
      result += time ? ` at ${time}` : '';
    }
    return result || 'Not specified';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
      
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 999999,
            elevation: 999999,
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: height * 0.05, // Moved even higher (5% from top)
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderRadius: 20,
                maxHeight: height * 0.9,
                minHeight: height * 0.7,
                transform: [{ translateY: slideAnim }],
                zIndex: 1000000,
                elevation: 1000000,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.3,
                shadowRadius: 10,
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
              {/* Header */}
              <View style={tw`flex-row items-center justify-between p-4 border-b border-blue-200 bg-blue-50 rounded-t-xl`}>
                <View style={tw`flex-row items-center flex-1`}>
                  <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3`}>
                    <AlertTriangle size={24} color="#041562" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={[styles.headingTwo, tw`text-lg text-blue-900`]}>
                      URGENT CASE ASSIGNMENT
                    </Text>
                    <Text style={[styles.textSmall, tw`text-sm text-blue-700`]}>
                      Case ID: {report?.caseId || 'N/A'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={onClose} 
                  style={tw`p-2 bg-white rounded-full shadow-sm`}
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={tw`flex-1`} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`p-4`}
              >
                {/* Assignment Notice */}
                <View style={tw`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4`}>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Info size={20} color="#041562" />
                    <Text style={[styles.textMedium, tw`text-blue-800 ml-2`]}>
                      Case Assignment Notice
                    </Text>
                  </View>
                  <Text style={[styles.textSmall, tw`text-blue-700`]}>
                    {notification.message || 'This case has been assigned to you for immediate attention.'}
                  </Text>
                </View>

                {/* Case Information */}
                <View style={tw`bg-white border border-blue-200 rounded-xl p-4 mb-4 shadow-sm`}>
                  <View style={tw`flex-row items-center mb-3`}>
                    <Badge size={20} color="#041562" />
                    <Text style={[styles.textLarge, tw`text-blue-900 ml-2`]}>
                      Case Information
                    </Text>
                  </View>
                  
                  <View style={tw`flex-row items-center mb-2`}>
                    <Text style={[styles.textMedium, tw`text-blue-600 w-20`]}>Type:</Text>
                    <View style={tw`bg-blue-100 rounded-full px-3 py-1`}>
                      <Text style={[styles.textMedium, tw`text-blue-800`]}>
                        {report?.type || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={tw`flex-row items-center mb-2`}>
                    <Text style={[styles.textMedium, tw`text-blue-600 w-20`]}>Status:</Text>
                    <View style={tw`bg-green-100 rounded-full px-3 py-1`}>
                      <Text style={[styles.textMedium, tw`text-green-800`]}>
                        Assigned
                      </Text>
                    </View>
                  </View>
                  
                  <View style={tw`flex-row items-center`}>
                    <Text style={[styles.textMedium, tw`text-blue-600 w-20`]}>Priority:</Text>
                    <View style={tw`bg-orange-100 rounded-full px-3 py-1`}>
                      <Text style={[styles.textMedium, tw`text-orange-800`]}>High</Text>
                    </View>
                  </View>
                </View>

                {/* Person Involved */}
                {report?.personInvolved && (
                  <View style={tw`bg-white border border-blue-200 rounded-xl p-4 mb-4 shadow-sm`}>
                    <View style={tw`flex-row items-center mb-3`}>
                      <Users size={20} color="#041562" />
                      <Text style={[styles.textLarge, tw`text-blue-900 ml-2`]}>
                        Person Involved
                      </Text>
                    </View>
                    
                    <View style={tw`flex-row items-start`}>
                      {report.personInvolved.mostRecentPhoto?.url && (
                        <Image
                          source={{ uri: report.personInvolved.mostRecentPhoto.url }}
                          style={tw`w-20 h-24 rounded-lg mr-4 border border-blue-200`}
                          resizeMode="cover"
                        />
                      )}
                      
                      <View style={tw`flex-1`}>
                        <Text style={[styles.textExtraLarge, tw`text-blue-900 mb-3`]}>
                          {formatPersonName(report.personInvolved)}
                        </Text>
                        
                        {report.personInvolved.age && (
                          <View style={tw`flex-row items-center mb-2`}>
                            <Calendar size={16} color="#6B7280" />
                            <Text style={[styles.textSmall, tw`text-gray-600 ml-2`]}>
                              Age: {report.personInvolved.age} years old
                            </Text>
                          </View>
                        )}
                        
                        {report.personInvolved.lastKnownLocation && (
                          <View style={tw`flex-row items-start mb-2`}>
                            <MapPin size={16} color="#6B7280" style={tw`mt-0.5`} />
                            <Text style={[styles.textSmall, tw`text-gray-600 ml-2 flex-1`]}>
                              Last seen: {report.personInvolved.lastKnownLocation}
                            </Text>
                          </View>
                        )}
                        
                        {(report.personInvolved.lastSeenDate || report.personInvolved.lastSeentime) && (
                          <View style={tw`flex-row items-center`}>
                            <Clock size={16} color="#6B7280" />
                            <Text style={[styles.textSmall, tw`text-gray-600 ml-2`]}>
                              {formatDateTime(report.personInvolved.lastSeenDate, report.personInvolved.lastSeentime)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    {/* Additional Person Details */}
                    {(report.personInvolved.physicalDescription || 
                      report.personInvolved.clothingDescription || 
                      report.personInvolved.distinguishingMarks) && (
                      <View style={tw`mt-4 pt-4 border-t border-blue-100`}>
                        {report.personInvolved.physicalDescription && (
                          <View style={tw`mb-2`}>
                            <Text style={[styles.textMedium, tw`text-blue-700`]}>Physical Description:</Text>
                            <Text style={[styles.textSmall, tw`text-gray-600`]}>{report.personInvolved.physicalDescription}</Text>
                          </View>
                        )}
                        
                        {report.personInvolved.clothingDescription && (
                          <View style={tw`mb-2`}>
                            <Text style={[styles.textMedium, tw`text-blue-700`]}>Clothing Description:</Text>
                            <Text style={[styles.textSmall, tw`text-gray-600`]}>{report.personInvolved.clothingDescription}</Text>
                          </View>
                        )}
                        
                        {report.personInvolved.distinguishingMarks && (
                          <View style={tw`mb-2`}>
                            <Text style={[styles.textMedium, tw`text-blue-700`]}>Distinguishing Marks:</Text>
                            <Text style={[styles.textSmall, tw`text-gray-600`]}>{report.personInvolved.distinguishingMarks}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {/* Report Location */}
                {report?.location && (
                  <View style={tw`bg-white border border-blue-200 rounded-xl p-4 mb-4 shadow-sm`}>
                    <View style={tw`flex-row items-center mb-3`}>
                      <Home size={20} color="#041562" />
                      <Text style={[styles.textLarge, tw`text-blue-900 ml-2`]}>
                        Report Location
                      </Text>
                    </View>
                    
                    <View style={tw`flex-row items-start`}>
                      <MapPin size={16} color="#6B7280" style={tw`mt-1`} />
                      <Text style={[styles.textSmall, tw`text-gray-700 ml-2 flex-1`]}>
                        {formatAddress(report.location.address)}
                      </Text>
                    </View>
                    
                    {(report.location.latitude && report.location.longitude) && (
                      <View style={tw`flex-row items-center mt-2`}>
                        <Text style={[styles.textSmall, tw`text-gray-500 ml-5`]}>
                          Coordinates: {report.location.latitude}, {report.location.longitude}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Report Details */}
                {report?.description && (
                  <View style={tw`bg-white border border-blue-200 rounded-xl p-4 mb-4 shadow-sm`}>
                    <View style={tw`flex-row items-center mb-3`}>
                      <Info size={20} color="#041562" />
                      <Text style={[styles.textLarge, tw`text-blue-900 ml-2`]}>
                        Report Description
                      </Text>
                    </View>
                    <Text style={[styles.textSmall, tw`text-gray-700 leading-6`]}>
                      {report.description}
                    </Text>
                  </View>
                )}

                {/* Assignment Confirmation */}
                <View style={tw`bg-green-50 border border-green-200 rounded-lg p-4 mb-4`}>
                  <View style={tw`flex-row items-center justify-center`}>
                    <CheckCircle size={20} color="#059669" />
                    <Text style={[styles.textMedium, tw`text-green-800 text-center text-lg ml-2`]}>
                      CASE ASSIGNED TO YOU
                    </Text>
                  </View>
                  <Text style={[styles.textSmall, tw`text-green-700 text-center mt-2`]}>
                    Please proceed with case handling immediately
                  </Text>
                </View>
              </ScrollView>

              {/* Close Button */}
              <View style={tw`p-4 border-t border-blue-200 bg-blue-50 rounded-b-xl`}>
                <TouchableOpacity
                  onPress={onClose}
                  style={tw`bg-blue-600 py-4 rounded-xl flex-row items-center justify-center`}
                >
                  <CheckCircle size={20} color="white" />
                  <Text style={[styles.textMedium, tw`text-center text-white text-lg ml-2`]}>
                    ACKNOWLEDGE
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default CaseAssignmentModal;