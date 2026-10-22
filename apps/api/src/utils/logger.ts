function redactSecrets(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+=*/gi, '$1[REDACTED]')
    .replace(/(api[_-]?key["':\s=]+)[A-Za-z0-9_\-]{8,}/gi, '$1[REDACTED]')
    .replace(/(token["':\s=]+)[A-Za-z0-9_\-]{8,}/gi, '$1[REDACTED]')
    .replace(/(password["':\s=]+)[^\s"',]+/gi, '$1[REDACTED]')
    .replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+(@)/gi, '$1[REDACTED]$2');
}

function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return redactSecrets(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (/password|secret|apikey|api_key|token|authorization/i.test(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(val);
      }
    }
    return sanitized;
  }
  return obj;
}

export const logger = {
  info: (message: string, context?: any) => {
    const timestamp = new Date().toISOString();
    const safeMsg = redactSecrets(message);
    if (context) {
      console.log(`[${timestamp}] [INFO] ${safeMsg}`, JSON.stringify(sanitizeObject(context)));
    } else {
      console.log(`[${timestamp}] [INFO] ${safeMsg}`);
    }
  },
  warn: (message: string, context?: any) => {
    const timestamp = new Date().toISOString();
    const safeMsg = redactSecrets(message);
    if (context) {
      console.warn(`[${timestamp}] [WARN] ${safeMsg}`, JSON.stringify(sanitizeObject(context)));
    } else {
      console.warn(`[${timestamp}] [WARN] ${safeMsg}`);
    }
  },
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    const safeMsg = redactSecrets(message);
    if (error instanceof Error) {
      console.error(`[${timestamp}] [ERROR] ${safeMsg}`, redactSecrets(error.stack || error.message));
    } else if (error) {
      console.error(`[${timestamp}] [ERROR] ${safeMsg}`, JSON.stringify(sanitizeObject(error)));
    } else {
      console.error(`[${timestamp}] [ERROR] ${safeMsg}`);
    }
  },
  debug: (message: string, context?: any) => {
    if (process.env.NODE_ENV === 'production') return;
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [DEBUG] ${redactSecrets(message)}`, context ? sanitizeObject(context) : '');
  },
};
