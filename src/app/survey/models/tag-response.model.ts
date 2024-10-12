export interface TagResponse {
    count: number;
    limit: number;
    results: Tag[];
  }
  
  export interface Tag {
    search_result_id: number;
    value: string;
  }