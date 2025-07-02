import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { MainPanelsComponent } from '../main-panels/main-panels.component';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatsCardComponent, MainPanelsComponent, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  notifications: any[] = []; // Replace 'any' with your notification type if available

  trackByNotificationId(index: number, notification: any) {
    return notification.notification_id ?? index;
  }
}
