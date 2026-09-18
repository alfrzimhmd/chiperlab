/* ============================================================
   TIMELINE TYPES
============================================================ */

export type TimelineEra =
  | 'classical'
  | 'renaissance'
  | 'mechanical'
  | 'computer'
  | 'modern';

export interface TimelineEraInfo {
  id: TimelineEra;
  label: string;
  period: string;
  description: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

// ← TimelineReference HARUS DIDEKLARASIKAN SEBELUM TimelineEvent
export interface TimelineReference {
  title: string;
  author?: string;
  year?: number;
  url?: string;
  type: 'standard' | 'paper' | 'book' | 'article' | 'documentation';
}

export interface TimelineEvent {
  id: string;
  year: number;
  yearLabel: string;
  title: string;
  description: string;
  era: TimelineEra;
  relatedAlgorithms?: string[];
  relatedTerms?: string[];
  people?: string[];
  references?: TimelineReference[];
}

/* ============================================================
   GLOSSARY TYPES
============================================================ */

export type GlossaryCategory =
  | 'cipher'
  | 'hash'
  | 'protocol'
  | 'attack'
  | 'concept'
  | 'math'
  | 'organization'  
  | 'standard';  

export interface GlossaryCategoryInfo {
  id: GlossaryCategory;
  label: string;
  description: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  example?: string;
  relatedTerms?: string[];
  relatedAlgorithms?: string[];
  relatedLessons?: string[];
  people?: string[];
}