from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
import base64
import numpy as np
from ultralytics import YOLO, checks
import json
from collections import Counter
import time
import sys

print("\nChecking system requirements...")
checks()

try:
    print("\nLoading emotion detection model...")
    model = YOLO('./models/best.pt')
    print("Model loaded successfully!")
except Exception as e:
    print(f"\nError loading model: {str(e)}")
    print("Please ensure your model file is compatible with the installed ultralytics version.")
    print("You can check your model's version by running:")
    print("python3 -c 'from ultralytics import YOLO; model = YOLO(\"./models/best.pt\"); print(model.info())'")
    sys.exit(1)

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO('./models/best.pt')

client_emotions = {}

# Define your class mapping here. Update this list to match your model's classes.
EMOTION_CLASSES = [
    'neutral', 'happy', 'sad', 'angry', 'surprised', 'disgust', 'fear'  # Example, update as needed
]

@app.websocket("/ws/emotion")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    client_id = str(id(websocket))
    client_emotions[client_id] = []
    
    try:
        while True:
            data = await websocket.receive_text()
            print(f"[WS] Received data from client {client_id}")
            frame_data = json.loads(data)
            
            image_bytes = base64.b64decode(frame_data['image'] if 'image' in frame_data else frame_data.get('data'))
            image_array = np.frombuffer(image_bytes, dtype=np.uint8)
            frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            print(f"[WS] Decoded image shape: {frame.shape if frame is not None else 'None'}")
            
            print("[WS] Running model prediction...")
            results = model.predict(frame, verbose=False)
            print(f"[WS] Model results: {results}")
            
            emotions = []
            emotion_names = []
            for result in results:
                for box in result.boxes:
                    emotion_idx = box.cls.item()  # Get the emotion class index
                    emotions.append(emotion_idx)
                    emotion_name = EMOTION_CLASSES[int(emotion_idx)] if int(emotion_idx) < len(EMOTION_CLASSES) else str(emotion_idx)
                    emotion_names.append(emotion_name)
            print(f"[WS] Predicted emotions: {emotions} (names: {emotion_names})")
            
            client_emotions[client_id].extend(emotions)
            # Most common
            most_common_idx = Counter(emotions).most_common(1)[0][0] if emotions else None
            most_common_name = EMOTION_CLASSES[int(most_common_idx)] if most_common_idx is not None and int(most_common_idx) < len(EMOTION_CLASSES) else str(most_common_idx)
            response = {
                'emotions': [
                    {'index': int(idx), 'name': EMOTION_CLASSES[int(idx)] if int(idx) < len(EMOTION_CLASSES) else str(idx)}
                    for idx in emotions
                ],
                'most_common': {
                    'index': int(most_common_idx) if most_common_idx is not None else None,
                    'name': most_common_name
                } if most_common_idx is not None else None
            }
            print(f"[WS] Sending response to client: {response}")
            await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        if client_emotions[client_id]:
            most_common_emotion = Counter(client_emotions[client_id]).most_common(1)[0][0]
            print(f"Client {client_id} disconnected. Most common emotion: {most_common_emotion}")
        del client_emotions[client_id]

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)