export type ArtifactType = 'report' | 'comparison_matrix' | 'raw_dataset' | 'audit_log';

export interface Artifact {
  id: string;
  runId: string;
  userId: string;
  type: ArtifactType;
  title: string;
  contentType: 'text/markdown' | 'application/json' | 'text/html';
  storageReference: string;
  contentSnippet?: string;
  rawContent?: string;
  verificationStatus: 'verified' | 'unverified' | 'flagged';
  createdAt: string;
  metadata?: Record<string, any>;
}
