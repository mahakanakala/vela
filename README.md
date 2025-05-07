# VELA - Emotion Detection App

![Vela Logo](app/assets/vela-logo.png) <!-- Add your logo if available -->

A real-time emotion detection application built with React Native, TypeScript, and FastAPI. The app uses computer vision to detect and analyze emotions from video input.

## 🌟 Features

- Real-time emotion detection from camera feed
- User authentication (Firebase)
- Responsive UI with theme support
- Cross-platform support (iOS, Android)
- Model integration for emotion analysis

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Python 3.8+
- Expo CLI
- Firebase account (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vela.git
   cd vela
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     FIREBASE_API_KEY=your_api_key
     FIREBASE_AUTH_DOMAIN=your_auth_domain
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_STORAGE_BUCKET=your_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     FIREBASE_APP_ID=your_app_id
     ```

## 🧠 Model Integration

### Adding a New Model

1. Place your model files in the `backend/models` directory
2. Supported formats: YOLO (.pt) or ONNX (.onnx)
3. Update the model loading code in `backend/app.py` if needed

### Using the Default Model

The app comes with a pre-trained emotion detection model. To use it:

1. Download the model file (best.pt) and place it in `backend/models/`
2. The backend will automatically load the model on startup

### Training a Custom Model

1. Prepare your dataset in YOLO format
2. Use the training script:
   ```bash
   python backend/train.py --data your_dataset.yaml --epochs 100 --weights yolov5s.pt
   ```
3. The best model will be saved in `backend/runs/train/`

## 🏃 Running the App

### Start the Backend

```bash
cd backend
uvicorn app:app --reload
```

### Start the Frontend

```bash
# For web
expo start --web

# For iOS
expo start --ios

# For Android
expo start --android
```

## 🛠 Project Structure

```
vela/
├── app/                   # Frontend React Native app
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable components
│   ├── screens/           # App screens
│   ├── theme/             # Theme configuration
│   └── navigation/        # Navigation setup
├── backend/               # Python backend
│   ├── models/            # Model files
│   ├── app.py             # FastAPI server
│   └── requirements.txt   # Python dependencies
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [YOLO](https://github.com/ultralytics/yolov5)
