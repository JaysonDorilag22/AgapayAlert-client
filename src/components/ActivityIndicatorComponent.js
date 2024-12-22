import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colorPrimary } from '../styles/styles';

const ActivityIndicatorComponent = ({ color = colorPrimary, size = 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityIndicatorComponent;