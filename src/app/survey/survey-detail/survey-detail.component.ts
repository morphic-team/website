import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveysService } from '../services/surveys.service'; // Adjust the path as needed
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.css'] // Adjust if necessary
})
export class SurveyDetailComponent implements OnInit {
  survey$: Observable<any> | null = null;  // Observable for the survey data

  constructor(private route: ActivatedRoute, private surveysService: SurveysService) {}

  ngOnInit(): void {
    // Get the survey ID from the route parameters
    const surveyId = this.route.snapshot.paramMap.get('id');
    if (surveyId) {
      this.survey$ = this.surveysService.getSurvey(surveyId); // Fetch survey details
    }
  }
}
