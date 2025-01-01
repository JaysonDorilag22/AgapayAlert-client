import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Clock, MapPin, User, FileText, Shield } from 'lucide-react-native';
import tw from 'twrnc';
import styles from 'styles/styles';



const PreviewForm = ({ onBack, onSubmit }) => {
  // Mock data
  const mockData = {
    basicInfo: {
      type: 'Missing',
      images: [
        { url: 'https://images.unsplash.com/photo-1661107459646-a0110d8ac203?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
      ]
    },
    personInvolved: {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      alias: 'Johnny',
      relationship: 'Father',
      lastKnownLocation: 'Manila City',
      mostRecentPhoto: { url: 'https://media.istockphoto.com/id/1359499106/photo/grandmother-bonds-with-grandson-on-the-beach.webp?a=1&b=1&s=612x612&w=0&k=20&c=fHws_aSI9awOaSb5k-Is0zKWrPU8aT7hMHGOaXE7mYw=' }
    },
    physicalDescription: {
      gender: 'Male',
      race: 'Asian',
      height: "5'8\"",
      weight: '70kg',
      eyeColor: 'Brown',
      hairColor: 'Black',
      scarsMarksTattoos: 'Scar on left arm',
      birthDefects: 'None',
      bloodType: 'O+',
      medications: 'None'
    },
    location: {
      address: {
        streetAddress: '123 Main Street',
        barangay: 'San Antonio',
        city: 'Makati',
        zipCode: '1200'
      },
      dateTime: {
        date: '2024-03-20',
        time: '14:30'
      }
    },
    policeStation: {
      name: 'Central Police Station',
      isAutoAssigned: true
    }
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <View style={tw`flex-row items-center mb-4 border-b border-gray-200 pb-2`}>
      <Icon size={20} color="#4B5563" style={tw`mr-2`} />
      <Text style={tw`text-lg font-bold text-gray-800`}>{title}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 7 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Preview Report</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Review your report details before submission
      </Text>

      <ScrollView style={tw`flex-1`}>
        {/* Basic Information */}
        <View style={tw`mb-6 bg-gray-50 p-4 rounded-lg`}>
          <SectionHeader icon={FileText} title="Report Information" />
          <Text style={tw`text-gray-700 font-bold`}>Report Type</Text>
          <Text style={tw`text-gray-600 mb-2`}>{mockData.basicInfo.type}</Text>
          {mockData.basicInfo.images.length > 0 && (
            <Text style={tw`text-gray-600`}>
              {mockData.basicInfo.images.length} evidence photo(s) attached
            </Text>
          )}
        </View>

        {/* Person Details */}
        <View style={tw`mb-6 bg-gray-50 p-4 rounded-lg`}>
          <SectionHeader icon={User} title="Person Details" />
          <View style={tw`flex-row mb-4`}>
            <Image
              source={{ uri: mockData.personInvolved.mostRecentPhoto.url }}
              style={tw`w-24 h-24 rounded-lg mr-4`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                {mockData.personInvolved.firstName} {mockData.personInvolved.lastName}
              </Text>
              {mockData.personInvolved.alias && (
                <Text style={tw`text-gray-600`}>Alias: {mockData.personInvolved.alias}</Text>
              )}
              <Text style={tw`text-gray-600`}>
                Relationship: {mockData.personInvolved.relationship}
              </Text>
            </View>
          </View>
        </View>

        {/* Physical Description */}
        <View style={tw`mb-6 bg-gray-50 p-4 rounded-lg`}>
          <SectionHeader icon={User} title="Physical Description" />
          <View style={tw`grid grid-cols-2 gap-2`}>
            {Object.entries(mockData.physicalDescription).map(([key, value]) => (
              <View key={key} style={tw`mb-2`}>
                <Text style={tw`text-gray-700 font-bold`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text style={tw`text-gray-600`}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Location Details */}
        <View style={tw`mb-6 bg-gray-50 p-4 rounded-lg`}>
          <SectionHeader icon={MapPin} title="Location Details" />
          <Text style={tw`text-gray-700 mb-2`}>
            {mockData.location.address.streetAddress},
            {'\n'}Brgy. {mockData.location.address.barangay},
            {'\n'}{mockData.location.address.city},
          </Text>
          <View style={tw`flex-row items-center mt-2`}>
            <Clock size={16} color="#4B5563" style={tw`mr-2`} />
            <Text style={tw`text-gray-600`}>
              {mockData.location.dateTime.date} at {mockData.location.dateTime.time}
            </Text>
          </View>
        </View>

        {/* Police Station */}
        <View style={tw`mb-6 bg-gray-50 p-4 rounded-lg`}>
          <SectionHeader icon={Shield} title="Assigned Police Station" />
          <Text style={tw`text-gray-700 font-bold`}>{mockData.policeStation.name}</Text>
          <Text style={tw`text-gray-600`}>
            {mockData.policeStation.isAutoAssigned ? 'Automatically assigned' : 'Manually selected'}
          </Text>
        </View>
      </ScrollView>

      <View style={tw`flex-row mt-4`}>
        <TouchableOpacity
          style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
          onPress={onBack}
        >
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPrimary, tw`flex-1 ml-2`]}
          onPress={onSubmit}
        >
          <Text style={styles.buttonTextPrimary}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PreviewForm;