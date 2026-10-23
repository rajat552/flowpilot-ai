# FlowPilot AI — From Instructions to Verified Outcomes

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Nebius Token Factory](https://img.shields.io/badge/Nebius-Token_Factory-8A2BE2.svg)](https://nebius.com/services/token-factory)
[![NVIDIA Nemotron](https://img.shields.io/badge/NVIDIA-Nemotron--70B-76B900.svg)](https://build.nvidia.com/)
[![Track](https://img.shields.io/badge/Hackathon_Track-Best_Apps_and_Agents-orange.svg)](#hackathon-disclosure)

> **FlowPilot AI** is an autonomous AI workflow execution platform powered by **NVIDIA Nemotron** through **Nebius Token Factory**. It transforms natural-language goals into structured dependency-aware plans, executes registered tools, deterministically audits the outcomes against explicit acceptance criteria, and generates authenticated deliverables with verified citations.

---

## 🏆 Hackathon Disclosure

- **Hackathon:** Nebius × NVIDIA Global AI Hackathon
- **Track:** Best Apps and Agents
- **Primary AI Service:** [Nebius Token Factory](https://api.tokenfactory.nebius.com/v1/)
- **Model Used:** `nvidia/llama-3.1-nemotron-70b-instruct` (or `nvidia/nemotron-4-340b-instruct`)
- **Key Differentiator:** **Verified Execution.** Rather than presenting plausible LLM text as proof of success, FlowPilot distinguishes between *proposing an action*, *attempting an action*, and *verifying that the outcome satisfied deterministic acceptance rules*.

---

## 🚀 The 7-Stage Execution Loop

```
Understand ➔ Plan ➔ Validate ➔ Execute ➔ Verify ➔ Recover ➔ Deliver
```

1. **Understand (Intake):** Normalizes instructions, checks length, enforces tool safety constraints.
2. **Plan (Decomposition):** Generates a structured Directed Acyclic Graph (DAG) using NVIDIA Nemotron on Nebius Token Factory.
3. **Validate (Safety Gate):** Enforces human review. Inspects registered tool permissions, detects circular dependencies, and requires explicit user approval before execution starts.
4. **Execute (Orchestration):** Runs registered tools in topological dependency order (`web_search`, `fetch_webpage`, `extract_facts`, `generate_report`).
5. **Verify (Audit):** Evaluates collected facts, authentic URLs, pricing details, and report completeness against deterministic acceptance criteria.
6. **Recover (Bounded Adaptation):** Automatically adapts search queries, handles transient network blurs, and bounds retries to prevent runaway loops.
7. **Deliver (Persistence):** Generates and stores structured Markdown and JSON reports with authentic citations.

---

## 🛠️ Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **AI Inference** | **Nebius Token Factory** | OpenAI-compatible high-throughput inference endpoint |
| **Model** | **NVIDIA Nemotron-70B-Instruct** | Structured planning, goal decomposition & quality critique |
| **Backend** | **Node.js 22 LTS + Express + TypeScript** | Agent orchestrator, SSE streaming, DAG runner, tool registry |
| **Validation** | **Zod** | Strict schema validation for plans, tool inputs, and outputs |
| **Frontend** | **React 18 + Vite + Tailwind CSS** | Real-time SSE timeline, plan review gate, artifact viewer |
| **Icons & UI** | **Lucide React + Neo-Brutalist Theme** | Accessible, responsive, MLH-inspired engineering blueprint styling |
| **Search Engine**| **Tavily + DuckDuckGo HTML Fallback** | Live web search with authentic citations and URLs |
| **Security** | **SSRF Guard + Secret Redaction** | Loopback/metadata IP blocking and credential sanitization |
| **Persistence** | **JSON State Store / MongoDB Driver** | State survives restarts; full event sequence replay |
| **Testing** | **Vitest** | Unit, tool execution, and end-to-end integration tests |

---

## 📦 Monorepo Structure

```text
flowpilot-ai/
├── apps/
│   ├── api/                     # Express backend orchestrator
│   │   ├── src/
│   │   │   ├── config/          # Environment configuration
│   │   │   ├── events/          # SSE EventBus & client broadcasting
│   │   │   ├── evaluations/     # 15-scenario repeatable benchmark suite
│   │   │   ├── repositories/    # Persistent store (restart-safe)
│   │   │   ├── routes/          # REST & SSE endpoints
│   │   │   ├── services/
│   │   │   │   ├── ai/          # Nebius Token Factory client
│   │   │   │   ├── executor/    # Topological DAG execution engine
│   │   │   │   ├── planner/     # Structured Nemotron plan decomposition
│   │   │   │   ├── recovery/    # Bounded retry & query reformulation
│   │   │   │   └── verifier/    # Deterministic acceptance auditor
│   │   │   ├── tools/           # Registered tools (search, fetch, extract, report)
│   │   │   └── utils/           # SSRF validator, safe redacted logger
│   │   └── tests/               # Unit, integration & E2E tests
│   │
│   └── web/                     # React 18 + Vite frontend application
│       ├── src/
│       │   ├── components/      # Dashboard, Timeline, Plan Review, Artifacts
│       │   ├── hooks/           # useRunEvents (SSE subscription)
│       │   └── lib/             # API client functions
│
├── packages/
│   └── shared/                  # Shared Zod schemas, types & state machines
│
├── docs/                        # Phase status audit tracking
├── Dockerfile                   # Multi-stage production container build
├── docker-compose.yml           # Complete containerized service stack
├── ARCHITECTURE.md              # Deep architectural diagrams & trust boundaries
├── TESTING.md                   # Test suite results & benchmark evidence
├── workflows.md                 # Authoritative workflow specification
└── LICENSE                      # Apache-2.0 License
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js:** `v20.0.0` or `v22.0.0+`
- **npm:** `v10.0.0+`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/rajat552/flowpilot-ai.git
cd flowpilot-ai
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` to include your Nebius Token Factory API key:
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Nebius Token Factory (NVIDIA Nemotron)
NEBIUS_API_KEY=your_nebius_api_key_here
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1/
NEBIUS_MODEL_ID=nvidia/llama-3.1-nemotron-70b-instruct

# Optional: Tavily API Key (FlowPilot includes built-in search fallback if unset)
TAVILY_API_KEY=
```

### 3. Build Shared Contracts & Packages
```bash
npm run build
```

### 4. Run Development Servers
In two terminal tabs (or using `npm run dev`):

```bash
# Terminal 1: Backend API Orchestrator (Port 4000)
npm run dev:api

# Terminal 2: Web UI (Port 5173)
npm run dev:web
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

FlowPilot includes a complete test suite covering shared schemas, tool executions, SSRF prevention, and full end-to-end research workflows:

```bash
# Run all tests
npm test

# Run API & Agent integration tests specifically
npm run test --workspace=@flowpilot/api
```

### Actual Test Results (Verified)
```text
 ✓ tests/contracts.test.ts (5 tests)
 ✓ tests/tools.test.ts (5 tests)
 ✓ tests/workflow.test.ts (2 tests)

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Duration  8.18s
```

See [TESTING.md](TESTING.md) for full benchmark and evaluation details.

---

## 🐳 Docker Deployment

Run FlowPilot AI as a containerized stack:

```bash
docker compose up --build -d
```

The application will be accessible on port `4000`.

---

## 💡 Nebius Token Factory & NVIDIA Nemotron Integration

FlowPilot AI leverages **Nebius Token Factory** to access high-performance GPU-accelerated **NVIDIA Nemotron** open models (`nvidia/llama-3.1-nemotron-70b-instruct`):

1. **Structured Topological Planning:** Nemotron-70B's strong reasoning capabilities deconstruct vague user goals into strongly typed Directed Acyclic Graphs (DAGs) with strict input/output step dependencies.
2. **Quality & Critique Verification:** During the audit stage, Nemotron evaluates synthesized research findings against explicit acceptance criteria, ensuring verifiable accuracy before delivery.
3. **Low-Latency Streaming:** Nebius Token Factory's optimized inference delivery provides sub-second first-token latencies, enabling smooth real-time SSE progress streaming to the frontend.
4. **Resilient Production Fallback:** The backend client gracefully handles rate limits and API outages with bounded retries and deterministic fallback behavior.

---

## 💬 Feedback on Nebius Token Factory & NVIDIA Technologies

*Submitted as part of the official hackathon feedback requirements:*

- **Nebius Token Factory:**
  - *Strengths:* Exceptional throughput and blazing-fast time-to-first-token (TTFT) on NVIDIA GPU infrastructure. Drop-in OpenAI API compatibility allowed rapid integration without needing proprietary SDKs.
  - *Opportunities:* Providing native structured JSON schema enforcement (`response_format: { type: "json_object" }` with schema validation) at the API gateway level would further accelerate agent developers creating complex DAGs.
- **NVIDIA Nemotron-70B:**
  - *Strengths:* Outstanding step-by-step reasoning and instruction following. It consistently followed strict JSON output formats and demonstrated superior tool dependency ordering compared to standard general-purpose open models.
  - *Opportunities:* Additional quantized lightweight variants (e.g., Nemotron-8B or Nemotron-Nano) optimized on Token Factory would be great for micro-task verification steps where low compute overhead is desired.

---

## 📝 Submission Period Disclosure

This project, **FlowPilot AI**, was developed from scratch specifically for the **NVIDIA × Nebius Global AI Hackathon (Best Apps and Agents Track)** during the official submission period. All architecture, backend orchestration, frontend blueprint UI, test suites, and integration logic were created for this competition.

---

## 🔒 Security & Agent Guardrails

- **Zero Arbitrary Execution:** FlowPilot does not execute arbitrary model code or unconfined shell scripts.
- **SSRF Defense:** All external HTTP queries pass through `isSafeUrl`, which blocks internal IPs (`10.0.0.0/8`, `192.168.0.0/16`, `127.0.0.1`) and cloud metadata endpoints (`169.254.169.254`).
- **Redacted Logging:** Secrets, Bearer tokens, and database passwords are automatically redacted from logs and SSE payloads.
- **Human-in-the-Loop:** Consequential plans require explicit approval before tools are triggered.

---

## 📄 License

Distributed under the [Apache-2.0 License](LICENSE).

