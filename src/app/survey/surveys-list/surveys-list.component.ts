import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SurveysService } from '../services/surveys.service'; // Adjust path as needed
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-survey-list',
    imports: [CommonModule, RouterModule, ExportModalComponent], // Import necessary modules for *ngFor, routing
    templateUrl: './surveys-list.component.html',
    styleUrls: ['./surveys-list.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class SurveyListComponent implements OnInit {
  surveys$: Observable<any[]> | null = null;  // Initialize with null
  
  // Export modal state
  showExportModal: boolean = false;
  selectedSurveyForExport: any = null;

  constructor(private surveysService: SurveysService, private router: Router) {}

  ngOnInit(): void {
    // Fetch surveys on component initialization
    this.surveys$ = this.surveysService.refresh();
  }

  goToSurveyDetails(surveyId: string): void {
    // Navigate to the details of the selected survey
    this.router.navigate([`/surveys/${surveyId}/search-results`]);
  }

  createSurvey(): void {
    // Navigate to the survey creation page
    this.router.navigate(['/surveys/create']);
  }

  openExportModal(survey: any): void {
    this.selectedSurveyForExport = survey;
    this.showExportModal = true;
  }

  closeExportModal(): void {
    this.showExportModal = false;
    this.selectedSurveyForExport = null;
  }

  archiveSurvey(survey: any): void {
    // Stub for archive functionality
    console.log('Archive survey:', survey.name);
    alert(`Archive functionality coming soon for: ${survey.name}`);
  }
}