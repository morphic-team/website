import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SurveysService } from '../services/surveys.service'; // Adjust path as needed
import { Observable } from 'rxjs';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import necessary modules for *ngFor, routing
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class SurveyListComponent implements OnInit {
  surveys$: Observable<any[]> | null = null;  // Initialize with null


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
}