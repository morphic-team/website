import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchResultsService } from '../services/search-results.service';
import { SurveysService } from '../services/surveys.service';
import { Survey } from '../models/survey.model';
import { SurveyFormComponent } from '../survey-form/survey-form.component';

@Component({
    selector: 'app-search-result-detail',
    imports: [CommonModule, SurveyFormComponent],
    templateUrl: './search-result-detail.component.html',
    styleUrl: './search-result-detail.component.css'
})
export class SearchResultDetailComponent implements OnInit {
  surveyId: string | null = null;
  resultId: string | null = null;
  searchResult: any = null;
  survey: Survey | null = null;
  loading = true;
  saving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchResultsService: SearchResultsService,
    private surveysService: SurveysService
  ) {}

  ngOnInit() {
    this.surveyId = this.route.parent?.snapshot.paramMap.get('id') || null;
    this.resultId = this.route.snapshot.paramMap.get('resultId') || null;

    if (this.surveyId && this.resultId) {
      this.loadData();
    } else {
      this.error = 'Missing survey ID or result ID';
      this.loading = false;
    }
  }

  private loadData() {
    Promise.all([
      this.surveysService.getSurvey(this.surveyId!).toPromise(),
      this.searchResultsService.getSearchResult(Number(this.resultId!)).toPromise()
    ]).then(([survey, searchResult]) => {
      this.survey = survey;
      this.searchResult = searchResult;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.error = 'Failed to load data';
      this.loading = false;
    });
  }

  onFormSubmit(formValues: { [fieldId: string]: any }) {
    if (!this.resultId || this.saving) return;

    this.saving = true;
    this.error = null;

    // formValues already uses field labels as keys, so we can pass directly
    this.searchResultsService.updateSearchResult(
      Number(this.resultId), 
      formValues, 
      'completed'
    ).subscribe({
      next: (updatedResult) => {
        this.searchResult = updatedResult;
        this.saving = false;
        // Optionally navigate back or show success message
      },
      error: (error) => {
        console.error('Error saving form:', error);
        this.error = 'Failed to save form data';
        this.saving = false;
      }
    });
  }

  goBackToResults() {
    if (this.surveyId) {
      this.router.navigate(['/surveys', this.surveyId, 'search-results']);
    }
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
