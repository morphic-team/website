import { Tag } from './tag-response.model';

export interface SearchResult {
  id: number;
  nextId: number | null;
  previousId: number | null;
  searchId: number;
  imageId: number;
  visibleLink: string;
  directLink: string;
  completionState: string;
  tags: Tag[];
  fieldValues?: Record<string, any>;
  search?: any;
}

export interface SearchResultsResponse {
  count: number;
  limit: number;
  offset: number;
  results: SearchResult[];
}