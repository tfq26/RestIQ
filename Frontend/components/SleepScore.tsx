import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SleepScoreProps {
  score: number;
  quality: string;
}

// Semicircular Progress Bar Component
function SemicircularProgress({ value }: { value: number }) {
  const radius = 120;
  const strokeWidth = 12;
  const center = radius + strokeWidth;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const pathData = `
    M ${strokeWidth} ${center}
    A ${radius} ${radius} 0 0 1 ${center * 2 - strokeWidth} ${center}
  `;

  return (
    <View style={styles.progressContainer}>
      <Svg width={center * 2} height={center + 20}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#8b5cf6" />
            <Stop offset="0.5" stopColor="#a855f7" />
            <Stop offset="1" stopColor="#ec4899" />
          </LinearGradient>
        </Defs>

        {/* Background Arc */}
        <Path
          d={pathData}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />

        {/* Progress Arc */}
        <Path
          d={pathData}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>

      {/* Score Centered */}
      <View style={styles.scoreOverlay}>
        <Text style={styles.scoreLabel}>Tonight's Sleep</Text>
        <Text style={styles.scoreValue}>{value}</Text>
      </View>
    </View>
  );
}

export function SleepScore({ score, quality }: SleepScoreProps) {
  const getStarRating = (score: number) => Math.round((score / 100) * 5);
  const starRating = getStarRating(score);

  return (
    <View style={styles.container}>
      {/* Semicircular Progress */}
      <SemicircularProgress value={score} />

      {/* Star Rating */}
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            color={star <= starRating ? '#facc15' : 'rgba(255,255,255,0.2)'}
            fill={star <= starRating ? '#facc15' : 'transparent'}
          />
        ))}
      </View>

      {/* Quality and Subtitle */}
      <Text style={styles.quality}>{quality}</Text>
      <Text style={styles.subtitle}>Tap for detailed analysis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 24,
    borderRadius: 16,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scoreOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 30,
    left: 0,
    right: 0,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    backgroundColor: '#22c55e',
    color: 'white',
    paddingHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  quality: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});