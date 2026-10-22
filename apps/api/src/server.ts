import { app } from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { nebiusClient } from './services/ai/nebiusClient.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(` FlowPilot AI Backend listening on port ${PORT}`);
  logger.info(` Environment: ${config.nodeEnv}`);
  logger.info(` Nebius Base URL: ${nebiusClient.baseUrl}`);
  logger.info(` NVIDIA Nemotron Model: ${nebiusClient.modelId}`);
  logger.info(` Nebius Configured: ${nebiusClient.isConfigured() ? 'YES (Live API Key Active)' : 'NO (Missing API Key)'}`);
  logger.info(` Health endpoint: http://localhost:${PORT}/api/health`);
  logger.info(` Ready endpoint:  http://localhost:${PORT}/api/ready`);
  logger.info(`=======================================================`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server cleanly.');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Closing HTTP server cleanly.');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});
