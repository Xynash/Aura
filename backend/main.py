import os
from fastapi import FastAPI
from groq import Groq
from dotenv import load_dotenv
from kubernetes import client, config, watch
import threading

# Load the API Key from the .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = FastAPI()

# Initialize Groq Client
ai_client = Groq(api_key=GROQ_API_KEY)

@app.get("/health")
def health():
    return {"status": "Aura Backend Active"}

@app.post("/analyze")
async def analyze_logs(pod_name: str, logs: str):
    """
    This endpoint takes K8s logs and asks Llama 3 to find the bug.
    """
    prompt = f"""
    You are a Senior SRE. Analyze the following Kubernetes logs for the pod '{pod_name}'.
    Identify the root cause of the crash and suggest a technical fix.
    
    LOGS:
    {logs}
    """
    
    # Talk to Llama 3
    completion = ai_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}],
    )
    
    return {
        "pod": pod_name,
        "analysis": completion.choices[0].message.content
    }

# K8s Watcher Logic stays here...