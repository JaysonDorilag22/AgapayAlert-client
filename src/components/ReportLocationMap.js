import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import tw from 'twrnc';

const ReportLocationMap = ({ reportLocation, height = 300 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleMessage = (event) => {
    if (event.nativeEvent.data.startsWith('MAP_ERROR:')) {
      setError(event.nativeEvent.data.replace('MAP_ERROR:', ''));
      setIsLoading(false);
    } else if (event.nativeEvent.data === 'MAP_LOADED') {
      setIsLoading(false);
    }
  };

  const loadMap = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);

  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          html, body { 
            margin: 0; 
            padding: 0; 
            height: 100%; 
            width: 100%; 
          }
          #map { 
            width: 100%; 
            height: 100%; 
            background: #f8f9fa;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          try {
            const map = L.map('map', {
              zoomControl: true,
              attributionControl: true
            });
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);

            const reportIcon = L.divIcon({
              html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
              className: 'report-marker',
              iconSize: [16, 16]
            });

            const reportMarker = L.marker([${reportLocation.lat}, ${reportLocation.lng}], {
              icon: reportIcon,
              title: 'Report Location'
            }).addTo(map);

            // Center and zoom to report location
            map.setView([${reportLocation.lat}, ${reportLocation.lng}], 15);

            // Force map invalidation to ensure proper rendering
            setTimeout(() => {
              map.invalidateSize();
              window.ReactNativeWebView.postMessage('MAP_LOADED');
            }, 250);
          } catch (error) {
            window.ReactNativeWebView.postMessage('MAP_ERROR: ' + error.message);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[tw`relative rounded-lg overflow-hidden`, { height }]}>
      <WebView
        key={retryCount}
        source={{ html: mapHTML }}
        style={tw`flex-1`}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        startInLoadingState={true}
        scalesPageToFit={false}
      />

      {isLoading && (
        <View style={tw`absolute inset-0 bg-white justify-center items-center`}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={tw`mt-4 text-gray-600`}>Loading map...</Text>
        </View>
      )}

      {error && (
        <View style={tw`absolute inset-0 bg-white justify-center items-center p-4`}>
          <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
          <TouchableOpacity
            onPress={loadMap}
            style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
          >
            <Text style={tw`text-white font-medium`}>Retry Loading</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ReportLocationMap;