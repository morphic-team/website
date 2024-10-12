import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagResponse } from '../models/tag-response.model';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  constructor(private http: HttpClient) {}

    // Change the return type to Observable<TagResponse>
    getTags(surveyId: string): Observable<TagResponse> {
      return this.http.get<TagResponse>(`/api/surveys/${surveyId}/tags`); // Ensure the API returns the expected structure
    }


  getSearchResults(surveyId: string, filter: string, page: number): Observable<any> {
    return this.http.get<any>(`/api/surveys/${surveyId}/search_results`, {
      params: {
        filter: filter,
        page: page.toString()
      }
    });
  }
}
