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

@app.websocket("/ws/emotion")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    client_id = str(id(websocket))
    client_emotions[client_id] = []
    
    try:
        while True:
            data = await websocket.receive_text()
            frame_data = json.loads(data)
            
            image_bytes = base64.b64decode(frame_data['image'])
            image_array = np.frombuffer(image_bytes, dtype=np.uint8)
            frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            results = model.predict(frame, verbose=False)
            
            emotions = []
            for result in results:
                for box in result.boxes:
                    emotion = box.cls.item()  # Get the emotion class
                    emotions.append(emotion)
            
            client_emotions[client_id].extend(emotions)
            
            await websocket.send_text(json.dumps({
                'emotions': emotions,
                'most_common': Counter(emotions).most_common(1)[0][0] if emotions else None
            }))
            
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