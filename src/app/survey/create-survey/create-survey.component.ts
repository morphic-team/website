import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SurveysService } from '../services/surveys.service';

@Component({
  selector: 'app-create-survey',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent {
  name = '';
  comments = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private surveysService: SurveysService, private router: Router) {}

  createSurvey() {
    this.errorMessage = '';
    
    // Basic validation
    if (!this.name.trim()) {
      this.errorMessage = 'Survey name is required.';
      return;
    }

    if (this.name.trim().length < 3) {
      this.errorMessage = 'Survey name must be at least 3 characters long.';
      return;
    }

    this.isSubmitting = true;

    const surveyData = {
      name: this.name.trim(),
      comments: this.comments.trim()
    };

    this.surveysService.createSurvey(surveyData).subscribe({
      next: (response) => {
        this.router.navigate(['/surveys']);  // Redirect back to surveys list
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create survey. Please try again.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/surveys']);
  }
}