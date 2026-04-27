# Add these to your backend/main.py

# --- NEW: CHAT ASSISTANT ENDPOINT ---
class ChatRequest(BaseModel):
    user_input: str
    context: str

@app.post("/chat")
async def chat_with_aura(req: ChatRequest):
    prompt = f"""
    You are Aura, an SRE AI Assistant. 
    Context of the incident: {req.context}
    User Question: {req.user_input}
    
    Provide a concise, technical answer based on the incident. 
    If they ask about safety, mention the QA validation suite.
    """
    try:
        completion = ai_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- NEW: REMEDIATION TERMINAL ENDPOINT ---
@app.get("/remediate")
async def get_remediation_steps():
    # Simulating a real Git Hotfix workflow
    return {
        "steps": [
            " [SYSTEM] Initializing hotfix sequence...",
            " [GIT] git checkout -b hotfix/npe-fix-auth-service",
            " [AST] Patching AuthService.java at line 8...",
            " [QA] Running pre-commit validation tests...",
            " [QA] Integrity check: 100% Passed.",
            " [GIT] git add .",
            " [GIT] git commit -m 'fix: implement Yoda condition null-safety'",
            " [GIT] git push origin hotfix/npe-fix-auth-service",
            " [AURA] Triggering K8s rolling update...",
            " [SUCCESS] Pod payment-api-x2 stabilized. MTTR: 0.82s"
        ]
    }