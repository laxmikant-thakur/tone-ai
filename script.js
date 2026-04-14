let isRecording = false;
let recognition;

// Initialize Speech Recognition
function startVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support voice input");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    
    // UI Update: Show listening state
    const btn = document.getElementById('speakBtn');
    btn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i> Listening...';
    btn.classList.add('recording', 'text-white', 'border-red-500');
    btn.classList.remove('text-slate-600', 'bg-white', 'hover:bg-blue-50');

    recognition.start();

    recognition.onresult = function(event) {
        const speechText = event.results[0][0].transcript;
        const textArea = document.getElementById("inputText");
        textArea.value = textArea.value ? textArea.value + ' ' + speechText : speechText;
        stopRecordingUI();
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error", event);
        stopRecordingUI();
    };
    
    recognition.onend = function() {
        stopRecordingUI();
    };
}

function stopRecordingUI() {
    const btn = document.getElementById('speakBtn');
    btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Speak';
    btn.classList.remove('recording', 'text-white', 'border-red-500');
    btn.classList.add('text-slate-600', 'bg-white', 'hover:bg-blue-50');
}

async function sendText() {
    const text = document.getElementById("inputText").value.trim();
    const model = document.getElementById("modelSelect").value;
    
    if (!text) {
        showStatus("Please enter some text first! ✍️", "error");
        return;
    }

    // UI Update: Show Loading State
    const btn = document.getElementById('improveBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    showStatus("Processing with " + model + "...", "loading");
    document.getElementById("result").classList.add('hidden');
    document.getElementById("result").classList.remove('fade-in');

    try {
        // Call Your Local Backend
        const response = await fetch("http://127.0.0.1:8000/improve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                text: text,
                model: model
            })
        });

        if (!response.ok) throw new Error("Backend error");

        const data = await response.json();

        // Show Results in the Tailwind UI
        document.getElementById("result").classList.remove('hidden');
        document.getElementById("result").classList.add('fade-in');

        document.getElementById("corrected").innerText = data.corrected || "No corrections needed.";
        document.getElementById("mistakes").innerText = data.mistakes || "None detected.";
        document.getElementById("formal").innerText = data.formal || text;
        document.getElementById("polite").innerText = data.polite || text;
        document.getElementById("friendly").innerText = data.friendly || text;

        showStatus("Done", "success");

    } catch (error) {
        console.error("API Error:", error);
        showStatus("Failed to reach backend. Make sure your local server is running!", "error");
    } finally {
        // Reset button UI
        btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Improve Text';
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.innerText = message;
    statusEl.classList.remove('hidden', 'text-blue-600', 'text-red-600', 'text-green-600', 'bg-blue-50', 'bg-red-50', 'bg-green-50');
    
    if (type === 'loading') {
        statusEl.classList.add('text-blue-600', 'bg-blue-50', 'block');
    } else if (type === 'error') {
        statusEl.classList.add('text-red-600', 'bg-red-50', 'block');
        setTimeout(() => statusEl.classList.add('hidden'), 4000);
    } else if (type === 'success') {
        statusEl.classList.add('text-green-600', 'bg-green-50', 'block');
        setTimeout(() => statusEl.classList.add('hidden'), 3000);
    }
}

// Copy functionality added for better UX
function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    const fallbackCopy = (textToCopy) => {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showStatus("Copied to clipboard! 📋", "success");
        } catch (err) {
            showStatus("Failed to copy.", "error");
        }
        document.body.removeChild(textArea);
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showStatus("Copied to clipboard! 📋", "success");
        }).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}