let isRecording = false;
let recognition;

// ================= VOICE INPUT =================
function startVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support voice input");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";

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

    recognition.onerror = function() {
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

// ================= MAIN FUNCTION =================
async function sendText() {
    const text = document.getElementById("inputText").value.trim();
    const model = document.getElementById("modelSelect").value;

    if (!text) {
        showStatus("Please enter some text first! ✍️", "error");
        return;
    }

    const btn = document.getElementById('improveBtn');

    // Loading UI
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    showStatus("Processing with " + model + "...", "loading");

    const resultDiv = document.getElementById("result");
    resultDiv.classList.add('hidden');
    resultDiv.classList.remove('fade-in');

    try {
        const response = await fetch("https://tone-ai.onrender.com/improve", {
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

        // ✅ SAFE UI UPDATE (prevents crash)
        document.getElementById("corrected").innerText = data?.corrected ?? "No corrections needed.";
        document.getElementById("mistakes").innerText = data?.mistakes ?? "None detected.";
        document.getElementById("formal").innerText = data?.formal ?? text;
        document.getElementById("polite").innerText = data?.polite ?? text;
        document.getElementById("friendly").innerText = data?.friendly ?? text;

        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('fade-in');

        showStatus("Done", "success");

    } catch (error) {
        console.error("API Error:", error);
        showStatus("Failed to reach backend!", "error");

    } finally {
        // ✅ GUARANTEED RESET
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Improve Text';
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
        }, 200); // small delay ensures UI updates smoothly
    }
}

// ================= STATUS =================
function showStatus(message, type) {
    const status = document.getElementById("status");

    status.classList.remove("hidden");
    status.className = "text-sm font-medium text-center py-2 rounded-lg";

    if (type === "loading") {
        status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${message}`;
        status.classList.add("text-blue-600", "bg-blue-50");
    }
    else if (type === "success") {
        status.innerHTML = `✅ ${message}`;
        status.classList.add("text-green-600", "bg-green-50");

        setTimeout(() => {
            status.classList.add("hidden");
        }, 2000);
    }
    else if (type === "error") {
        status.innerHTML = `❌ ${message}`;
        status.classList.add("text-red-600", "bg-red-50");
    }
}

// ================= COPY =================
function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;

    if (!text) return;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showStatus("Copied to clipboard! 📋", "success"))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }

    function fallbackCopy(textToCopy) {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showStatus("Copied to clipboard! 📋", "success");
        } catch {
            showStatus("Failed to copy.", "error");
        }
        document.body.removeChild(textArea);
    }
}