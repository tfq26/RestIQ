import { Star } from "lucide-react-native";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MainSleepDisplayProps {
  score: number;
}

export function MainSleepDisplay({ score }: MainSleepDisplayProps) {
  return (
    <View style={styles.container}>
      {/* AI Sleep companion description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          AI sleep companion - snoring, apnea{'\n'}
          restlessness, rhythm, HRV & insomnia inst-
        </Text>
      </View>

      {/* Main sleep score circle */}
      <View style={styles.circleWrapper}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Text style={styles.title}>Tonight's Sleep</Text>
            <Text style={styles.score}>{score}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  color="#FACC15"
                  fill="#FACC15"
                  style={{ marginHorizontal: 2 }}
                />
              ))}
            </View>
            <Text style={styles.subScore}>{score}/100</Text>
          </View>
        </View>
      </View>

      {/* View Solutions button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Solutions</Text>
      </TouchableOpacity>

      {/* Tip section */}
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>
          <Text style={styles.tipLabel}>TIP: </Text>
          Lower your screen brightness 1 hr{'\n'}
          before bed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  description: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  circleWrapper: {
    marginBottom: 32,
  },
  outerCircle: {
    width: 208,
    height: 208,
    borderRadius: 104,
    padding: 4,
    backgroundColor: '#A855F7', // fallback for gradient
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 104,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#D1D5DB',
    fontSize: 14,
    marginBottom: 6,
  },
  score: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '300',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  subScore: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#C026D3',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 9999,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  tipContainer: {
    marginBottom: 32,
  },
  tipText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  tipLabel: {
    color: '#D1D5DB',
  },
});