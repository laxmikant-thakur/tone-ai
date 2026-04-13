from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputText(BaseModel):
    text: str
    model: str

# 🔑 Put your real API key here
OPENROUTER_API_KEY = "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"

# 🔧 OpenRouter API function
def call_openrouter(prompt):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "nvidia/nemotron-3-super-120b-a12b:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post(url, headers=headers, json=data)

    # 🔥 Handle errors safely
    if response.status_code != 200:
        return f"Error: {response.text}"

    return response.json()["choices"][0]["message"]["content"]


def call_ollama(prompt):
    url = "http://localhost:11434/api/generate"

    response = requests.post(url, json={
        "model": "llama3",
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_predict": 150
        }
    })

    return response.json()["response"]

# 🧠 Prompt
def generate_prompt(user_text):
    return f"""
    You are an English writing assistant.

    Return ONLY in this format. No extra text. No quotes.

    Corrected: <correct sentence>
    Mistakes: <short bullet points>
    Formal: <formal version>
    Polite: <polite version>
    Friendly: <friendly version>

    Sentence: "{user_text}"
    """

# 🚀 API
@app.post("/improve")
def improve_text(data: InputText):
    prompt = generate_prompt(data.text)

    # 🔁 Call OpenRouter instead of Ollama
    if data.model == "ollama":
        result = call_ollama(prompt)
    else:
        result = call_openrouter(prompt)

    # 🧹 Parse output
    output = {
        "corrected": "",
        "mistakes": "",
        "formal": "",
        "polite": "",
        "friendly": ""
    }

    lines = result.split("\n")
    current_key = None

    for line in lines:
        line = line.strip()

        if line.startswith("Corrected:"):
            current_key = "corrected"
            output[current_key] = line.replace("Corrected:", "").strip()

        elif line.startswith("Mistakes:"):
            current_key = "mistakes"
            output[current_key] = line.replace("Mistakes:", "").strip()

        elif line.startswith("Formal:"):
            current_key = "formal"
            output[current_key] = line.replace("Formal:", "").strip()

        elif line.startswith("Polite:"):
            current_key = "polite"
            output[current_key] = line.replace("Polite:", "").strip()

        elif line.startswith("Friendly:"):
            current_key = "friendly"
            output[current_key] = line.replace("Friendly:", "").strip()

        elif current_key:
            output[current_key] += " " + line

    # 🔥 Remove unwanted quotes
    for key in output:
        output[key] = output[key].replace('"', '').strip()

    return output