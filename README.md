# 🎤 Medical Speech-to-Text Transcription Engine

A backend-powered application that converts audio recordings into structured, readable text using speech recognition and intelligent post-processing. Designed for clinical and professional transcription workflows.

---

## 🚀 Features

- 🎙️ Speech-to-text transcription using Whisper
- 📂 Upload support for **MP3, WAV, M4A, MP4**
- 🧠 Intelligent text post-processing:
  - Removes numbering artifacts (e.g., `08`, `09`)
  - Eliminates CPT/CBT codes automatically
  - Fixes spoken phrases like _“quotes … closed quotes”_
  - Cleans punctuation at paragraph starts
- 📑 Automatic paragraph structuring
- 🌐 API-based backend using FastAPI
- 🖥️ Interactive frontend (HTML, CSS, JavaScript)
- 🌙 Dark mode support

---

## 🛠️ Tech Stack

- Backend: FastAPI, Uvicorn
- Speech Model: OpenAI Whisper
- Frontend: HTML, CSS, JavaScript
- Audio Processing: FFmpeg

---

## 📂 Project Structure

```
speech-to-text-whisper/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│
├── frontend/
│   ├── homepage.html
│   ├── homepage.js
│   ├── homepage.css
│
├── README.md
└── render.yaml (optional)
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AdityaAS2268/speech-to-text-whisper.git
cd speech-to-text-whisper
```

### 2️⃣ Backend setup

```bash
cd backend
pip install -r requirements.txt
```

### 3️⃣ Run the backend

```bash
uvicorn app:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

### 4️⃣ Run the frontend

- Open `homepage.html` using Live Server (VS Code recommended)

---

## 📡 API Endpoint

### POST `/transcribe`

Upload an audio file and receive a transcription.

#### Request:

- `file`: audio file (mp3, wav, m4a, mp4)

#### Response:

```json
{
  "text": "Transcribed and formatted output"
}
```

---

## 🧠 Text Processing Logic

The system applies rule-based transformations to improve readability:

- Removes numbering artifacts:
  ```
  08. → (removed)
  ```
- Eliminates CPT/CBT codes entirely:
  ```
  CPT code 99395 → (removed)
  ```
- Converts spoken quotes:
  ```
  quotes hello closed quotes → "hello"
  ```
- Ensures clean paragraph starts (no punctuation)
- Auto-capitalization and sentence completion

---

## ⚠️ Limitations

- CPU-based inference may be slower for long audio files
- Large files may take significant processing time

---

## 🔮 Future Improvements

- Real-time streaming transcription
- Speaker diarization
- Medical terminology correction
- Export formats (PDF, DOCX)
- UI enhancements

---

## 👨‍💻 Author

**Aditya A S**

---

## 📄 License

This project is open-source and available under the MIT License.
