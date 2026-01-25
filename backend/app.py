from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import tempfile
import os
import subprocess

app = FastAPI()

# Allow frontend (HTML/JS) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper once
model = whisper.load_model("small")

def convert_to_wav(input_path):
    output_path = input_path.replace(".mp4", ".wav")
    subprocess.run(
        ["ffmpeg", "-y", "-i", input_path, output_path],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    return output_path

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save uploaded file
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as temp:
        temp.write(await file.read())
        temp_path = temp.name

    # Convert MP4 → WAV if needed
    if temp_path.endswith(".mp4"):
        audio_path = convert_to_wav(temp_path)
    else:
        audio_path = temp_path

    # Transcribe
    result = model.transcribe(audio_path)

    # Cleanup
    os.remove(temp_path)
    if audio_path != temp_path:
        os.remove(audio_path)

    return {"text": result["text"]}

@app.get("/")
def root():
    return {"message": "FastAPI Whisper backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
