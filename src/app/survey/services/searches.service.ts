import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Search {
  id: number;
  name: string;
  searchQuery: string;
  comments: string;
  areResultsUploaded: boolean;
}

export interface SearchesResponse {
  results: Search[];
  count?: number;
}

export interface CreateSearchRequest {
  name: string;
  searchQuery: string;
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
    const queryString = encodeURIComponent(search.searchQuery);
    const morphicId = search.id;
    return `https://www.google.com/search?q=${queryString}&fg=1&tbm=isch&tbs=itp:photo,morphic_id:${morphicId}`;
  }

  // Open search in new window
  runSearch(search: Search): void {
    const url = this.generateSearchUrl(search);
    window.open(url, '_blank');
  }
}