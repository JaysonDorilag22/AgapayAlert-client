import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import tw from "twrnc";

const RadiusMap = ({
  center = { lat: 14.5176, lng: 121.0509 }, // Default to Metro Manila
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          }
          .radius-info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="radius-info">Radius: ${radiusKm} km</div>
        <script>
          try {
            const map = L.map('map');
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add center marker
            const centerMarker = L.marker([${center.lat}, ${center.lng}], {
              title: 'Center'
            }).addTo(map);

            // Add radius circle
            const circle = L.circle([${center.lat}, ${center.lng}], {
              radius: ${radiusKm * 1000},
              color: '#2563eb',
              fillColor: '#3b82f6',
              fillOpacity: 0.2,
              weight: 2
            }).addTo(map);

            // Fit bounds to circle
            map.fitBounds(circle.getBounds());

            window.ReactNativeWebView.postMessage('MAP_LOADED');
          } catch (e) {
            window.ReactNativeWebView.postMessage('MAP_ERROR: ' + e.message);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={tw`relative mb-4`}>
      <View style={[
        tw`overflow-hidden rounded-xl`,
        { height }
      ]}>
        <WebView
          key={retryCount}
          source={{ html: mapHTML }}
          style={{ flex: 1 }}
          scrollEnabled={false}
          bounces={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setError(nativeEvent.description);
          }}
        />
        {isLoading && (
          <View style={tw`absolute inset-0 items-center justify-center bg-white`}>
            <Text>Loading map...</Text>
          </View>
        )}
        {error && (
          <View style={tw`absolute inset-0 items-center justify-center bg-white p-4`}>
            <Text style={tw`text-red-500 mb-4 text-center`}>{error}</Text>
            <TouchableOpacity
              onPress={loadMap}
              style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
            >
              <Text style={tw`text-white font-medium`}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default RadiusMap;