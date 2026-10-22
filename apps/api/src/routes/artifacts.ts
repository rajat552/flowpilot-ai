import { Router, Request, Response } from 'express';
import { store } from '../repositories/store.js';

export const artifactsRouter = Router();

artifactsRouter.get('/runs/:runId/artifacts', (req: Request, res: Response) => {
  const runId = req.params.runId as string;
  const artifacts = store.listArtifactsByRun(runId);
  res.json({ artifacts, total: artifacts.length });
});

artifactsRouter.get('/artifacts', (_req: Request, res: Response) => {
  const artifacts = store.listAllArtifacts();
  res.json({ artifacts, total: artifacts.length });
});

artifactsRouter.get('/artifacts/:artifactId', (req: Request, res: Response) => {
  const artifactId = req.params.artifactId as string;
  const artifact = store.getArtifact(artifactId);

  if (!artifact) {
    return res.status(404).json({ error: `Artifact "${artifactId}" not found` });
  }

  res.json({ artifact });
});

artifactsRouter.get('/artifacts/:artifactId/download', (req: Request, res: Response) => {
  const artifactId = req.params.artifactId as string;
  const artifact = store.getArtifact(artifactId);

  if (!artifact) {
    return res.status(404).json({ error: `Artifact "${artifactId}" not found` });
  }

  const safeTitle = artifact.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const ext = artifact.contentType === 'application/json' ? 'json' : 'md';
  const filename = `${safeTitle}.${ext}`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', artifact.contentType);
  res.send(artifact.rawContent || artifact.contentSnippet || '');
});
