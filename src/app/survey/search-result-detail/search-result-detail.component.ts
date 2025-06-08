import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchResultsService } from '../services/search-results.service';
import { SurveysService } from '../services/surveys.service';
import { Survey } from '../models/survey.model';
import { SurveyFormComponent } from '../survey-form/survey-form.component';

@Component({
    selector: 'app-search-result-detail',
    imports: [CommonModule, FormsModule, SurveyFormComponent],
    templateUrl: './search-result-detail.component.html',
    styleUrl: './search-result-detail.component.css'
})
export class SearchResultDetailComponent implements OnInit {
  @ViewChild(SurveyFormComponent) surveyFormComponent!: SurveyFormComponent;
  
  surveyId: string | null = null;
  resultId: string | null = null;
  searchResult: any = null;
  survey: Survey | null = null;
  loading = true;
  saving = false;
  error: string | null = null;
  currentPage: number = 1;
  selectedCompletionState: string | null = null;
  
  // Unsaved changes tracking
  hasUnsavedChanges: boolean = false;
  originalFormValues: { [fieldId: string]: any } = {};
  originalCompletionState: string | null = null;
  changedFields: Set<string> = new Set();
  
  // Navigation context
  pageResults: any[] = [];
  currentIndex: number = -1;
  totalResults: number = 0;
  perPage: number = 60;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchResultsService: SearchResultsService,
    private surveysService: SurveysService
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes to handle navigation within same component
    this.route.paramMap.subscribe(params => {
      this.resultId = params.get('resultId');
      const pageParam = params.get('page');
      this.currentPage = pageParam ? Number(pageParam) : 1;
      
      this.surveyId = this.route.parent?.snapshot.paramMap.get('id') || null;

      if (this.surveyId && this.resultId) {
        this.loading = true;
        this.error = null;
        this.loadData();
      } else {
        this.error = 'Missing survey ID or result ID';
        this.loading = false;
      }
    });
  }

  private loadData() {
    Promise.all([
      this.surveysService.getSurvey(this.surveyId!).toPromise(),
      this.searchResultsService.getSearchResult(Number(this.resultId!)).toPromise(),
      this.searchResultsService.getSearchResults(this.surveyId!, '', this.currentPage, 60).toPromise()
    ]).then(([survey, searchResult, pageResultsResponse]) => {
      if (!survey || !searchResult || !pageResultsResponse) {
        throw new Error('Failed to load required data');
      }
      
      this.survey = survey;
      this.searchResult = searchResult;
      this.pageResults = pageResultsResponse.results;
      this.totalResults = pageResultsResponse.count;
      
      // Initialize completion state from loaded data
      this.selectedCompletionState = searchResult.completionState;
      this.originalCompletionState = searchResult.completionState;
      
      // Store original form values for change tracking
      this.originalFormValues = { ...this.getInitialFormValues() };
      this.hasUnsavedChanges = false;
      this.changedFields.clear();
      
      // Find current result's index in the page
      this.currentIndex = this.pageResults.findIndex(r => r.id === Number(this.resultId));
      
      this.loading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.error = 'Failed to load data';
      this.loading = false;
    });
  }

  onFieldChange(event: { fieldId: string, value: any, allValues: { [fieldId: string]: any } }) {
    // Check if this specific field has changed from its original value
    const originalValue = this.originalFormValues[event.fieldId];
    const hasChanged = JSON.stringify(event.value) !== JSON.stringify(originalValue);
    
    if (hasChanged) {
      this.changedFields.add(event.fieldId);
    } else {
      this.changedFields.delete(event.fieldId);
    }
    
    this.updateUnsavedChangesStatus();
  }

  onCompletionStateChange() {
    this.updateUnsavedChangesStatus();
  }

  private updateUnsavedChangesStatus() {
    // Check completion state changes
    const stateChanged = this.selectedCompletionState !== this.originalCompletionState;
    
    // Overall unsaved changes = any field changed OR completion state changed
    this.hasUnsavedChanges = this.changedFields.size > 0 || stateChanged;
  }

  revertChanges() {
    // Revert completion state
    this.selectedCompletionState = this.originalCompletionState;
    
    // Clear changed fields tracking
    this.changedFields.clear();
    
    // Reset the survey form to original values
    if (this.surveyFormComponent) {
      this.surveyFormComponent.resetForm();
    }
    
    // Update the unsaved changes status
    this.updateUnsavedChangesStatus();
  }

  private confirmNavigation(): boolean {
    if (!this.hasUnsavedChanges) return true;
    
    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }

  onFormSubmit(formValues: { [fieldId: string]: any }) {
    if (!this.resultId || this.saving) return;

    this.saving = true;
    this.error = null;

    // formValues already uses field labels as keys, so we can pass directly
    this.searchResultsService.updateSearchResult(
      Number(this.resultId), 
      formValues, 
      this.selectedCompletionState || undefined
    ).subscribe({
      next: (updatedResult) => {
        this.searchResult = updatedResult;
        this.saving = false;
        
        // Reset unsaved changes tracking after successful save
        this.originalFormValues = { ...formValues };
        this.originalCompletionState = this.selectedCompletionState;
        this.changedFields.clear();
        this.hasUnsavedChanges = false;
      },
      error: (error) => {
        console.error('Error saving form:', error);
        this.error = 'Failed to save form data';
        this.saving = false;
      }
    });
  }

  goBackToResults() {
    if (!this.confirmNavigation()) return;
    
    if (this.surveyId) {
      this.router.navigate(['/surveys', this.surveyId, 'search-results', 'page', this.currentPage]);
    }
  }

  goToPrevious() {
    if (!this.confirmNavigation()) return;
    if (!this.surveyId) return;

    if (this.currentIndex > 0) {
      // Navigate to previous result on current page
      const prevResult = this.pageResults[this.currentIndex - 1];
      this.router.navigate(['/surveys', this.surveyId, 'search-results', 'page', this.currentPage, 'result', prevResult.id]);
    } else if (this.currentPage > 1) {
      // Navigate to last result of previous page - fetch it first
      this.searchResultsService.getSearchResults(this.surveyId, '', this.currentPage - 1, this.perPage).subscribe(response => {
        if (response.results && response.results.length > 0) {
          const lastResult = response.results[response.results.length - 1];
          this.router.navigate(['/surveys', this.surveyId, 'search-results', 'page', this.currentPage - 1, 'result', lastResult.id]);
        }
      });
    }
  }

  goToNext() {
    if (!this.confirmNavigation()) return;
    if (!this.surveyId) return;

    if (this.currentIndex < this.pageResults.length - 1) {
      // Navigate to next result on current page
      const nextResult = this.pageResults[this.currentIndex + 1];
      this.router.navigate(['/surveys', this.surveyId, 'search-results', 'page', this.currentPage, 'result', nextResult.id]);
    } else if (this.hasMorePages()) {
      // Navigate to first result of next page - fetch it first
      this.searchResultsService.getSearchResults(this.surveyId, '', this.currentPage + 1, this.perPage).subscribe(response => {
        if (response.results && response.results.length > 0) {
          const firstResult = response.results[0];
          this.router.navigate(['/surveys', this.surveyId, 'search-results', 'page', this.currentPage + 1, 'result', firstResult.id]);
        }
      });
    }
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0 || this.currentPage > 1;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.pageResults.length - 1 || this.hasMorePages();
  }

  private hasMorePages(): boolean {
    const totalPages = Math.ceil(this.totalResults / this.perPage);
    return this.currentPage < totalPages;
  }

  getInitialFormValues(): { [fieldId: string]: any } {
    if (!this.searchResult?.fieldValues || !this.survey) {
      return {};
    }

    const initialValues: { [fieldId: string]: any } = {};
    for (const field of this.survey.fields) {
      const fieldId = field.id.toString();
      let value = this.searchResult.fieldValues[fieldId];
      
      // Parse JSON strings for location fields
      if (field.fieldType === 'location' && typeof value === 'string' && value.startsWith('{')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.warn('Failed to parse location JSON:', value, e);
        }
      }
      
      if (value !== undefined) {
        initialValues[fieldId] = value;
      }
    }
    return initialValues;
  }
}
