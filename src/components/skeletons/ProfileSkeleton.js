import React from "react";
import { View} from "react-native";
import tw from "twrnc";
import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
  return (
    <View style={tw`flex-1 p-4`}>
      <View style={tw`items-center mb-4`}>
        <Skeleton width={96} height={96} style={tw`rounded-full`} />
      </View>
      <View style={tw`flex-row items-center mb-2`}>
        <Skeleton width={24} height={24} style={tw`rounded-full`} />
        <Skeleton width={150} height={24} style={tw`ml-2`} />
      </View>
      <View style={tw`mb-2`}>
        <Skeleton width="100%" height={20} style={tw`mb-1`} />
        <Skeleton width="100%" height={20} style={tw`mb-1`} />
      </View>
      <View style={tw`flex-row justify-between`}>
        <Skeleton width="48%" height={20} style={tw`mb-1`} />
        <Skeleton width="48%" height={20} style={tw`mb-1`} />
      </View>
      <View style={tw`mb-1`}>
        <Skeleton width="100%" height={20} style={tw`mb-1`} />
      </View>
      <View style={tw`flex-row items-center mb-2 mt-3`}>
        <Skeleton width={24} height={24} style={tw`rounded-full`} />
        <Skeleton width={150} height={24} style={tw`ml-2`} />
      </View>
      <View style={tw`flex-row justify-between`}>
        <Skeleton width="48%" height={20} style={tw`mb-1`} />
        <Skeleton width="48%" height={20} style={tw`mb-1`} />
      </View>
      <View style={tw`flex-row justify-between`}>
        <Skeleton width="48%" height={20} style={tw`mb-1`} />
        <Skeleton width="48%" height={20} style={tw`mb-1`} />
      </View>
      <View style={tw`flex-row justify-between mb-2`}>
        <Skeleton width="48%" height={20} style={tw`mb-1`} />
      </View>
      <View style={tw`mb-2 mt-3`}>
        <Skeleton width={150} height={24} style={tw`mb-1`} />
        <Skeleton width="100%" height={20} style={tw`mb-1`} />
        <Skeleton width="100%" height={20} style={tw`mb-1`} />
        <Skeleton width="100%" height={20} style={tw`mb-1`} />
      </View>
      <View style={tw`flex-row justify-between mb-4`}>
        <Skeleton width="48%" height={40} style={tw`rounded-lg`} />
        <Skeleton width="48%" height={40} style={tw`rounded-lg`} />
      </View>
      <Skeleton width="100%" height={40} style={tw`rounded-lg mb-4`} />
      <Skeleton width="100%" height={40} style={tw`rounded-lg mb-40`} />
    </View>
  );
};

export default ProfileSkeleton;
