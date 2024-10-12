import { Routes } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from './auth.guard';
import { SurveyListComponent } from './survey/surveys-list/surveys-list.component';
import { SurveyDetailComponent } from './survey/survey-detail/survey-detail.component';
import { SearchResultsListComponent } from './survey/search-results-list/search-results-list.component';
import { SearchResultDetailComponent } from './survey/search-result-detail/search-result-detail.component';
import { ExportResultsComponent } from './survey/export-results/export-results.component';
import { SearchesListComponent } from './survey/searches-list/searches-list.component';

export const routes: Routes = [
  { path: 'instructions', component: InstructionsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'sign-in', component: SignInComponent },

  { 
    path: 'surveys', 
    component: SurveyListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'surveys/:id', 
    component: SurveyDetailComponent, 
    canActivate: [AuthGuard],
    children: [
      {
        path: 'search-results',
        component: SearchResultsListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'search-results/:resultId',
        component: SearchResultDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'export-results',
        component: ExportResultsComponent, 
        canActivate: [AuthGuard]
      },
      {
        path: 'searches',
        component: SearchesListComponent,
        canActivate: [AuthGuard]
      }
    ]
  },

  { path: '', redirectTo: '/surveys', pathMatch: 'full' },
];