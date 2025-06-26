// kpi-card.component.ts
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css',
})
export class KpiCardComponent implements OnInit {
  appointments = 0;
  newPatients = 0;
  revenue = 0;
  taskCompletion = 0;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    const end = new Date();

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    this.appointments = await this.supabaseService.getAppointmentsCount(startISO, endISO);
    this.newPatients = await this.supabaseService.getNewPatientsCount(startISO, endISO);
    this.revenue = await this.supabaseService.getRevenueSum(startISO, endISO);
    this.taskCompletion = await this.supabaseService.getTaskCompletionRatio(startISO, endISO);
  }
}
