import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-activity',
  imports: [CommonModule],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.css'
})
export class RecentActivityComponent {
  activities = [
    {
      type: 'info',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'New patient registered',
      description: 'Sarah Johnson - 2 minutes ago',
      iconHover: false
    },
    {
      type: 'success',
      iconPath: 'M5 13l4 4L19 7',
      title: 'Appointment completed',
      description: 'Dr. Smith with John Doe - 15 minutes ago',
      iconHover: false
    },
    {
      type: 'error',
      iconPath: 'M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z',
      title: 'Payment overdue',
      description: 'Invoice #1234 - 1 hour ago',
      iconHover: false
    }
  ];
}
