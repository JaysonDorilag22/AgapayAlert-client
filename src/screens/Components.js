import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import styles from '../styles/styles';
import { Plus, Trash, Edit } from 'lucide-react-native';

export default function Components() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.textPrimary}>Primary Text</Text>

      <TouchableOpacity style={styles.buttonPrimary}>
        <Text>Primary Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary}>
        <Text>Secondary Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDanger}>
        <Text>Danger Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDangerOutline}>
        <Text>Danger Outline Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDisabled} disabled>
        <Text>Disabled Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDisabledOutline} disabled>
        <Text>Disabled Outline Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonIcon}>
        <Plus color={styles.buttonIcon.color} />
        <Text>Icon Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonFAB}>
        <Plus color={styles.buttonFAB.color} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonText}>
        <Text>Text Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonLink}>
        <Text>Link Button</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonLoading}>
        <ActivityIndicator color={styles.buttonLoading.color} />
      </TouchableOpacity>
    </ScrollView>
  );
}