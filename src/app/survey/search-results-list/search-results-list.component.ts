import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    private searchResultsService: SearchResultsService // Make sure this service exists
  ) {}

  ngOnInit(): void {
    const surveyIdFromParams = this.route.parent?.snapshot.paramMap.get('id');
    this.surveyId = surveyIdFromParams !== undefined ? surveyIdFromParams : null; // Assign null if undefined

    if (this.surveyId) {
      this.fetchTags();
      this.getSearchResults(); // Fetch search results when the component initializes
    } else {
      console.error('Survey ID not found in route parameters');
    }
  }

  fetchTags(): void {
    if (this.surveyId) {
      this.searchResultsService.getTags(this.surveyId).subscribe((response: TagResponse) => {
        this.tags = response.results.map(tag => tag.value); // Now it directly maps to tag.value
      }, error => {
        console.error('Error fetching tags:', error); // Handle any errors
      });
    }
  }

  getSearchResults(): void {
    if (this.surveyId) {
      this.searchResultsService.getSearchResults(this.surveyId, this.filter, this.currentPage).subscribe(response => {
        this.searchResults = response.results;
        this.totalSearchResults = response.count;
      });
    }
  }

  filterSearchResults(): void {
    this.getSearchResults(); // Fetch results based on the current filter
  }

  pageChanged(): void {
    this.getSearchResults(); // Fetch results for the selected page
  }
}