import { Component } from '@angular/core';
import { ChartComponent } from "./chart/chart.component";
import { KpiCardComponent } from "./kpi-card/kpi-card.component";

@Component({
  selector: 'app-analytic-management',
  imports: [ChartComponent, KpiCardComponent],
  templateUrl: './analytic-management.component.html',
  styleUrl: './analytic-management.component.css'
})
export class AnalyticManagementComponent {

}
