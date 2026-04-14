# 💬 Tone AI Assistant

An AI-powered web application that improves user-written text by correcting grammar, identifying mistakes, and generating multiple tone variations such as formal, polite, and friendly.

---

## 🚀 Features

- ✍️ Sentence correction
- 🧠 Grammar and mistake detection
- 🎯 Multiple tone generation:
  - Formal
  - Polite
  - Friendly
- 🎤 Voice input support
- 🔄 Model switching:
  - 🟢 Local (Ollama - Llama 3)
  - 🔵 Cloud (OpenRouter - Nemotron)
- 🔐 Secure API handling using `.env`

---

## 🏗️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** FastAPI  
- **AI Models:**
  - Ollama (Local)
  - OpenRouter (Cloud)

---

## 📁 Project Structure


tone-ai-project/
│
├── app.py # FastAPI backend
├── index.html # UI
├── style.css # Styling
├── script.js # Frontend logic
├── .env # API keys (not pushed to GitHub)
├── .gitignore # Ignores sensitive files
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/laxmikant-thakur/tone-ai
cd tone-ai-project
### 2️⃣ Install dependencies
pip install fastapi uvicorn requests python-dotenv
### 3️⃣ Setup Environment Variables

Create a .env file in the root directory:

OPENROUTER_API_KEY=your_api_key_here
### 4️⃣ Setup .gitignore

Make sure .env is included:

.env
### 5️⃣ Run Ollama (Local Model)

Install Ollama and run:

ollama run llama3
### 6️⃣ Start Backend Server
uvicorn app:app --reload
### 7️⃣ Run Frontend

Open index.html in your browser

### 🧪 How to Use
Enter your sentence

Select model:
Ollama (Local)
OpenRouter (Cloud)

Click Improve
View results:
Corrected sentence
Mistakes
Formal version
Polite version
Friendly version
### 🔐 Security
API keys are stored in .env
.env is excluded using .gitignore
No sensitive data is exposed in frontend
### 🎯 Example
Input:
mam i want to submit assignment tomorrow because i was sick

Output:
Corrected sentence
Grammar mistakes
Formal tone
Polite tone
Friendly tone


### 🔥 Future Improvements
⏳ Loading spinner
📋 Copy-to-clipboard feature
🌙 Dark mode
🔄 Auto model fallback
⚡ Streaming responses
🧠 Learning Outcome

### This project demonstrates:

Full-stack AI integration
Secure API handling
Multi-model architecture (Local + Cloud)
FastAPI backend development
Real-world AI application design


### 👨‍💻 Author

Laxmikant Thakur


### ⭐ Support

If you found this project useful, consider giving it a star ⭐