import { describe, it, expect } from 'vitest';
import { toolRegistry } from '../src/tools/registry.js';
import { executeWebSearch } from '../src/tools/webSearchTool.js';
import { isSafeUrl } from '../src/utils/ssrf.js';

describe('Tool Registry and Safety Guard', () => {
  it('has all 4 required registered tools', () => {
    const list = toolRegistry.list().map((t) => t.id);
    expect(list).toContain('web_search');
    expect(list).toContain('fetch_webpage');
    expect(list).toContain('extract_facts');
    expect(list).toContain('generate_report');
  });

  it('blocks unregistered tools from execution', async () => {
    const res = await toolRegistry.execute('unauthorized_shell_command', {});
    expect(res.success).toBe(false);
    expect(res.error).toContain('not a registered or permitted tool');
  });

  it('blocks private IPs and loopback in SSRF filter', () => {
    expect(isSafeUrl('http://localhost:8080/admin').safe).toBe(false);
    expect(isSafeUrl('http://127.0.0.1/test').safe).toBe(false);
    expect(isSafeUrl('http://169.254.169.254/latest/meta-data/').safe).toBe(false);
    expect(isSafeUrl('http://192.168.1.1/router').safe).toBe(false);
    expect(isSafeUrl('http://10.0.0.5/api').safe).toBe(false);
    expect(isSafeUrl('https://www.notion.so/pricing').safe).toBe(true);
    expect(isSafeUrl('https://trello.com').safe).toBe(true);
  });

  it('executes web search and preserves authentic URLs and snippets', async () => {
    const output = await executeWebSearch({
      query: 'Notion project management pricing',
      maxResults: 3,
    });
    expect(output.results.length).toBeGreaterThan(0);
    expect(output.results[0].url).toMatch(/^https?:\/\//);
    expect(output.results[0].title.length).toBeGreaterThan(0);
  });

  it('executes fact extraction deterministically', async () => {
    const res = await toolRegistry.execute('extract_facts', {
      entityName: 'Notion',
      sourceUrl: 'https://www.notion.so/pricing',
      sourceContent: 'Notion offers personal free tiers with connected docs and Kanban tables.',
    });
    expect(res.success).toBe(true);
    expect(res.data.entity.name).toBe('Notion');
    expect(res.data.entity.features.length).toBeGreaterThan(0);
    expect(res.data.entity.pricing.isFreeAvailable).toBe(true);
  });
});
