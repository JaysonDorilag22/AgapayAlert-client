import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import tw from "twrnc";

const RadiusMap = ({
  center = { lat: 14.5176, lng: 121.0509 },
  radiusKm = 5,
  height = 300,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleMessage = (event) => {
    if (event.nativeEvent.data === 'MAP_LOADED') {
      setIsLoading(false);
      setError(null);
    }
  };

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
          // Initialize map
          const map = L.map('map', {
            center: [${center.lat}, ${center.lng}],
            zoom: 13
          });
          
          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add center marker
          const marker = L.marker([${center.lat}, ${center.lng}]).addTo(map);

          // Add radius circle
          const circle = L.circle([${center.lat}, ${center.lng}], {
            radius: ${radiusKm * 1000}, // Convert km to meters
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            weight: 2
          }).addTo(map);

          // Fit map to circle bounds
          map.fitBounds(circle.getBounds());

          // Signal that map is loaded
          setTimeout(() => {
            window.ReactNativeWebView.postMessage('MAP_LOADED');
          }, 500);
        } catch (e) {
          window.ReactNativeWebView.postMessage('MAP_ERROR: ' + e.message);
        }
      </script>
    </body>
  </html>
`;

  return (
    <View style={tw`relative mb-4`}>
      <View style={[tw`overflow-hidden rounded-xl`, { height }]}>
        <WebView
          key={retryCount}
          source={{ html: mapHTML }}
          style={{ flex: 1 }}
          scrollEnabled={false}
          bounces={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleMessage}
          startInLoadingState={true}
        />
        {isLoading && (
          <View style={tw`absolute inset-0 bg-white justify-center items-center`}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={tw`mt-4 text-gray-600`}>Loading map...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RadiusMap;