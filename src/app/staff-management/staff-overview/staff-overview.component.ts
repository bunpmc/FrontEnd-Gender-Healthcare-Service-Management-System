import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-staff-overview',
  imports: [CommonModule],
  templateUrl: './staff-overview.component.html',
  styleUrl: './staff-overview.component.css'
})
export class StaffOverviewComponent {
  staffOverviews = [
    {
      title : 'Total Staff',
      iconPath : "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
      value: 24,
      subtext: '+2 this month'
    },
    {
      title: 'Active',
      iconPath: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
      value: 22,
      subtext: "91.7%"
    },
    {
      title : 'On Leave',
      iconPath: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
      value: 2,
      subtext: '8.3%'
    },
    {
      title: 'Avg Experience',
      iconPath: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
      value: 7.2,
      subtext: 'High Expertise'
    }
  ];
}
