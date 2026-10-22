# FlowPilot AI — Architectural Design Document

**Hackathon:** Nebius × NVIDIA Global AI Hackathon  
**Track:** Best Apps and Agents  
**Project:** FlowPilot AI  
**Tagline:** From instructions to verified outcomes.  

---

## 1. System Architecture Overview

FlowPilot AI is built as a clean, modular TypeScript monorepo with strict separation of concerns:

```mermaid
graph TD
    Client[React + Vite Web App] -->|HTTP REST / SSE Stream| API[Express API Orchestrator]
    API -->|Shared Schemas & Contracts| Shared[@flowpilot/shared]
    API -->|Inference BaseURL| Nebius[Nebius Token Factory / NVIDIA Nemotron]
    API -->|Registered Tools| Tools[Tool Registry]
    Tools -->|Web Search| Tavily[Tavily & Direct DuckDuckGo Engine]
    Tools -->|Web Scraper| Fetcher[Safe HTTP Fetcher with SSRF Guard]
    Tools -->|Report Builder| Report[Markdown & Table Generator]
    API -->|Deterministic Auditor| Verifier[Verification Engine]
    API -->|Adaptive Loop| Recovery[Recovery Engine]
    API -->|State & Artifacts| Store[Persistent Store / MongoDB]
```

---

## 2. Monorepo Organization

- **`packages/shared`**: Single source of truth for Zod schemas, TypeScript types, and state machine transition rules. Compiles to ESM/CJS and is consumed by both frontend and backend.
- **`apps/api`**: Node.js/Express backend service running the AI planner, tool execution engine, verification auditor, SSE event broadcaster, and persistence store.
- **`apps/web`**: React 18 SPA built with Vite, Tailwind CSS, and Lucide React. Features a real-time SSE execution timeline, plan review gate, interactive comparison matrix, and benchmark runner.

---

## 3. Workflow State Machine

### 3.1 Run Status Transitions

Valid run transitions are strictly enforced to prevent regressions or terminal-state mutations:

```
[queued] ➔ [planning] ➔ [awaiting_approval] ➔ [running] ➔ [verifying] ➔ [completed]
    │           │                │                │            │           ▲
    │           │                │                │            ▼           │
    │           │                │                └───➔ [recovering] ──────┤
    │           │                │                             │           │
    ▼           ▼                ▼                             ▼           ▼
[cancelled] [failed]        [cancelled]                   [failed] [partially_completed]
```

- **Terminal States:** `completed`, `partially_completed`, `failed`, `cancelled`. Once entered, no further transitions are permitted.
- **Approval Gate:** Execution can NEVER start directly from `queued` or `planning`. The user must review the generated DAG and explicitly submit `/api/runs/:runId/approve`.

### 3.2 Step Status Transitions

```
[pending] ➔ [running] ➔ [passed] (Terminal)
               │
               ├─➔ [retrying] ➔ [running]
               │         │
               │         └─➔ [failed]
               └─➔ [failed]
```

---

## 4. Trust Boundaries & Security Policy

1. **Model Output is Untrusted:** Instructions or JSON emitted by NVIDIA Nemotron are strictly validated against `WorkflowPlanSchema`. Arbitrary bash commands or unknown tools are immediately rejected.
2. **SSRF Guard (`isSafeUrl`):** All URLs passed to `fetch_webpage` or gathered by search are screened against blocked IP ranges:
   - Loopback (`127.0.0.1`, `localhost`, `::1`)
   - RFC1918 Private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   - Cloud metadata (`169.254.169.254`, `metadata.google.internal`)
3. **Secret Redaction:** The structured logger and event bus filter all API keys, bearer tokens, passwords, and database connection strings before writing to disk or streaming over SSE.
4. **No Dynamic Code Evaluation:** FlowPilot executes strictly typed functions mapped in `toolRegistry`. No `eval()` or unconfined shell execution.

---

## 5. Nebius Token Factory & NVIDIA Nemotron Integration

FlowPilot integrates with Nebius Token Factory using the official OpenAI SDK:

- **Base URL:** `https://api.tokenfactory.nebius.com/v1/`
- **Model Identifier:** `nvidia/llama-3.1-nemotron-70b-instruct` (or `nvidia/nemotron-4-340b-instruct`)
- **OpenAI Compatibility:** Leverages `client.chat.completions.create` with temperature tuning (0.1 for planning, 0.2 for critique) and strict JSON schema extraction.
- **Operational Metrics:** Measures prompt tokens, completion tokens, roundtrip latency, and records them in run metrics.
