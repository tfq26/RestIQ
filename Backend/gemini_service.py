import google.generativeai as genai
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import random
import json

# Placeholder for API Key - User must set this
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "YOUR_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

def generate_mock_data(days=7):
    """Generates a CSV file with mock health data for the specified number of days."""
    end_time = datetime.now()
    start_time = end_time - timedelta(days=days)
    
    # 5-minute intervals
    timestamps = pd.date_range(start=start_time, end=end_time, freq='5min')
    
    data = []
    for ts in timestamps:
        # Simulate sleep cycle (approx 11pm to 7am)
        is_sleep_time = 23 <= ts.hour or ts.hour < 7
        
        if is_sleep_time:
            # Sleep data
            hr = int(np.random.normal(60, 5))
            spo2 = int(np.random.normal(97, 1))
            accel = np.random.normal(0.05, 0.02) # Low movement
            gyro = np.random.normal(0.05, 0.02)
            sleep_depth = np.clip(np.random.normal(0.8, 0.2), 0, 1) # Deep sleep
            
            # Occasional awake period or irregularity
            if random.random() < 0.05:
                hr += 20
                accel += 0.5
                sleep_depth = 0.1
        else:
            # Awake data
            hr = int(np.random.normal(80, 10))
            spo2 = int(np.random.normal(98, 1))
            accel = np.random.normal(0.5, 0.2)
            gyro = np.random.normal(0.5, 0.2)
            sleep_depth = 0.0
            
        # Introduce some "Emergency" anomalies randomly (very rare)
        if random.random() < 0.001:
            hr = 140 # High HR at rest/sleep
            spo2 = 85 # Low SpO2
            accel = 0.0 # No movement
            
        data.append({
            "Timestamp": ts,
            "HeartRate": hr,
            "BloodOxygen": spo2,
            "Accelerometer": accel,
            "Gyroscope": gyro,
            "SleepDepth": sleep_depth
        })
        
    df = pd.DataFrame(data)
    df.to_csv("mock_health_data.csv", index=False)
    return df

def analyze_sleep_session(events):
    """
    Analyzes a list of sleep session events using Gemini AI and provides a summary.
    """
    if not events:
        return "The user had a perfectly quiet sleep session with no disturbances detected."
    
    model = genai.GenerativeModel('gemini-pro') # Instantiate model inside function
    
    prompt = f"""
    Analyze the following sleep session events and provide a brief summary of the sleep quality.
    Events: {json.dumps(events)}
    
    Consider 'Awake' events as disturbances. 'Normal' events are just background noise checks.
    If there are no 'Awake' events, emphasize that sleep was uninterrupted.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error during session analysis: {e}")
        return f"Error analyzing session: {str(e)}"

def analyze_health_batch(batch_data, user_profile):
    """
    Analyzes a batch of health data using Gemini AI.
    Returns 'Normal', 'Warning', or 'Emergency'.
    """
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    You are an advanced medical AI assistant monitoring a user's health data stream.
    
    User Profile:
    {user_profile}
    
    Analyze the following 10 data points (5-minute intervals) for any signs of health emergencies or irregularities.
    
    Data Columns: Timestamp, HeartRate (bpm), BloodOxygen (%), Accelerometer (g), Gyroscope (rad/s), SleepDepth (0-1).
    
    Batch Data:
    {batch_data.to_string(index=False)}
    
    Rules:
    1. **Emergency**: sustained High HR (>120 at rest), Low SpO2 (<90), or Fall detected (high accel followed by 0).
    2. **Irregular**: Mild deviations (e.g., HR 100 at rest, SpO2 90-94).
    3. **Normal**: Within expected ranges.
    
    Task:
    Classify the overall status of this batch as "Normal", "Warning", or "Emergency".
    If > 4 rows show Emergency signs, output "Emergency".
    If > 4 rows show Irregular signs but not Emergency, output "Warning".
    Otherwise, output "Normal".
    
    Output ONLY the classification word.
    """
    
    try:
        response = model.generate_content(prompt)
        status = response.text.strip()
        # Fallback cleanup
        if "Emergency" in status: return "Emergency"
        if "Warning" in status: return "Warning"
        return "Normal"
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Normal" # Fail safe

def analyze_audio(audio_path):
    """
    Uploads audio to Gemini and classifies it as Normal, Awake, or Emergency.
    """
    try:
        # Upload the file to Gemini
        audio_file = genai.upload_file(path=audio_path)
        
        # Prompt
        prompt = """
        Listen to this audio clip from a sleep session. 
        Classify the event into one of these 3 categories:
        1. "Normal": Snoring, breathing, silence, rustling, or typical sleep sounds.
        2. "Awake": Talking, TV/Phone sounds, walking, or clear signs of being awake.
        3. "Emergency": Choking, gasping for air, screaming, distress calls, loud crashing sounds, or glass breaking.

        Return a JSON object with:
        {
            "status": "Normal" | "Awake" | "Emergency",
            "description": "Brief description of what was heard",
            "confidence": 0.0 to 1.0
        }
        """
        
        model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')
        response = model.generate_content([prompt, audio_file])
        
        print(f"Gemini Raw Response: {response.text}") # LOGGING

        # Parse response
        try:
            # Clean up markdown if present
            text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)
        except:
            print("Failed to parse JSON")
            return {
                "status": "Normal",
                "description": "Could not parse AI response, assuming normal.",
                "confidence": 0.0,
                "raw": response.text
            }
            
    except Exception as e:
        print(f"Gemini Audio Error: {e}")
        return {"status": "Error", "description": str(e)}

def process_stream(user_profile):
    """
    Simulates processing the stream. For demo, we just pick a random batch 
    or the last batch to analyze.
    """
    if not os.path.exists("mock_health_data.csv"):
        generate_mock_data()
        
    df = pd.read_csv("mock_health_data.csv")
    
    # Pick a random start index for demo purposes to simulate "live" stream
    # Ensure we have at least 10 rows
    if len(df) < 10: return "Normal"
    
    start_idx = random.randint(0, len(df) - 10)
    batch = df.iloc[start_idx:start_idx+10]
    
    return analyze_health_batch(batch, user_profile)
