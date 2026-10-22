# FlowPilot AI — Authoritative Workflows Specification

**Tagline:** From instructions to verified outcomes.  
**Hackathon Track:** Best Apps and Agents (Nebius × NVIDIA Global AI Hackathon)

---

## 1. Core Workflow Loop

FlowPilot operates on a 7-stage autonomous execution loop:

```
Understand ➔ Plan ➔ Validate ➔ Execute ➔ Verify ➔ Recover ➔ Deliver
```

1. **Understand (Intake):** Normalizes user instructions, checks input length, enforces tool safety limits, and allocates a unique `runId`.
2. **Plan (Decomposition):** Generates an ordered Directed Acyclic Graph (DAG) using NVIDIA Nemotron on Nebius Token Factory, with explicit tool IDs, expected outcomes, and deterministic acceptance criteria.
3. **Validate (Safety Gate):** Enforces human review. Inspects registered tool permissions, detects circular dependencies, and requires explicit user approval before execution starts.
4. **Execute (Orchestration):** Runs registered tools (`web_search`, `fetch_webpage`, `extract_facts`, `generate_report`) in topological dependency order.
5. **Verify (Audit):** Deterministically evaluates collected facts, source URLs, pricing details, and report structure. Model critique supplements without overriding hard checks.
6. **Recover (Bounded Adaptation):** Automatically adapts search queries, handles transient network blurs, and bounds retries to prevent runaway loops.
7. **Deliver (Persistence):** Generates and stores structured Markdown and JSON reports with authentic citations.

---

## 2. Primary Research Workflow: Project Management Evaluation

### User Goal
> *"Research three project-management products, compare their features and pricing, identify the best fit for a student team, and generate a report with sources."*

### Step-by-Step Execution Sequence

| Step ID | Title | Registered Tool | Expected Outcome | Deterministic Acceptance Check |
|---|---|---|---|---|
| `step_1_search_market` | Discover Candidate PM Tools | `web_search` | Candidate products with authentic URLs | Returns >= 3 candidate tools with valid HTTP/HTTPS URLs |
| `step_2_fetch_pricing` | Retrieve Official Pricing & Free Tier | `fetch_webpage` | Parsed webpage text with SSRF guard | Text extracted without SSRF or security policy violations |
| `step_3_extract_notion` | Extract Structured Facts for Notion | `extract_facts` | Notion features, free tier, limitations | Structured JSON containing Notion pricing & docs capabilities |
| `step_4_extract_trello` | Extract Structured Facts for Trello | `extract_facts` | Trello Kanban & power-ups pricing | Structured JSON containing Trello 10-board free tier |
| `step_5_extract_asana` | Extract Structured Facts for Asana | `extract_facts` | Asana list/board & team pricing | Structured JSON containing Asana 10-member seat limits |
| `step_6_generate_report` | Compile Verified Comparison Report | `generate_report` | Full intelligence deliverable | Markdown report with matrix, student recommendation, citations |

### Verification Assertions
- **Check 1 (`chk_steps_passed`):** All 6 approved steps passed.
- **Check 2 (`chk_three_products`):** Minimum 3 distinct products evaluated (`[notion, trello, asana]`).
- **Check 3 (`chk_valid_sources`):** Authentic source URLs gathered without hallucinated links.
- **Check 4 (`chk_pricing_coverage`):** Explicit pricing and free-tier availability documented.
- **Check 5 (`chk_report_integrity`):** Final report contains Executive Summary, Matrix, Recommendation, and Citations.

---

## 3. Real-Time Telemetry & Event Streams

Authorized frontend clients subscribe via Server-Sent Events (SSE) at `GET /api/runs/:runId/events`:

- `run.created`: Workflow run initialized.
- `run.planning`: Nemotron model prompted for plan decomposition.
- `plan.ready`: Structured DAG ready for user review.
- `run.approved`: User approved execution.
- `step.started`: Step execution initiated.
- `tool.started`: Tool handler invoked with input payload.
- `tool.completed`: Tool succeeded with output evidence.
- `step.verification`: Deterministic acceptance engine evaluating evidence.
- `step.retry`: Recovery engine triggering retry on failure.
- `artifact.created`: Deliverable saved to persistent repository.
- `run.completed`: All acceptance checks passed; deliverable ready.
