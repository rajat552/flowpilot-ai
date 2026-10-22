import { Router, Request, Response } from 'express';
import { runBenchmarkEvaluation, BENCHMARK_SCENARIOS } from '../evaluations/benchmark.js';

export const evaluationsRouter = Router();

evaluationsRouter.get('/evaluations/scenarios', (_req: Request, res: Response) => {
  res.json({
    total: BENCHMARK_SCENARIOS.length,
    scenarios: BENCHMARK_SCENARIOS,
  });
});

evaluationsRouter.get('/evaluations', async (_req: Request, res: Response) => {
  const summary = await runBenchmarkEvaluation();
  res.json({ summary });
});

evaluationsRouter.post('/evaluations/run', async (_req: Request, res: Response) => {
  const summary = await runBenchmarkEvaluation();
  res.json({
    message: `Completed evaluation across ${summary.totalScenarios} benchmarks.`,
    summary,
  });
});
