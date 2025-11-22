import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Hero Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.hero}>
          <Text style={styles.heroTitle}>RestIQ</Text>
          <Text style={styles.heroSubtitle}>Sleep Smarter with AI</Text>
          <Text style={styles.heroDescription}>
            Advanced sleep analysis, proactive insights, and personalized coaching to help you wake up refreshed.
          </Text>
        </Animated.View>

        {/* Widgets Grid */}
        <View style={styles.widgetsContainer}>
          <Animated.View entering={FadeInUp.delay(400).duration(800)} style={[styles.widget, styles.widgetLarge]}>
            <View style={styles.widgetHeader}>
              <IconSymbol name="chart.bar.fill" size={24} color="#3b82f6" />
              <Text style={styles.widgetTitle}>Sleep Score</Text>
            </View>
            <Text style={styles.scoreValue}>85</Text>
            <Text style={styles.scoreLabel}>Excellent</Text>
          </Animated.View>

          <View style={styles.row}>
            <Animated.View entering={FadeInUp.delay(600).duration(800)} style={[styles.widget, styles.widgetSmall]}>
              <Text style={styles.widgetTitleSmall}>Sleep Debt</Text>
              <Text style={styles.widgetValue}>1h 20m</Text>
              <Text style={styles.widgetLabel}>Recovering</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(800).duration(800)} style={[styles.widget, styles.widgetSmall]}>
              <Text style={styles.widgetTitleSmall}>Recovery</Text>
              <Text style={styles.widgetValue}>92%</Text>
              <Text style={styles.widgetLabel}>Ready to train</Text>
            </Animated.View>
          </View>
        </View>

        {/* Quick Ask */}
        <Animated.View entering={FadeInUp.delay(1000).duration(800)} style={styles.askContainer}>
          <Text style={styles.askTitle}>Have a question about your sleep?</Text>
          <TouchableOpacity
            style={styles.askButton}
            onPress={() => router.push('/(tabs)/ask')}
          >
            <IconSymbol name="message.fill" size={20} color="white" />
            <Text style={styles.askButtonText}>Ask Assistant</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
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
});
