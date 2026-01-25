/* =====================
   ELEMENT REFERENCES
===================== */
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const transcript = document.getElementById('transcript');
const statusIndicator = document.getElementById('statusIndicator');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const demoBtn = document.getElementById('demoBtn');
const languageSelect = document.getElementById('languageSelect');
const notification = document.getElementById('notification');
const splitCodeInput = document.getElementById('splitCode');
const dictationMode = document.getElementById('dictationMode');
const uploadMode = document.getElementById('uploadMode');
const uploadSection = document.getElementById('uploadSection');
const dictationControls = document.getElementById('dictationControls');
const darkToggle = document.getElementById('darkToggle');

const audioFileInput = document.getElementById('audioFile');
const whisperBtn = document.getElementById('whisperBtn');
const filePickerBtn = document.getElementById('filePickerBtn');
const fileName = document.getElementById('fileName');


/* =====================
   STATE
===================== */
let recognition = null;
let finalTranscript = '';
let isRecording = false;

/* =====================
   THEME RESTORE
===================== */
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  darkToggle.textContent = '☀️ Light Mode';
}

/* =====================
   SPEECH RECOGNITION
===================== */
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isRecording = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    startBtn.classList.add('recording-glow');

    statusIndicator.className = 'status-indicator status-listening';
    statusIndicator.innerHTML = '🎙 Listening...';
  };

  recognition.onresult = (e) => {
    let interim = '';

    for (let i = e.resultIndex; i < e.results.length; i++) {
      const text = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        finalTranscript += text + ' ';
      } else {
        interim += text;
      }
    }

    transcript.innerHTML =
      formatTranscript(finalTranscript) +
      `<p class="interim">${interim}</p>`;

    updateStats();
    transcript.scrollTop = transcript.scrollHeight;
  };

  recognition.onend = stopRecording;
}

/* =====================
   CONTROLS
===================== */
startBtn.onclick = () => {
  recognition.lang = languageSelect.value;
  recognition.start();
};

stopBtn.onclick = () => recognition.stop();

function stopRecording() {
  isRecording = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  startBtn.classList.remove('recording-glow');

  statusIndicator.className = 'status-indicator status-idle';
  statusIndicator.textContent = 'Ready to listen';
}

/* =====================
   FORMAT
===================== */
function applySpecialRules(text) {

  /* 1️⃣ Remove leading numbering (08, 09., 1), etc.) */
  text = text.replace(
    /(^|\n)\s*\d{1,3}[\.,)]?\s+/g,
    '$1'
  );

  /* 2️⃣ Remove leading punctuation at paragraph start */
  text = text.replace(
    /(^|\n)\s*[.,:;–\-]+\s*/g,
    '$1'
  );

  /* 3️⃣ Handle spoken quotes → "..." */
  text = text.replace(
    /\bquotes\s+(.*?)\s+(?:closed|close)\b/gi,
    '"$1"'
  );

  /* 4️⃣ Remove stray 'close' or 'closed' left behind */
  text = text.replace(
    /\b(close|closed)\b/gi,
    ''
  );

  /* 5️⃣ Force CPT / CBT into paragraph break AND REMOVE IT */
  text = text.replace(
    /\s*(C[PB]T\s*code\s*\d+)\s*/gi,
    '\n'
  );

  /* 6️⃣ Normalize whitespace after edits */
  text = text.replace(/\n{2,}/g, '\n');

  return text.trim();
}

function formatTranscript(text) {
  text = applySpecialRules(text);

  const code = splitCodeInput.value.trim();

  return text
    .split(/\n+/)            // 👈 paragraph split now works reliably
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      // Capitalize first letter
      let t = p.charAt(0).toUpperCase() + p.slice(1);

      // Ensure punctuation at end
      if (!/[.!?]$/.test(t)) t += '.';

      return `<p>${t}</p>`;
    })
    .join('');
}

/* =====================
   STATS
===================== */
function updateStats() {
  document.getElementById('wordCount').textContent =
    finalTranscript.trim()
      ? finalTranscript.trim().split(/\s+/).length + ' words'
      : '0 words';

  document.getElementById('charCount').textContent =
    finalTranscript.length + ' characters';
}

/* =====================
   ACTIONS
===================== */
copyBtn.onclick = () => navigator.clipboard.writeText(transcript.innerText);
clearBtn.onclick = () => { finalTranscript = ''; transcript.innerHTML = ''; updateStats(); };
exportBtn.onclick = () => {
  const blob = new Blob([transcript.innerText], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'transcript.txt';
  a.click();
};

demoBtn.onclick = () => {
  finalTranscript = 'hello this is a demo 01234 this shows paragraph splitting';
  transcript.innerHTML = formatTranscript(finalTranscript);
  updateStats();
};

/* =====================
   MODE TOGGLE
===================== */
dictationMode.onclick = () => {
  dictationMode.classList.add('active');
  uploadMode.classList.remove('active');
  uploadSection.classList.add('hidden');
  dictationControls.classList.remove('hidden');
};

uploadMode.onclick = () => {
  uploadMode.classList.add('active');
  dictationMode.classList.remove('active');
  uploadSection.classList.remove('hidden');
  dictationControls.classList.add('hidden');
};

/* =====================
   FILE PICKER
===================== */
filePickerBtn.onclick = () => audioFileInput.click();

audioFileInput.onchange = () => {
    if (audioFileInput.files.length > 0) {
        const file = audioFileInput.files[0];

        fileName.textContent = file.name;

        whisperBtn.disabled = false;
        whisperBtn.style.pointerEvents = "auto";
        whisperBtn.style.opacity = "1";
    } else {
        fileName.textContent = "No file selected";

        whisperBtn.disabled = true;
        whisperBtn.style.pointerEvents = "none";
        whisperBtn.style.opacity = "0.5";
    }
};

/* =====================
   DARK MODE
===================== */
darkToggle.onclick = () => {
  const dark = document.body.classList.toggle('dark');
  darkToggle.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
};

whisperBtn.addEventListener("click", () => {
    if (!audioFileInput.files.length) {
        showNotification("Please select an audio file");
        return;
    }

    const file = audioFileInput.files[0];
    transcribeWithFastAPI(file);
});

async function transcribeWithFastAPI(file) {
    showNotification("Uploading audio for transcription...", "success");

    whisperBtn.disabled = true;
    whisperBtn.textContent = "⏳ Transcribing...";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/transcribe", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Transcription failed");
        }

        const result = await response.json();

        finalTranscript = result.text.trim();
        transcript.innerHTML = formatTranscript(finalTranscript);
        updateStats();

        showNotification("Transcription complete!", "success");

    } catch (err) {
        console.error(err);
        showNotification("Backend error. Check FastAPI server.");
    } finally {
        whisperBtn.disabled = false;
        whisperBtn.textContent = "🎙️ Transcribe with Whisper";
    }
}

function showNotification(message, type = "error") {
  notification.textContent = message;
  notification.style.background =
    type === "success" ? "#16a34a" : "#dc2626";

  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}
