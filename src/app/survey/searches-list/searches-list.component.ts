import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchesService, Search } from '../services/searches.service';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-searches-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './searches-list.component.html',
    styleUrl: './searches-list.component.css'
})
export class SearchesListComponent implements OnInit {
  searches: Search[] = [];
  surveyId: string | null = null;
  showExtensionNotice = true;

  constructor(
    private route: ActivatedRoute,
    private searchesService: SearchesService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Check if user has dismissed the extension notice
    const preferences = this.storageService.getUserPreferences();
    this.showExtensionNotice = !preferences.dismissedExtensionNotice;
    
    this.surveyId = this.route.parent?.snapshot.paramMap.get('id') || null;
    if (this.surveyId) {
      this.fetchSearches();
    }
  }

  fetchSearches(): void {
    if (this.surveyId) {
      this.searchesService.getSearches(this.surveyId)
        .subscribe({
          next: (response) => {
            this.searches = response.results;
          },
          error: (error) => {
            console.error('Error fetching searches:', error);
          }
        });
    }
  }

  runSearch(search: Search): void {
    this.searchesService.runSearch(search);
  }

  dismissExtensionNotice(): void {
    this.showExtensionNotice = false;
    this.storageService.updateUserPreference('dismissedExtensionNotice', true);
  }
}
