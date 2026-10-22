export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  score?: number;
}

export interface WebSearchInput {
  query: string;
  maxResults?: number;
}

export interface WebSearchOutput {
  query: string;
  results: SearchResultItem[];
  totalResults: number;
  provider: 'tavily' | 'duckduckgo' | 'direct';
}

export interface FetchWebpageInput {
  url: string;
  maxContentLength?: number;
}

export interface FetchWebpageOutput {
  url: string;
  title: string;
  content: string;
  extractedLength: number;
  contentType: string;
  timestamp: string;
}

export interface ExtractedProductFact {
  name: string;
  category: string;
  features: string[];
  pricing: {
    tierName: string;
    price: string;
    isFreeAvailable: boolean;
    pricingUrl?: string;
    lastVerifiedDate?: string;
    details: string;
  };
  limitations: string[];
  bestFor: string;
  sourceUrl: string;
}

export interface ExtractFactsInput {
  entityName: string;
  sourceContent: string;
  sourceUrl: string;
  targetDimensions?: string[];
}

export interface ExtractFactsOutput {
  entity: ExtractedProductFact;
  confidenceScore: number;
  extractedAt: string;
}

export interface ComparisonDimension {
  dimension: string;
  values: Record<string, string>; // productName -> value
}

export interface GenerateReportInput {
  title: string;
  workflowGoal: string;
  products: ExtractedProductFact[];
  comparisonDimensions: ComparisonDimension[];
  recommendationTarget: string; // e.g., "student team"
  selectedProduct: string;
  recommendationRationale: string;
  uncertainties: string[];
  sourcesConsulted: Array<{ title: string; url: string; date?: string }>;
}

export interface GenerateReportOutput {
  reportId: string;
  title: string;
  markdownContent: string;
  summary: string;
  productCount: number;
  sourcesCount: number;
  createdAt: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  riskClassification: 'low' | 'medium' | 'high';
  timeoutMs: number;
}
