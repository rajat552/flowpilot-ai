import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load root .env or local .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  nebius: {
    apiKey: string;
    baseUrl: string;
    modelId: string;
  };
  tavily: {
    apiKey: string;
  };
  mongodb: {
    uri: string;
    dbName: string;
  };
  security: {
    jwtSecret: string;
    rateLimitMax: number;
    rateLimitWindowMs: number;
  };
  agent: {
    maxStepRetries: number;
    stepTimeoutMs: number;
    workflowTimeoutMs: number;
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nebius: {
    apiKey: process.env.NEBIUS_API_KEY || '',
    baseUrl: process.env.NEBIUS_BASE_URL || 'https://api.tokenfactory.nebius.com/v1/',
    modelId: process.env.NEBIUS_MODEL_ID || 'nvidia/llama-3.1-nemotron-70b-instruct',
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY || '',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || '',
    dbName: process.env.MONGODB_DB_NAME || 'flowpilot',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'flowpilot_default_secret_key_change_in_production',
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '200', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  },
  agent: {
    maxStepRetries: parseInt(process.env.MAX_STEP_RETRIES || '2', 10),
    stepTimeoutMs: parseInt(process.env.STEP_TIMEOUT_MS || '60000', 10),
    workflowTimeoutMs: parseInt(process.env.WORKFLOW_TIMEOUT_MS || '300000', 10),
  },
};
