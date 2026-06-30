import { Component, input, output } from '@angular/core';
import { Project } from '../../models/project.model';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [TruncatePipe, DatePipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  // Signal inputs (modern Angular 22 API)
  public readonly project = input.required<Project>();

  // Output event emitter (modern Angular output API)
  public readonly star = output<string>();

  public onStarClick(): void {
    this.star.emit(this.project().id);
  }
}
