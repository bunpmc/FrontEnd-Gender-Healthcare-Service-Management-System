import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { MainPanelsComponent } from '../main-panels/main-panels.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatsCardComponent, MainPanelsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
