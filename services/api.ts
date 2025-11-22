import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export interface SensorReading {
    timestamp: number;
    heartRate: number;
    hrv: number;
    steps: number;
    calories: number;
    motion: 'idle' | 'walking' | 'running';
}

export interface AIQueryRequest {
    transcript: string;
    sensorChunk?: SensorReading[];
    sessionId?: string;
}

export interface AIQueryResponse {
    ok: boolean;
    analysis?: {
        summary: string;
        activity_guess: string;
        health_note: string;
        recommendation: string;
    };
    error?: string;
}

export interface SensorBatchRequest {
    sessionId: string;
    readings: SensorReading[];
}

export interface SensorBatchResponse {
    ok: boolean;
    inserted?: number;
    error?: string;
}

/**
 * Query the AI assistant with a user question and optional sensor data
 */
export async function queryAI(request: AIQueryRequest): Promise<AIQueryResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/api/ai/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('AI Query Error:', error);
        return {
            ok: false,
            error: error.message || 'Failed to connect to AI service',
        };
    }
}

/**
 * Upload a batch of sensor readings
 */
export async function uploadSensorBatch(request: SensorBatchRequest): Promise<SensorBatchResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensor/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Sensor Upload Error:', error);
        return {
            ok: false,
            error: error.message || 'Failed to upload sensor data',
        };
    }
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<{ status: string; service: string } | null> {
    try {
        const response = await fetch(`${BACKEND_URL}/health`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Health Check Error:', error);
        return null;
    }
}
