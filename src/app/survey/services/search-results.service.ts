import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResult, SearchResultsResponse } from '../models/search-result.model';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  constructor(private http: HttpClient) {}



  getSearchResults(surveyId: string, filter: string, page: number, perPage: number = 60): Observable<SearchResultsResponse> {
    const params: any = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    
    // Only add filter if it's not empty
    if (filter && filter.trim()) {
      params.filter = filter;
    }
    
    return this.http.get<SearchResultsResponse>(`/api/surveys/${surveyId}/search_results`, {
      params: params
    });
  }

  // Get individual search result with field values
  getSearchResult(searchResultId: number): Observable<SearchResult> {
    return this.http.get<SearchResult>(`/api/search_results/${searchResultId}`);
  }

  // Update search result field values and completion state
  updateSearchResult(searchResultId: number, fieldValues: Record<string, any>, completionState?: string): Observable<SearchResult> {
    const payload: any = {
      field_values: fieldValues
    };
    
    if (completionState) {
      payload.completion_state = completionState;
    }
    
    return this.http.patch<SearchResult>(`/api/search_results/${searchResultId}`, payload);
  }
}
