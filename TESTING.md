# FlowPilot AI — Verification & Testing Report

**Hackathon Track:** Best Apps and Agents (Nebius × NVIDIA Global AI Hackathon)  
**Last Test Execution:** 2026-10-23  
**Status:** ALL TESTS PASSING (100% Pass Rate)

---

## 1. Test Suite Summary

FlowPilot AI includes comprehensive unit, integration, end-to-end, and benchmark test suites using `vitest`:

| Test Suite | File | Tests | Status | Execution Time |
|---|---|---|---|---|
| **Shared Contracts & State Machine** | `apps/api/tests/contracts.test.ts` | 5 | `PASSED` | ~12ms |
| **Tool Registry & SSRF Guard** | `apps/api/tests/tools.test.ts` | 5 | `PASSED` | ~1.4s |
| **End-to-End Primary Research Workflow** | `apps/api/tests/workflow.test.ts` | 2 | `PASSED` | ~6.6s |
| **Repeatable 15-Benchmark Suite** | `apps/api/src/evaluations/benchmark.ts` | 15 Scenarios | `PASSED` | ~3.2s |

---

## 2. Running Automated Tests

To run the complete test suite across the monorepo:

```bash
# Run all tests
npm test

# Run API & Agent integration tests specifically
npm run test --workspace=@flowpilot/api
```

### Verified Test Output
```text
 ✓ tests/contracts.test.ts (5 tests)
 ✓ tests/tools.test.ts (5 tests)
 ✓ tests/workflow.test.ts (2 tests)

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Duration  8.18s
```

---

## 3. End-to-End Workflow Verification Evidence

During the automated end-to-end workflow execution:

1. **Intake & Planning:**
   - Goal received: *"Research three project-management products, compare their features and pricing, identify the best fit for a student team, and generate a report with sources."*
   - Generated 6-step DAG plan with unique step IDs and registered tools.
2. **Approval & Execution:**
   - Plan approved via `/api/runs/:runId/approve`.
   - Tool `web_search` discovered candidates and valid URLs.
   - Tool `fetch_webpage` validated against SSRF guard and retrieved pricing data.
   - Tool `extract_facts` extracted structured features, free tiers, and limitations for Notion, Trello, and Asana.
   - Tool `generate_report` compiled a 5,146 byte deliverable report artifact.
3. **Deterministic Verifier Audit:**
   - `chk_steps_passed`: PASSED (All 6 steps passed without exceptions)
   - `chk_three_products`: PASSED (Found 3 distinct products: `notion`, `trello`, `asana`)
   - `chk_valid_sources`: PASSED (Collected 4 authentic HTTP/HTTPS source URLs)
   - `chk_pricing_coverage`: PASSED (Documented free tiers and seat prices for all 3)
   - `chk_report_integrity`: PASSED (Confirmed Executive Summary, Matrix, Recommendation, Citations)
   - Overall Verification: **5/5 Criteria Passed (100%)**

---

## 4. Phase 13: 15-Scenario Agent Evaluation

The repeatable benchmark suite tests 15 distinct edge cases:

1. `scen_01`: Straightforward Student PM Tool Research (`completed`, 100%)
2. `scen_02`: Ambiguous Goal Normalization (`completed`, 100%)
3. `scen_03`: Missing Information / Unlisted Product (`partially_completed`, 100%)
4. `scen_04`: Unsupported Tool Request Shielding (`failed`, safely blocked)
5. `scen_05`: Malformed Model Output Sanitization (`completed`, parsed)
6. `scen_06`: Tool Network Timeout Resilience (`completed`, recovered)
7. `scen_07`: Search Failure & Automatic Fallback (`completed`, direct fallback)
8. `scen_08`: Incomplete Sources Detection (`partially_completed`, flagged)
9. `scen_09`: Duplicate Search Result Deduplication (`completed`, deduplicated)
10. `scen_10`: Critical Check Failure Guard (`partially_completed`, honest status)
11. `scen_11`: Bounded Retry Exhaustion (`failed`, halted at limit 2)
12. `scen_12`: User Abort / Mid-Run Cancellation (`cancelled`, halted immediately)
13. `scen_13`: Strict Token Budget Constraints (`completed`, bounded)
14. `scen_14`: Hallucination Trap Grounding Guard (`completed`, marked unknown)
15. `scen_15`: Multi-Step Dependency DAG Ordering (`completed`, topological order)

**Evaluation Metrics:**
- Planning Success Rate: **100%**
- Verification Pass Rate: **100%**
- Overall Benchmark Satisfaction: **100%**
- Mean Latency: **~305ms**
