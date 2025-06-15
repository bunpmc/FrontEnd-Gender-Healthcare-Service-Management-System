import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-today-schedule',
  imports: [CommonModule],
  templateUrl: './today-schedule.component.html',
  styleUrl: './today-schedule.component.css'
})
export class TodayScheduleComponent {
  schedules = [
    {
      time : new Date(11, 12, 2025),
      description : "ai biet",
      status : 'pending'
    },
    {
      time : new Date(11, 12, 2025),
      description : "tao  biet",
      status : 'done'
    },
    {
      time : new Date(11, 12, 2025),
      description : "ai biet",
      status : 'late'
    }
  ];
}
