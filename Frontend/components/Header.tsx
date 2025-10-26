import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 48,
  },
  greeting: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 20,
  },
  date: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
});