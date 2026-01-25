import gradio as gr
import whisper

# Load Whisper model (small is good for free CPU)
model = whisper.load_model("small")

def transcribe(audio_path):
    if audio_path is None:
        return ""

    result = model.transcribe(audio_path)
    return result["text"]

demo = gr.Interface(
    fn=transcribe,
    inputs=gr.Audio(type="filepath", label="Upload audio"),
    outputs=gr.Textbox(label="Transcription"),
    title="Whisper Speech-to-Text",
    description="Upload an audio file and get transcription using OpenAI Whisper"
)

demo.launch()
