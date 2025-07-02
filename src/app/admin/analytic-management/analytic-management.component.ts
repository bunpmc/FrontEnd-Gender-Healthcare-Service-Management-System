import { Component } from '@angular/core';
import { ChartComponent } from './chart/chart.component';
import { KpiCardComponent } from './kpi-card/kpi-card.component';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-analytic-management',
  standalone: true,
  templateUrl: './analytic-management.component.html',
  styleUrl: './analytic-management.component.css',
  imports: [ChartComponent, KpiCardComponent, HeaderComponent, SidebarComponent]
})
export class AnalyticManagementComponent {

}

