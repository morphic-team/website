export interface TagResponse {
    count: number;
    limit: number;
    results: Tag[];
  }
  
  export interface Tag {
    searchResultId: number;
    value: string;
  }