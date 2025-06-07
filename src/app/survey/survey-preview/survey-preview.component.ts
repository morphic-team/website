import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Survey, SurveyField } from '../models/survey.model';

@Component({
  selector: 'app-survey-preview',
  imports: [CommonModule, FormsModule],
  templateUrl: './survey-preview.component.html',
  styleUrls: ['./survey-preview.component.css']
})
export class SurveyPreviewComponent {
  @Input() survey: Survey = {
    name: '',
    comments: '',
    fields: [],
    isMutable: true
  };

  // Mock form values for preview
  previewValues: { [fieldId: string]: any } = {};

  constructor() {}

  getOptionsArray(field: SurveyField): string[] {
    if (!field.options) return [];
    return field.options.split(',').map(option => option.trim()).filter(option => option.length > 0);
  }
}