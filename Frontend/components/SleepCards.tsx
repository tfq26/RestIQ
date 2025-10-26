import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wind, RotateCcw, Clock } from 'lucide-react-native';

interface SleepCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

function SleepCard({ icon: Icon, title, subtitle }: SleepCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconWrapper}>
          <Icon color="#fff" size={20} />
        </View>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

export function SleepCards() {
  const cards = [
    { icon: Wind, title: 'Snoring', subtitle: 'Personalized tips' },
    { icon: RotateCcw, title: 'Restless', subtitle: 'Personalized tips' },
    { icon: Clock, title: 'Efficiency', subtitle: 'Personalized tips' },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <SleepCard
          key={index}
          icon={card.icon}
          title={card.title}
          subtitle={card.subtitle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)', // gray-900/50
    borderColor: 'rgba(168, 85, 247, 0.3)', // purple-500/30
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(4px)', // ignored by RN, included for context
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'linear-gradient(135deg, #a855f7, #ec4899)', // gradient not directly supported
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cardSubtitle: {
    color: '#9ca3af', // gray-400
    fontSize: 12,
  },
});