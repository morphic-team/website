import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SurveysService } from '../services/surveys.service';
import { HttpClient } from '@angular/common/http';

interface Search {
  id_: number;
  name: string;
  search_query: string;
  comments: string;
  are_results_uploaded: boolean;
}

@Component({
    selector: 'app-searches-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './searches-list.component.html',
    styleUrl: './searches-list.component.css'
})
export class SearchesListComponent implements OnInit {
  searches: Search[] = [];
  surveyId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.surveyId = this.route.parent?.snapshot.paramMap.get('id') || null;
    if (this.surveyId) {
      this.fetchSearches();
    }
  }

  fetchSearches(): void {
    if (this.surveyId) {
      this.http.get<{results: Search[]}>(`/api/surveys/${this.surveyId}/searches`)
        .subscribe(response => {
          this.searches = response.results;
        });
    }
  }

  runSearch(search: Search): void {
    const queryString = encodeURIComponent(search.search_query);
    const morphicId = search.id_;
    const url = `https://www.google.com/search?q=${queryString}&fg=1&tbm=isch&tbs=itp:photo,morphic_id:${morphicId}`;
    window.open(url, '_blank');
  }
}
