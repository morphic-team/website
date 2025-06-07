import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Search {
  id_: number;
  name: string;
  search_query: string;
  comments: string;
  are_results_uploaded: boolean;
}

export interface SearchesResponse {
  results: Search[];
  count?: number;
}

export interface CreateSearchRequest {
  name: string;
  search_query: string;
  comments?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchesService {
  constructor(private http: HttpClient) {}

  // Get all searches for a survey
  getSearches(surveyId: string): Observable<SearchesResponse> {
    return this.http.get<SearchesResponse>(`/api/surveys/${surveyId}/searches`);
  }

  // Get a specific search by ID
  getSearch(searchId: string): Observable<Search> {
    return this.http.get<Search>(`/api/searches/${searchId}`);
  }

  // Create a new search
  createSearch(surveyId: string, searchData: CreateSearchRequest): Observable<Search> {
    return this.http.post<Search>(`/api/surveys/${surveyId}/searches`, searchData);
  }

  // Helper method to generate Google Images search URL
  generateSearchUrl(search: Search): string {
    const queryString = encodeURIComponent(search.search_query);
    const morphicId = search.id_;
    return `https://www.google.com/search?q=${queryString}&fg=1&tbm=isch&tbs=itp:photo,morphic_id:${morphicId}`;
  }

  // Open search in new window
  runSearch(search: Search): void {
    const url = this.generateSearchUrl(search);
    window.open(url, '_blank');
  }
}