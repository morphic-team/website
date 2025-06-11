import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchesService, Search } from '../services/searches.service';

declare var bootstrap: any;

@Component({
  selector: 'app-gather-results-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gather-results-modal.component.html',
  styleUrl: './gather-results-modal.component.css'
})
export class GatherResultsModalComponent {
  @ViewChild('modal') modalElement!: ElementRef;
  @Input() search: Search | null = null;
  
  resultLimit: number = 100;
  isGenerating: boolean = false;
  error: string = '';
  extensionInstalled: boolean = true;  // Hardcoded to true for now
  googleSearchUrl: string = '';
  
  private modalInstance: any;
  private debounceTimer: any;

  constructor(private searchesService: SearchesService) {}

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    // Extension check removed - hardcoded to true in property initialization
  }

  show(search: Search) {
    this.search = search;
    this.error = '';
    this.resultLimit = 100;
    this.googleSearchUrl = '';
    // Extension check removed - hardcoded to true
    this.modalInstance.show();
    
    // Defer URL generation to avoid change detection errors
    setTimeout(() => {
      this.generateUrl();
    }, 0);
  }

  hide() {
    this.modalInstance.hide();
  }

  onStartGathering() {
    // Validate before proceeding
    if (!this.validateLimit()) {
      return false; // Prevent navigation if validation fails
    }
    
    // Force immediate URL generation if needed
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    
    if (!this.googleSearchUrl || this.isGenerating) {
      this.generateUrl();
      return false; // Prevent link navigation until URL is ready
    }
    
    this.hide();
    return true; // Allow link navigation
  }
  
  onLimitChange() {
    // Validate the limit
    if (!this.validateLimit()) {
      return;
    }
    
    // Debounce URL generation to avoid too many API calls
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.generateUrl();
    }, 500);
  }

  private validateLimit(): boolean {
    this.error = '';
    
    if (!this.resultLimit || isNaN(this.resultLimit)) {
      this.error = 'Please enter a valid number.';
      return false;
    }
    
    if (this.resultLimit < 1) {
      this.error = 'Number of results must be at least 1.';
      return false;
    }
    
    if (this.resultLimit > 400) {
      this.error = 'Number of results cannot exceed 400.';
      return false;
    }
    
    return true;
  }

  private checkExtensionInstalled() {
    // TODO: Implement proper extension detection
    // For now, assume extension is installed
    this.extensionInstalled = true;
  }

  private generateUrl() {
    if (!this.search || !this.validateLimit()) {
      return;
    }

    this.isGenerating = true;
    this.error = '';
    this.googleSearchUrl = '';

    this.searchesService.generateUploadUrl(this.search.id, this.resultLimit).subscribe({
      next: (response) => {
        console.log('Generated URL response:', response);
        this.googleSearchUrl = response.googleSearchUrl;  // camelCase!
        this.isGenerating = false;
        console.log('URL set to:', this.googleSearchUrl);
        console.log('isGenerating:', this.isGenerating);
      },
      error: (error) => {
        console.error('Error generating upload URL:', error);
        this.error = 'Failed to generate search URL. Please try again.';
        this.isGenerating = false;
      }
    });
  }
}