import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AlertTriangle, Bell, Phone, User, MapPin, Calendar } from 'lucide-react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';
import { getReportDetails } from '@/redux/actions/reportActions';
import { format } from 'date-fns';

const Finder = ({ route }) => {
  const dispatch = useDispatch();
  const { currentReport } = useSelector((state) => state.report);
  const { reportId } = route.params;

  useEffect(() => {
    if (reportId) {
      dispatch(getReportDetails(reportId));
    }
  }, [dispatch, reportId]);

  const getReportTypeMessage = (type) => {
    switch (type?.toLowerCase()) {
      case 'missing':
        return 'missing person';
      case 'abducted':
        return 'abduction';
      case 'kidnapped':
        return 'kidnapping';
      case 'hit-and-run':
        return 'hit-and-run incident';
      default:
        return 'case';
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
    } catch (error) {
      return 'N/A';
    }
  };

  console.log("Current Report:", currentReport);

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Success Message */}
      <View style={tw`p-6`}>
        <View style={tw`items-center mb-6`}>
          <View style={tw`w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4`}>
            <Bell size={40} color="#059669" />
          </View>
          <Text style={tw`text-2xl font-bold text-center text-gray-800 mb-2`}>
            Thank You for Your Help
          </Text>
          <Text style={tw`text-gray-600 text-center`}>
            Your information about this {getReportTypeMessage(currentReport?.type)} is valuable to us.
          </Text>
        </View>

        {/* Report Details */}
        <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mb-6`}>
          <Text style={tw`font-bold text-lg mb-4`}>Report Details</Text>
          
          <View style={tw`space-y-3`}>
            <View style={tw`flex-row items-start`}>
              <User size={20} color="#6B7280" style={tw`mr-2 mt-1`} />
              <View>
                <Text style={tw`text-gray-600`}>Person's Name</Text>
                <Text style={tw`font-medium`}>
                  {currentReport?.personInvolved?.firstName} {currentReport?.personInvolved?.lastName}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-start`}>
              <MapPin size={20} color="#6B7280" style={tw`mr-2 mt-1`} />
              <View>
                <Text style={tw`text-gray-600`}>Last Known Location</Text>
                <Text style={tw`font-medium`}>
                  {currentReport?.personInvolved?.lastKnownLocation || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-start`}>
              <Calendar size={20} color="#6B7280" style={tw`mr-2 mt-1`} />
              <View>
                <Text style={tw`text-gray-600`}>Report Date</Text>
                <Text style={tw`font-medium`}>
                  {formatDate(currentReport?.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Steps Card */}
        <View style={tw`bg-blue-50 rounded-lg p-4 mb-6`}>
          <View style={tw`flex-row items-start mb-3`}>
            <AlertTriangle size={24} color="#1D4ED8" style={tw`mt-1 mr-2`} />
            <Text style={tw`text-blue-800 font-semibold`}>What Happens Next?</Text>
          </View>
          <Text style={tw`text-blue-600 mb-4`}>
            Your report has been submitted to the authorities. Here's what you can expect:
          </Text>
          <View style={tw`space-y-3`}>
            <View style={tw`flex-row items-center`}>
              <Phone size={20} color="#1D4ED8" style={tw`mr-2`} />
              <Text style={tw`text-blue-700`}>
                You may receive calls for additional information
              </Text>
            </View>
            <Text style={tw`text-blue-600 pl-7`}>
              • The assigned police station might contact you
            </Text>
            <Text style={tw`text-blue-600 pl-7`}>
              • Updates will be sent through the app
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={tw`bg-gray-50 rounded-lg p-4`}>
          <Text style={tw`font-semibold text-gray-800 mb-3`}>
            Need to Add More Information?
          </Text>
          <Text style={tw`text-gray-600 mb-2`}>
            If you remember additional details or need to update your report:
          </Text>
          <View style={tw`space-y-2`}>
            <Text style={tw`text-gray-600`}>
              • Contact the nearest police station
            </Text>
            <Text style={tw`text-gray-600`}>
              • Use the app to submit another finder report
            </Text>
            <Text style={tw`text-gray-600`}>
              • Keep monitoring the app for case updates
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Finder;