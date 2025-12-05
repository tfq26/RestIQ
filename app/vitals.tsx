import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function VitalsScreen() {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching vitals...");
        fetch('http://192.168.5.146:8000/vitals')
            .then(res => {
                console.log("Vitals response status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("Vitals data received:", data.length, "records");
                if (data.length > 0) console.log("First record:", data[0]);
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching vitals:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                        <IconSymbol name="chevron.left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Sleep Vitals</Text>
                </View>
                <Text style={styles.text}>Loading Vitals...</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                        <IconSymbol name="chevron.left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Sleep Vitals</Text>
                </View>
                <Text style={styles.text}>No sleep data available.</Text>
            </View>
        );
    }

    // Process data for charts
    // Downsample for chart readability (take every nth point)
    // If we have 96 points (8 hours * 12 points/hr), showing all labels is too much.
    // We want maybe 6 labels.
    const step = Math.ceil(data.length / 6);

    const chartLabels = data.map((d, i) => i % step === 0 ? d.timestamp : '');
    const hrData = data.map(d => d.heartRate);
    const spo2Data = data.map(d => d.bloodOxygen);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <IconSymbol name="chevron.left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Sleep Vitals</Text>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Heart Rate (BPM)</Text>
                <LineChart
                    data={{
                        labels: chartLabels,
                        datasets: [{ data: hrData }]
                    }}
                    width={screenWidth - 32}
                    height={220}
                    yAxisSuffix=""
                    yAxisInterval={10}
                    chartConfig={{
                        backgroundColor: "#1e1e1e",
                        backgroundGradientFrom: "#1e1e1e",
                        backgroundGradientTo: "#1e1e1e",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: { r: "2", strokeWidth: "1", stroke: "#ef4444" }
                    }}
                    bezier
                    style={styles.chart}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Blood Oxygen (%)</Text>
                <LineChart
                    data={{
                        labels: chartLabels,
                        datasets: [{ data: spo2Data }]
                    }}
                    width={screenWidth - 32}
                    height={220}
                    yAxisSuffix="%"
                    chartConfig={{
                        backgroundColor: "#1e1e1e",
                        backgroundGradientFrom: "#1e1e1e",
                        backgroundGradientTo: "#1e1e1e",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: { r: "2", strokeWidth: "1", stroke: "#3b82f6" }
                    }}
                    bezier
                    style={styles.chart}
                />
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    backIcon: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
    chartContainer: {
        marginBottom: 24,
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    chartTitle: {
        color: '#aaa',
        fontSize: 16,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});
