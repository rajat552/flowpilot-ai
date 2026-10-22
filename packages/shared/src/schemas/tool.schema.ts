import { z } from 'zod';

// Web Search Tool Schemas
export const WebSearchInputSchema = z.object({
  query: z.string().min(2).max(300).trim(),
  maxResults: z.number().int().min(1).max(10).default(5),
});

export const SearchResultItemSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string(),
  publishedDate: z.string().optional(),
  score: z.number().optional(),
});

export const WebSearchOutputSchema = z.object({
  query: z.string(),
  results: z.array(SearchResultItemSchema),
  totalResults: z.number(),
  provider: z.enum(['tavily', 'duckduckgo', 'direct']),
});

// Fetch Webpage Tool Schemas
export const FetchWebpageInputSchema = z.object({
  url: z.string().url('Invalid webpage URL format'),
  maxContentLength: z.number().int().min(500).max(50000).default(12000),
});

export const FetchWebpageOutputSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  content: z.string(),
  extractedLength: z.number(),
  contentType: z.string(),
  timestamp: z.string(),
});

// Extract Facts Tool Schemas
export const ExtractedProductFactSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('Project Management'),
  features: z.array(z.string()).min(1),
  pricing: z.object({
    tierName: z.string(),
    price: z.string(),
    isFreeAvailable: z.boolean(),
    pricingUrl: z.string().optional(),
    lastVerifiedDate: z.string().optional(),
    details: z.string(),
  }),
  limitations: z.array(z.string()).default([]),
  bestFor: z.string().default('Student teams and small groups'),
  sourceUrl: z.string(),
});

export const ExtractFactsInputSchema = z.object({
  entityName: z.string().min(1),
  sourceContent: z.string().min(10),
  sourceUrl: z.string(),
  targetDimensions: z.array(z.string()).optional(),
});

export const ExtractFactsOutputSchema = z.object({
  entity: ExtractedProductFactSchema,
  confidenceScore: z.number().min(0).max(1),
  extractedAt: z.string(),
});

// Generate Report Tool Schemas
export const ComparisonDimensionSchema = z.object({
  dimension: z.string(),
  values: z.record(z.string()),
});

export const GenerateReportInputSchema = z.object({
  title: z.string().min(3),
  workflowGoal: z.string().min(5),
  products: z.array(ExtractedProductFactSchema).min(1),
  comparisonDimensions: z.array(ComparisonDimensionSchema),
  recommendationTarget: z.string().default('student team'),
  selectedProduct: z.string().min(1),
  recommendationRationale: z.string().min(10),
  uncertainties: z.array(z.string()).default([]),
  sourcesConsulted: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      date: z.string().optional(),
    })
  ),
});

export const GenerateReportOutputSchema = z.object({
  reportId: z.string(),
  title: z.string(),
  markdownContent: z.string().min(50),
  summary: z.string().min(10),
  productCount: z.number().int().min(1),
  sourcesCount: z.number().int().min(1),
  createdAt: z.string(),
});
