import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export function RecoveryChart() {
  const bars = [
    { height: 60, color: '#c084fc' }, // purple-400
    { height: 80, color: '#a855f7' }, // purple-500
    { height: 100, color: '#9333ea' }, // purple-600
    { height: 85, color: '#ec4899' }, // pink-500
    { height: 95, color: '#db2777' }, // pink-600
    { height: 100, color: '#9333ea' }, // purple-600
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Strong recovery</Text>
      </View>

      <View style={styles.barContainer}>
        {bars.map((bar, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor: bar.color,
                height: `${bar.height}%`,
                flex: 1,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 96,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 8,
  },
  bar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    transitionDuration: '500ms', // ignored in RN, included for clarity
  },
});