import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import tw from "twrnc";

const MapComponent = ({
  markers = [],
  center = { lat: 14.5176, lng: 121.0509 },
  zoom = 13,
  height = 300,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadMap = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);

  const handleMessage = (event) => {
    if (event.nativeEvent.data === 'MAP_LOADED') {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('Map loading timeout');
        setIsLoading(false);
      }
    }, 20000); // Increased timeout to 20 seconds

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const mapHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.4.0/ol.css">
    <script src="https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js"></script>
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
      .map-legend {
        position: absolute;
        bottom: 20px;
        right: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 1000;
      }
      .legend-title {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        margin: 4px 0;
      }
      .color-box {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div class="map-legend">
      <div class="legend-title">Risk Levels</div>
      <div class="legend-item">
        <div class="color-box" style="background: rgb(255, 0, 0)"></div>
        <span>High Risk Areas</span>
      </div>
      <div class="legend-item">
        <div class="color-box" style="background: rgb(255, 165, 0)"></div>
        <span>Medium Risk Areas</span>
      </div>
      <div class="legend-item">
        <div class="color-box" style="background: rgb(255, 255, 0)"></div>
        <span>Low Risk Areas</span>
      </div>
    </div>
    <script>
      try {
        const map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.XYZ({
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
              })
            })
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([${center.lng}, ${center.lat}]),
            zoom: ${zoom}
          })
        });

        const features = ${JSON.stringify(markers)}.map(marker => {
          return new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([marker.lng, marker.lat])),
            weight: marker.title.includes('High') ? 1.0 : 
                   marker.title.includes('Medium') ? 0.6 : 0.3,
            name: marker.title
          });
        });

        const heatmap = new ol.layer.Heatmap({
          source: new ol.source.Vector({ features }),
          blur: 15,
          radius: 15,
          weight: (feature) => feature.get('weight'),
          gradient: [
            'rgba(255, 255, 0, 0.6)',
            'rgba(255, 165, 0, 0.8)',
            'rgba(255, 0, 0, 1)'
          ]
        });

        map.addLayer(heatmap);
        
        // Send loaded message
        window.ReactNativeWebView.postMessage('MAP_LOADED');
      } catch (e) {
        window.ReactNativeWebView.postMessage('MAP_ERROR: ' + e.message);
      }
    </script>
  </body>
</html>
`;

  return (
    <View style={[tw`overflow-hidden rounded-lg`, { height }]}>
      <WebView
        key={retryCount}
        source={{ html: mapHTML }}
        style={{ flex: 1 }}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        containerStyle={{ flex: 1 }}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        injectedJavaScript={`
          document.body.addEventListener('touchmove', function(e) {
            e.stopPropagation();
          }, false);
        `}
      />
      {isLoading && (
        <View style={tw`absolute inset-0 items-center justify-center bg-white`}>
          <Text>Loading map...</Text>
        </View>
      )}
      {error && (
        <View style={tw`absolute inset-0 items-center justify-center bg-white`}>
          <Text style={tw`text-red-500 mb-4`}>{error}</Text>
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

export default MapComponent;