import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Wind,
  Pause,
  RotateCcw,
  Clock,
  Sun,
  Moon,
} from 'lucide-react-native';

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  status: 'good' | 'warning' | 'alert';
  description?: string;
  onPress?: () => void;
}

function MetricCard({
  icon: Icon,
  title,
  value,
  status,
  description,
  onPress,
}: MetricCardProps) {
  const getStatusColor = (status: 'good' | 'warning' | 'alert') => {
    switch (status) {
      case 'good':
        return '#4ade80'; // green-400
      case 'warning':
        return '#facc15'; // yellow-400
      case 'alert':
        return '#f87171'; // red-400
      default:
        return '#9ca3af'; // gray-400
    }
  };

  const borderColor = getStatusColor(status);
  const color = getStatusColor(status);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { borderColor }]}
    >
      <View style={styles.cardHeader}>
        <Icon color={color} size={20} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      {description && (
        <Text style={styles.cardDescription}>{description}</Text>
      )}
    </TouchableOpacity>
  );
}

interface SleepMetricsProps {
  onMetricPress?: (metricType: string) => void;
}

export function SleepMetrics({ onMetricPress }: SleepMetricsProps) {
  const metrics = [
    {
      id: 'snoring',
      icon: Wind,
      title: 'Snoring',
      value: 'Minimal',
      status: 'good' as const,
      description: '2 episodes detected',
    },
    {
      id: 'apnea',
      icon: Pause,
      title: 'Apnea Events',
      value: 'None',
      status: 'good' as const,
      description: 'No pauses detected',
    },
    {
      id: 'restlessness',
      icon: RotateCcw,
      title: 'Restlessness',
      value: 'Low',
      status: 'good' as const,
      description: '12 movement events',
    },
    {
      id: 'duration',
      icon: Clock,
      title: 'Sleep Duration',
      value: '7h 24m',
      status: 'good' as const,
      description: '92% efficiency',
    },
    {
      id: 'circadian',
      icon: Sun,
      title: 'Circadian Rhythm',
      value: 'Stable',
      status: 'good' as const,
      description: 'Well aligned',
    },
    {
      id: 'insomnia',
      icon: Moon,
      title: 'Insomnia Risk',
      value: 'Low',
      status: 'good' as const,
      description: 'Healthy sleep onset',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Sleep Analysis</Text>
        <Text style={styles.sectionSubtitle}>Tap for detailed breakdown</Text>
      </View>

      <View style={styles.metricsList}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            icon={metric.icon}
            title={metric.title}
            value={metric.value}
            status={metric.status}
            description={metric.description}
            onPress={() => onMetricPress?.(metric.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    marginBottom: 4,
    fontWeight: '600',
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  metricsList: {
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 2,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});