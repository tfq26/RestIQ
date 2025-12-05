import EmergencyScreen from '@/components/EmergencyScreen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSleepMode } from '@/contexts/SleepModeContext';
import { useAuth } from '@/contexts/authContext';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Placeholder for backend URL - Replace with your actual backend URL
const BACKEND_URL = 'http://192.168.5.146:8000';

const SLEEP_TIPS = [
  "Consistent sleep schedules help regulate your body's clock.",
  "A cool room temperature (around 65°F) promotes better sleep.",
  "Avoid caffeine and heavy meals before bedtime.",
  "Blue light from screens can disrupt your sleep cycle.",
  "Reading a book is a great way to wind down.",
  "Regular exercise can help you fall asleep faster.",
  "Limit naps to 20 minutes to avoid grogginess.",
  "Create a relaxing bedtime routine to signal your body it's time to sleep."
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth()!;
  const { isTestMode } = useAuth()!;
  const { toggleSleepMode } = useSleepMode();
  const [emergencyVisible, setEmergencyVisible] = useState(false);
  const [sleepScore, setSleepScore] = useState(50);
  const [dailyScore, setDailyScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [tip, setTip] = useState('');
  const [alertsCount, setAlertsCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchSleepScore();
      fetchAlerts();
    }, [])
  );

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
    else if (hour >= 17 && hour < 21) setGreeting('Good Evening');
    else setGreeting('Ready for sleep?');

    setTip(SLEEP_TIPS[Math.floor(Math.random() * SLEEP_TIPS.length)]);
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Dillon';

  const fetchSleepScore = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/sleep-score`);
      const data = await response.json();
      if (data.total_score) {
        setSleepScore(data.total_score);
        setDailyScore(data.daily_score);
      }
    } catch (error) {
      console.error('Failed to fetch sleep score:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/audio-events`);
      if (response.ok) {
        const data = await response.json();
        // Count only Awake events as per user request
        const count = data.filter((e: any) => e.status === 'Awake').length;
        setAlertsCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    }
  };

  const handleTestHealthMonitor = async () => {
    setLoading(true);
    try {
      const profile = {
        age: 24,
        weight: 165,
        height: 178,
        conditions: ['None']
      };

      const response = await fetch(`${BACKEND_URL}/simulate-health-monitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (data.status === 'Emergency') {
        setEmergencyVisible(true);
      } else if (data.status === 'Warning') {
        Toast.show({
          type: 'info',
          text1: 'Health Warning',
          text2: 'Irregularities detected in your health data.',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Status Normal',
          text2: 'Your health metrics are within normal range.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to connect to health monitor.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Hero Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.hero}>
          <Text style={styles.heroTitle}>{greeting}, {firstName}</Text>
          <Text style={styles.heroDescription}>{tip}</Text>
        </Animated.View>

        {/* Widgets Grid */}
        <View style={styles.widgetsContainer}>
          <Animated.View entering={FadeInUp.delay(400).duration(800)} style={[styles.widget, styles.widgetLarge]}>
            <View style={styles.widgetHeader}>
              <IconSymbol name="chart.bar.fill" size={24} color="#3b82f6" />
              <Text style={styles.widgetTitle}>Sleep Score</Text>
            </View>
            <Text style={styles.scoreValue}>{sleepScore}</Text>
            <Text style={styles.scoreLabel}>
              {sleepScore >= 80 ? 'Excellent' : sleepScore >= 60 ? 'Good' : 'Fair'}
            </Text>
            {dailyScore !== 0 && (
              <Text style={[styles.dailyChange, { color: dailyScore > 0 ? '#10b981' : '#ef4444' }]}>
                {dailyScore > 0 ? '+' : ''}{dailyScore} today
              </Text>
            )}
          </Animated.View>

          <View style={styles.row}>
            <Animated.View entering={FadeInUp.delay(600).duration(800)} style={[styles.widget, styles.widgetSmall]}>
              <Text style={styles.widgetTitleSmall}>Weekly Goal</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.widgetValue}>42h / 56h</Text>
              <Text style={styles.widgetLabel}>On Track</Text>
            </Animated.View>

            <AnimatedTouchableOpacity
              entering={FadeInUp.delay(800).duration(800)}
              style={[styles.widget, styles.widgetSmall]}
              onPress={() => router.push('/events-history')}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.widgetTitleSmall}>Alerts</Text>
                <IconSymbol name="exclamationmark.triangle.fill" size={32} color="#fbbf24" />
                <Text style={[styles.widgetValue, { marginTop: 8 }]}>{alertsCount} New</Text>
                <Text style={styles.widgetLabel}>Tap to view</Text>
              </View>
            </AnimatedTouchableOpacity>
          </View>
        </View>



        {/* Sleep Mode Button */}
        < Animated.View entering={FadeInUp.delay(1200).duration(800)} style={styles.sleepModeContainer} >
          <TouchableOpacity
            style={styles.sleepModeButton}
            onPress={toggleSleepMode}
          >
            <IconSymbol name="moon.fill" size={32} color="white" />
            <Text style={styles.sleepModeButtonText}>Enter Sleep Mode</Text>
          </TouchableOpacity>
        </Animated.View >

        {/* Test Health Monitor Button */}
        < Animated.View entering={FadeInUp.delay(1400).duration(800)} style={styles.testButtonContainer} >
          {isTestMode && (
            <>
              <TouchableOpacity
                style={styles.testButton}
                onPress={handleTestHealthMonitor}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <IconSymbol name="waveform.path.ecg" size={20} color="white" />
                    <Text style={styles.testButtonText}>Test Health Monitor</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.testButton, { marginTop: 12, borderColor: 'rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}
                onPress={() => router.push('/sleep-summary')}
              >
                <IconSymbol name="list.bullet.clipboard.fill" size={20} color="#3b82f6" />
                <Text style={[styles.testButtonText, { color: '#3b82f6' }]}>View Sleep Summary</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.testButton, { marginTop: 12, borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
                onPress={() => router.push('/vitals')}
              >
                <IconSymbol name="heart.fill" size={20} color="#ef4444" />
                <Text style={[styles.testButtonText, { color: '#ef4444' }]}>View Sleep Vitals</Text>
              </TouchableOpacity>
            </>
          )
          }
        </Animated.View >

      </ScrollView >

      <EmergencyScreen
        visible={emergencyVisible}
        onDismiss={() => setEmergencyVisible(false)}
      />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  hero: {
    marginBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#E0E6F5',
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    color: '#9BA9CE',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
  },
  widgetsContainer: {
    gap: 16,
    marginBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  widget: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  widgetLarge: {
    alignItems: 'center',
  },
  widgetSmall: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E6F5',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '800',
    color: '#3b82f6',
    lineHeight: 80,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#9BA9CE',
    fontWeight: '500',
  },
  widgetTitleSmall: {
    fontSize: 14,
    color: '#9BA9CE',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  widgetValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E0E6F5',
    marginBottom: 4,
  },
  widgetLabel: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  askContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  askTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E6F5',
    marginBottom: 16,
    textAlign: 'center',
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    gap: 8,
  },
  askButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  sleepModeContainer: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  sleepModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5', // Indigo-600
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 24,
    gap: 12,
    width: '100%',
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sleepModeButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  testButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  testButtonText: {
    color: '#9BA9CE',
    fontWeight: '600',
    fontSize: 14,
  },
  dailyChange: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
});
