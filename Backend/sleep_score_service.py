import pandas as pd
import numpy as np
from datetime import datetime
import os
import json

def calculate_sleep_score(night_data, current_total_score=50):
    """
    Calculates sleep score based on normalized data, quartiles, and awake penalties.
    Updates the total score with dynamic multipliers.
    """
    if night_data.empty:
        return 0, current_total_score

    # 1. Normalization (Simple Min-Max for demo)
    # Normalize HR (assume 40-100 range for sleep)
    night_data = night_data.copy()
    night_data['HR_Norm'] = (night_data['HeartRate'] - 40) / (100 - 40)
    night_data['HR_Norm'] = night_data['HR_Norm'].clip(0, 1)
    
    # Normalize SpO2 (assume 90-100 range)
    night_data['SpO2_Norm'] = (night_data['BloodOxygen'] - 90) / (100 - 90)
    night_data['SpO2_Norm'] = night_data['SpO2_Norm'].clip(0, 1)
    
    # Normalize Movement (Accel)
    night_data['Move_Norm'] = night_data['Accelerometer'].clip(0, 1)

    # 2. Quartile Analysis
    total_rows = len(night_data)
    quartile_size = total_rows // 4
    quartiles = [night_data.iloc[i*quartile_size:(i+1)*quartile_size] for i in range(4)]
    
    quartile_scores = []
    for q in quartiles:
        if q.empty: continue
        avg_hr = q['HR_Norm'].mean()
        avg_spo2 = q['SpO2_Norm'].mean()
        avg_move = q['Move_Norm'].mean()
        avg_depth = q['SleepDepth'].mean()
        
        # Formula: Higher SpO2/Depth is good, Higher HR/Move is bad
        # Weights: SpO2(2), HR(2), Move(3), Depth(3)
        q_score = (avg_spo2 * 2) - (avg_hr * 2) - (avg_move * 3) + (avg_depth * 3)
        quartile_scores.append(q_score)
    
    if not quartile_scores: return 0, current_total_score
    
    avg_quartile_score = sum(quartile_scores) / len(quartile_scores)
    
    # 3. Awake Penalty
    # Count rows where SleepDepth < 0.2 (Awake)
    awake_rows = len(night_data[night_data['SleepDepth'] < 0.2])
    awake_ratio = awake_rows / total_rows
    awake_penalty = awake_ratio * 20 # Heavy penalty
    
    # 4. Daily Score Calculation (-10 to +10)
    raw_score = avg_quartile_score * 5 # Scale up a bit
    daily_score = raw_score - awake_penalty
    daily_score = max(min(daily_score, 10), -10) # Clamp
    
    # 5. Total Score Update (Dynamic Multipliers)
    # Progress towards 100 (0.0 to 1.0)
    progress = max(0, min((current_total_score - 50) / 50, 1))
    
    # Positive Multiplier: 1.67 -> 1.25
    pos_mult = 1.67 - (progress * (1.67 - 1.25))
    
    # Negative Multiplier: 0.67 -> 0.75
    neg_mult = 0.67 + (progress * (0.75 - 0.67))
    
    new_total = current_total_score
    if daily_score > 0:
        new_total += daily_score * pos_mult
    else:
        new_total += daily_score * neg_mult
        
    new_total = max(0, min(new_total, 100)) # Clamp 0-100
    
    return round(daily_score, 2), round(new_total, 1)

SCORE_FILE = "user_score.json"

def get_current_score_data():
    if os.path.exists(SCORE_FILE):
        with open(SCORE_FILE, "r") as f:
            return json.load(f)
    return {"total_score": 50, "daily_score": 0, "date": datetime.now().strftime("%Y-%m-%d")}

def update_and_save_score():
    try:
        # 1. Load current score
        data = get_current_score_data()
        current_score = data["total_score"]
        
        # 2. Load Mock Data for calculation
        if not os.path.exists("mock_health_data.csv"):
            from gemini_service import generate_mock_data
            generate_mock_data()
            
        df = pd.read_csv("mock_health_data.csv")
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        last_timestamp = df['Timestamp'].max()
        start_timestamp = last_timestamp - pd.Timedelta(hours=8)
        night_data = df[(df['Timestamp'] >= start_timestamp) & (df['Timestamp'] <= last_timestamp)]
        
        # 3. Calculate Base Daily Score
        daily, _ = calculate_sleep_score(night_data, current_score)
        
        # 4. Apply Bonus/Penalty from Session Events
        if os.path.exists("session_events.json"):
            try:
                with open("session_events.json", "r") as f:
                    events = json.load(f)
                
                # Check for Emergency
                emergency_count = sum(1 for e in events if e.get("status") == "Emergency")
                
                if emergency_count > 0:
                    print(f"DEBUG: {emergency_count} Emergency events detected. Score unchanged.")
                    daily = 0.0
                else:
                    awake_count = sum(1 for e in events if e.get("status") == "Awake")
                    print(f"DEBUG: Awake Count: {awake_count}")
                    
                    if awake_count == 0:
                        print("DEBUG: No Awake events. Applying max bonus.")
                        daily = 10.0 # Max daily score
                    else:
                        print(f"DEBUG: Applying penalty for {awake_count} events.")
                        penalty = (awake_count * 5)
                        daily -= penalty
            except Exception as e:
                print(f"Error reading session events: {e}")

        print(f"DEBUG: Math: {current_score} + {daily} = {current_score + daily}")

        # 5. Update Total
        new_total = max(0, min(current_score + daily, 100))
        
        # 6. Save
        new_data = {
            "total_score": round(new_total, 1),
            "daily_score": round(daily, 2),
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        with open(SCORE_FILE, "w") as f:
            json.dump(new_data, f)
            
        print(f"DEBUG: Score Updated: {new_data}")
        return new_data
        
    except Exception as e:
        print(f"Error updating score: {e}")
        return get_current_score_data()

def get_weekly_scores():
    """
    Returns the currently stored score.
    """
    return get_current_score_data()
