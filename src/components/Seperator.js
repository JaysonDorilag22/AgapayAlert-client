import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc'
const Seperator = () => {
  return (
    <View style={tw`flex-row items-center my-2`}>
        <View style={tw`flex-1 h-px bg-gray-300`} />
        <View style={tw`flex-1 h-px bg-gray-300`} />
      </View>
  )
}

export default Seperator