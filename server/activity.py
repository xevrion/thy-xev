import json
import time
import threading
from datetime import datetime, timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from pynput import keyboard, mouse
import os

app = Flask(__name__)
CORS(app)

class ActivityTracker:
    def __init__(self):
        self.data = {
            'keystrokes': 0,
            'mouse_movements': 0,
            'left_mouse_clicks': 0,
            'right_mouse_clicks': 0,
            'last_updated': datetime.now().isoformat(),
            'session_start': datetime.now().isoformat()
        }
        self.data_file = 'activity_data.json'
        self.load_data()
        
    def load_data(self):
        """Load existing data or create new file"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    saved_data = json.load(f)
                    # Check if it's from today
                    last_updated = datetime.fromisoformat(saved_data['last_updated'])
                    if last_updated.date() == datetime.now().date():
                        self.data.update(saved_data)
                    else:
                        # New day, reset counters but keep session start
                        self.data['session_start'] = datetime.now().isoformat()
                        self.reset_daily_counters()
        except Exception as e:
            print(f"Error loading data: {e}")
    
    def save_data(self):
        """Save current data to file"""
        try:
            self.data['last_updated'] = datetime.now().isoformat()
            with open(self.data_file, 'w') as f:
                json.dump(self.data, f)
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def reset_daily_counters(self):
        """Reset counters for new day"""
        self.data.update({
            'keystrokes': 0,
            'mouse_movements': 0,
            'left_mouse_clicks': 0,
            'right_mouse_clicks': 0,
            'last_updated': datetime.now().isoformat()
        })
        self.save_data()
    
    def on_key_press(self, key):
        """Keyboard event handler"""
        self.data['keystrokes'] += 1
    
    def on_mouse_move(self, x, y):
        """Mouse movement handler (throttled)"""
        self.data['mouse_movements'] += 1
    
    def on_mouse_click(self, x, y, button, pressed):
        """Mouse click handler"""
        if pressed:
            if button == mouse.Button.left:
                self.data['left_mouse_clicks'] += 1
                # print("left")
            elif button == mouse.Button.right:
                self.data['right_mouse_clicks'] += 1
                # print("right")

    
    def start_tracking(self):
        """Start the input listeners"""
        print("🎯 Starting activity tracking...")
        
        # Keyboard listener
        keyboard_listener = keyboard.Listener(on_press=self.on_key_press)
        keyboard_listener.start()
        
        # Mouse listeners
        mouse_listener = mouse.Listener(
            on_move=self.on_mouse_move,
            on_click=self.on_mouse_click
        )
        mouse_listener.start()
        
        # Auto-save every 5 minutes
        def auto_save():
            while True:
                time.sleep(30)  # 5 minutes
                self.save_data()
                print(f"📊 Auto-saved: {self.data['keystrokes']} keys, {self.data['mouse_movements']} moves, {self.data['left_mouse_clicks']} left clicks, {self.data['right_mouse_clicks']} right clicks")
        
        threading.Thread(target=auto_save, daemon=True).start()
        
        return keyboard_listener, mouse_listener

# Initialize tracker
tracker = ActivityTracker()

@app.route('/activity', methods=['GET'])
def get_activity():
    """API endpoint to get current activity data"""
    # Calculate session duration
    session_start = datetime.fromisoformat(tracker.data['session_start'])
    session_duration = datetime.now() - session_start
    
    response_data = {
        **tracker.data,
        'session_duration_hours': round(session_duration.total_seconds() / 3600, 1),
        'uptime': str(session_duration).split('.')[0]  # Remove microseconds
    }
    
    return jsonify(response_data)

@app.route('/reset', methods=['POST'])
def reset_counters():
    """Reset daily counters (for testing)"""
    tracker.reset_daily_counters()
    return jsonify({"message": "Counters reset successfully"})

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "Activity tracker running!",
        "endpoints": {
            "activity": "/activity",
            "reset": "/reset"
        }
    })

if __name__ == '__main__':
    # Start tracking in background
    tracker.start_tracking()
    
    print("🚀 Activity tracker server starting on http://localhost:3002")
    print("📱 Add this to your portfolio: http://localhost:3002/activity")
    
    # Run Flask app
    app.run(host='127.0.0.1', port=3002, debug=False)