<div align="center">

  <img src="frontend/public/favicon.svg" width="120" height="120" alt="Aura Logo">

  <br/>

  [![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=BEF35E&center=true&vCenter=true&width=600&lines=🛰️+Project+Aura;Source-Aware+AIOps+Engine;Root+Cause+%E2%86%92+Sub-second+Insights;Self-Healing+Kubernetes+Clusters)](https://git.io/typing-svg)

  <br/>

  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=2000&color=888888&center=true&vCenter=true&width=620&lines=Bridging+the+%22Context+Gap%22+between+Infrastructure+Crashes+and+Source+Code+Logic." alt="Subtitle"/>

  <br/><br/>

  [![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
  [![Llama](https://img.shields.io/badge/Llama_3.3-70B-bef35e?style=for-the-badge&logo=meta&logoColor=black)](https://groq.com)
  [![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)

  <br/>

</div>

---

## 🚩 The Problem : The "Context Gap"

Traditional monitoring tools (Datadog, Prometheus) tell you *that* a service has failed — e.g., `CrashLoopBackOff` — but not *why* in the context of your code. Engineers waste hours:

1. Fetching logs from failing Pods
2. Matching logs to specific Git Commit IDs
3. Manually hunting for the buggy line in the repository

**Project Aura turns these hours into sub-second insights.**

---

## ✨ What Aura Does

Aura is an automated **Root Cause Analysis (RCA)** orchestrator that links infrastructure events directly to application logic.

| Feature | Description |
|---|---|
| 🕵️ **Automated Detection** | Watches the K8s API for failure events in real-time |
| 🔗 **Source-Aware Linking** | Clones the repo and uses **AST** to pinpoint the failing method |
| 🧠 **AI Reasoning** | Feeds `[Log + Code Context]` into **Llama 3.3** to generate a human-readable fix |
| 🛡️ **QA Gatekeeper** | Validates AI-generated hotfixes through an automated safety suite before suggesting remediation |

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph Infrastructure["⚙️ Infrastructure"]
        A[🌐 Kubernetes Cluster] -->|V1Event| B[👁️ Aura Watcher]
        B -->|JSON Payload| C{📨 Kafka Event Bus}
    end

    subgraph Intelligence["🧠 Intelligence"]
        C -->|Stream| D[⚡ FastAPI Engine]
        D -->|AST Search| E[📂 Source Code Repo]
        E -->|Logic Context| F[🤖 Llama 3.3 AI]
    end

    subgraph Remediation["🛡️ Remediation"]
        F -->|RCA Report| G[📊 React Dashboard]
        G -->|User Hotfix| H[🐙 GitHub Repository]
    end

    style F fill:#bef35e,stroke:#000,stroke-width:2px,color:#000
    style G fill:#bef35e,stroke:#000,stroke-width:2px,color:#000
    style C fill:#1e1b4b,stroke:#a5b4fc,stroke-width:1px,color:#fff
    style A fill:#326CE5,stroke:#fff,stroke-width:1px,color:#fff
    style B fill:#326CE5,stroke:#fff,stroke-width:1px,color:#fff
    style D fill:#009688,stroke:#fff,stroke-width:1px,color:#fff
    style E fill:#333,stroke:#aaa,stroke-width:1px,color:#fff
    style H fill:#24292e,stroke:#fff,stroke-width:1px,color:#fff
```

---

## ⚙️ Engineering Highlights

### 1. Intelligence Layer (Python / FastAPI)
The engine uses a **Recursive File Linker**. When a crash is detected at `AuthService.java:124`, it recursively searches the project tree, extracts the surrounding logic, and constructs a high-fidelity prompt for the LLM.

### 2. Self-Healing Workflow
Aura implements a full-circle remediation loop:

- **Intercept** — Catch `V1Event` from Kubernetes
- **Synthesize** — Map the stack trace to local `.java` source code
- **Reason** — LLM identifies logic flaws (e.g., missing Yoda-condition)
- **Validate** — QA suite scans the fix for safety violations (e.g., `System.exit`)

### 3. Interactive Playground
The **Cinematic Subspace Lab** lets you simulate infrastructure chaos and watch the "Nervous System" of the cluster respond in real-time — with Aura characters (Watcher, Oracle, Shield) orchestrating a self-healing cycle.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **DevOps** | Kubernetes (EKS), Fabric8, Apache Kafka |
| **AI / ML** | Llama 3.3 (70B), Groq Inference, LangChain |
| **Backend** | Python, FastAPI |
| **Source Analysis** | Java, AST Parsing |
| **Frontend** | React, Tailwind CSS v4, Framer Motion |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- A running Kubernetes cluster
- A [Groq API key](https://groq.com)

### Backend

```bash
cd backend
cp .env.example .env        # Add your GROQ_API_KEY
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>Built with ❤️ by <b>Xynash</b></p>
  <p><i>Aura is dedicated to reducing MTTR through Source-Aware AIOps.</i></p>
</div>
 
