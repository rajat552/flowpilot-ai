import { URL } from 'url';

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS/GCP metadata
  'metadata.google.internal',
]);

export function isSafeUrl(urlString: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(urlString);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Only HTTP and HTTPS protocols are permitted' };
    }

    const hostname = parsed.hostname.toLowerCase();

    if (BLOCKED_HOSTS.has(hostname)) {
      return { safe: false, reason: 'Access to loopback or metadata endpoints is prohibited' };
    }

    // Check private IPv4 ranges:
    // 10.0.0.0 - 10.255.255.255
    // 172.16.0.0 - 172.31.255.255
    // 192.168.0.0 - 192.168.255.255
    // 127.0.0.0 - 127.255.255.255
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      const octet1 = parseInt(match[1], 10);
      const octet2 = parseInt(match[2], 10);

      if (octet1 === 10) return { safe: false, reason: 'Private network access prohibited (10.x.x.x)' };
      if (octet1 === 127) return { safe: false, reason: 'Loopback address prohibited (127.x.x.x)' };
      if (octet1 === 192 && octet2 === 168) return { safe: false, reason: 'Private network access prohibited (192.168.x.x)' };
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
        return { safe: false, reason: 'Private network access prohibited (172.16-31.x.x)' };
      }
      if (octet1 === 169 && octet2 === 254) {
        return { safe: false, reason: 'Link-local / cloud metadata address prohibited' };
      }
    }

    // Check local domains
    if (hostname.endsWith('.local') || hostname.endsWith('.internal') || hostname.endsWith('.lan')) {
      return { safe: false, reason: 'Local/Internal domain access is prohibited' };
    }

    return { safe: true };
  } catch (err) {
    return { safe: false, reason: 'Malformed or invalid URL' };
  }
}
