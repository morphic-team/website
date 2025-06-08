import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { SearchResultsService } from '../services/search-results.service'; // Adjust the path as necessary
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule
import { TagResponse } from '../models/tag-response.model'; // Import the new model
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-search-results-list',
    imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule], // Add NgxPaginationModule here
    templateUrl: './search-results-list.component.html',
    styleUrls: ['./search-results-list.component.css'] // Adjust if necessary
})
export class SearchResultsListComponent implements OnInit {
  tags: string[] = [];
  searchResults: any[] = [];
  filter: string = '';
  currentPage: number = 1; // Change to 1-based index
  perPage: number = 60;
  totalSearchResults: number = 0; // Initialize total search results
  surveyId: string | null = null; // Store the survey ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchResultsService: SearchResultsService // Make sure this service exists
  ) {}

  ngOnInit(): void {
    const surveyIdFromParams = this.route.parent?.snapshot.paramMap.get('id');
    this.surveyId = surveyIdFromParams !== undefined ? surveyIdFromParams : null;

    // Subscribe to route parameter changes to handle page navigation
    this.route.paramMap.subscribe(params => {
      const pageParam = params.get('page');
      this.currentPage = pageParam ? Number(pageParam) : 1;
      
      if (this.surveyId) {
        this.fetchTags();
        this.getSearchResults();
      } else {
        console.error('Survey ID not found in route parameters');
      }
    });
  }

  fetchTags(): void {
    if (this.surveyId) {
      this.searchResultsService.getTags(this.surveyId).subscribe({
        next: (response: TagResponse) => {
          this.tags = response.results.map(tag => tag.value);
        },
        error: (error) => {
          console.error('Error fetching tags:', error);
        }
      });
    }
  }

  getSearchResults(): void {
    if (this.surveyId) {
      this.searchResultsService.getSearchResults(this.surveyId, this.filter, this.currentPage, this.perPage).subscribe({
        next: (response) => {
          this.searchResults = response.results;
          this.totalSearchResults = response.count;
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
        }
      });
    }
  }

  filterSearchResults(): void {
    // Navigate to page 1 when filtering
    if (this.surveyId) {
      this.router.navigate(['/surveys', this.surveyId, 'search-results', 'page', 1]);
    }
  }

  onPageChange(page: number): void {
    // Navigate to the selected page
    if (this.surveyId) {
      this.router.navigate(['/surveys', this.surveyId, 'search-results', 'page', page]);
    }
  }
}