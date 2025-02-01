import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { X } from 'lucide-react-native';
import tw from "twrnc";

const StationMap = ({
  reportLocation,
  stationLocation,
  distance,
  height = 400,
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
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
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
          .route-info {
            position: absolute;
            bottom: 20px; // Increased from 10px
            left: 20px; // Increased from 10px
            background: white;
            padding: 12px; // Increased from 8px
            border-radius: 8px; // Increased from 4px
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 14px; // Added font size
            font-weight: 500; // Added font weight
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="route-info">Distance: ${distance ? `~${distance} km` : 'Calculating...'}</div>
        <script>
          try {
            const map = L.map('map');
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add markers
            const reportMarker = L.marker([${reportLocation.lat}, ${reportLocation.lng}], {
              title: 'Report Location'
            }).addTo(map);

            const stationMarker = L.marker([${stationLocation.lat}, ${stationLocation.lng}], {
              title: 'Police Station'
            }).addTo(map);

            // Add routing
            L.Routing.control({
              waypoints: [
                L.latLng(${reportLocation.lat}, ${reportLocation.lng}),
                L.latLng(${stationLocation.lat}, ${stationLocation.lng})
              ],
              routeWhileDragging: false,
              show: false,
              addWaypoints: false,
              lineOptions: {
                styles: [{color: '#2563eb', weight: 4}]
              }
            }).addTo(map);

            // Fit bounds to show both markers
            const bounds = L.latLngBounds(
              [${reportLocation.lat}, ${reportLocation.lng}],
              [${stationLocation.lat}, ${stationLocation.lng}]
            );
            map.fitBounds(bounds, { padding: [50, 50] });

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
        tw`overflow-hidden rounded-xl`, // Changed from rounded-lg to rounded-xl
        { height: height } // Using the increased height
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
      
      {/* Close Button */}
      {onClose && (
        <TouchableOpacity 
          style={tw`absolute top-12 right-2 bg-white p-1 rounded-full shadow-lg z-50`} // Increased padding and top/right position
          onPress={() => onClose()}
        >
          <X size={28} color="#666" /> 
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StationMap;