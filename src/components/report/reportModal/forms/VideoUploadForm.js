import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Animated, Easing, Platform } from 'react-native';
import { Video, AlertCircle, CheckCircle, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import tw from 'twrnc';
import styles from '@/styles/styles';
import showToast from '@/utils/toastUtils';

const VideoUploadForm = ({ onNext, onBack, initialData = {} }) => {
  const [videoInfo, setVideoInfo] = useState(initialData.video || null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [progressAnimation] = useState(new Animated.Value(0));
  
  // Simulate upload progress when "Next" is clicked
  useEffect(() => {
    if (uploading && videoInfo) {
      // Start with progress animation
      progressAnimation.setValue(0);
      Animated.timing(progressAnimation, {
        toValue: 100,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: false
      }).start();
      
      // Simulate progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
          progress = 100;
          clearInterval(interval);
          // Complete the upload after a delay
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
            onNext({ video: videoInfo });
          }, 500);
        }
        setUploadProgress(Math.floor(progress));
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [uploading, videoInfo]);
  
  const pickVideo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        setError("Permission to access media library is required");
        showToast("Permission to access media library is required");
        return;
      }
      
      // Launch video picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // Limit to 60 seconds
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedVideo = result.assets[0];
        
        // Check file size (15MB limit)
        const fileInfo = await FileSystem.getInfoAsync(selectedVideo.uri);
        const fileSizeInMB = fileInfo.size / (1024 * 1024);
        
        if (fileSizeInMB > 15) {
          setError("Video must be under 15MB");
          showToast("Video must be under 15MB");
          return;
        }
        
        // Simulate analyzing video for a moment
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set video information
        setVideoInfo({
          uri: selectedVideo.uri,
          type: 'video/mp4',
          name: `video_${Date.now()}.mp4`,
          duration: selectedVideo.duration || 0,
          fileSize: fileInfo.size,
        });
        
        showToast("Video selected successfully");
      }
    } catch (error) {
      console.error('Error picking video:', error);
      setError('Error selecting video');
      showToast('Error selecting video');
    } finally {
      setLoading(false);
    }
  };
  
  const removeVideo = () => {
    setVideoInfo(null);
    setUploadProgress(0);
    showToast("Video removed");
  };
  
  const handleNext = () => {
    if (videoInfo) {
      setUploading(true);
    } else {
      // No video to upload, just proceed
      onNext({ video: null });
    }
  };
  
  const renderProgressBar = () => {
    const width = progressAnimation.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });
    
    return (
      <View style={tw`mb-4`}>
        {/* Progress bar container */}
        <View style={tw`w-full bg-gray-200 rounded-full h-3 mb-2`}>
          <Animated.View 
            style={[
              tw`bg-blue-600 h-3 rounded-full`,
              { width }
            ]} 
          />
        </View>
        
        {/* Percentage text - now outside and below the progress bar */}
        <Text style={tw`text-center font-medium text-gray-700`}>
          {uploadProgress}% Uploaded
        </Text>
      </View>
    );
  };
  
  return (
    <View style={tw`flex-1 bg-white justify-between p-5`}>
      <View>
        <Text style={tw`text-lg font-bold mb-2 text-center`}>
          Video Evidence (Optional)
        </Text>
        
        <Text style={tw`text-gray-600 text-sm mb-4 text-center`}>
          Add video evidence related to your report. Maximum 15MB.
        </Text>
        
        {error && (
          <View style={tw`mb-4 p-3 bg-red-50 rounded-lg flex-row items-center`}>
            <AlertCircle size={20} color="#EF4444" style={tw`mr-2`} />
            <Text style={tw`text-red-600`}>{error}</Text>
          </View>
        )}
        
        {uploading && (
  <View style={tw`mb-4`}>
    <Text style={tw`text-blue-600 font-medium mb-2 text-center`}>Uploading video...</Text>
    {renderProgressBar()}
  </View>
)}
        
        {videoInfo && !uploading ? (
          <View style={tw`items-center mb-4`}>
            <View style={tw`w-full h-64 rounded-lg bg-gray-800 mb-2 justify-center items-center overflow-hidden relative`}>
              {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                <Image
                  source={{ uri: videoInfo.uri + '?time=' + new Date() }}
                  style={tw`w-full h-full absolute inset-0 opacity-40`}
                  resizeMode="cover"
                />
              ) : null}
              <Video size={60} color="#FFFFFF" />
              <Text style={tw`text-white mt-2 font-medium`}>Video Ready</Text>
              <View style={tw`absolute bottom-3 right-3 bg-blue-500 rounded-full p-1`}>
                <CheckCircle size={20} color="white" />
              </View>
            </View>
            
            <View style={tw`flex-row justify-between items-center w-full mt-2`}>
              <View>
                <Text style={tw`text-gray-700 font-medium`}>
                  Video size: {(videoInfo.fileSize / (1024 * 1024)).toFixed(2)}MB
                </Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  Added {new Date().toLocaleTimeString()}
                </Text>
              </View>
              <TouchableOpacity 
                style={tw`bg-red-500 px-4 py-2 rounded-lg`}
                onPress={removeVideo}
              >
                <Text style={tw`text-white font-medium`}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : !uploading && (
          <TouchableOpacity 
            style={tw`bg-gray-100 p-8 rounded-xl items-center border-2 border-dashed border-gray-300 mb-4`}
            onPress={pickVideo}
            disabled={loading}
          >
            {loading ? (
              <View style={tw`items-center`}>
                <ActivityIndicator size="large" color={styles.textPrimary.color} />
                <Text style={tw`mt-3 text-gray-600`}>Processing video...</Text>
              </View>
            ) : (
              <>
                <Upload size={60} color="#6B7280" />
                <Text style={tw`text-gray-600 mt-3 text-center font-medium`}>
                  Tap to upload video evidence
                </Text>
                <Text style={tw`text-gray-500 mt-1 text-center text-xs`}>
                  Maximum 15MB • MP4 format recommended
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      <View style={tw`flex-row justify-between mt-4`}>
        <TouchableOpacity 
          style={[styles.buttonOutline, tw`flex-1 mr-2`]} 
          onPress={() => onBack(4)}
          disabled={uploading}
        >
          <Text style={[styles.buttonTextOutline, uploading && tw`text-gray-400`]}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.buttonPrimary, 
            tw`flex-1`,
            uploading && tw`bg-gray-400`
          ]}
          onPress={handleNext}
          disabled={uploading || loading}
        >
          {uploading ? (
            <View style={tw`flex-row items-center justify-center`}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={[styles.buttonTextPrimary, tw`ml-2`]}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.buttonTextPrimary}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoUploadForm;