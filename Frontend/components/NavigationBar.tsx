import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Settings, Moon, Activity } from 'lucide-react-native';

interface NavigationBarProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export function NavigationBar({ currentScreen, onScreenChange }: NavigationBarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'health', icon: Activity, label: 'Health' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onScreenChange(item.id)}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <Icon
                size={24}
                color={isActive ? '#60A5FA' : 'rgba(255,255,255,0.6)'}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[
                  styles.label,
                  { color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.6)' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
    backdropFilter: 'blur(10px)', // ignored on Android, kept for clarity
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
  },
});