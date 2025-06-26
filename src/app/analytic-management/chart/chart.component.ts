import { CommonModule } from '@angular/common';
import { SupabaseService } from './../../supabase.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  ageDist: any;
  genderDist: any;
  cancelRate = 0;
  avgDuration = 0;
  staffStats: any;

  constructor(private supabaseService : SupabaseService){}

  async ngOnInit() {
    this.ageDist = await this.supabaseService.getAgeDistribution();
    // this.genderDist = await this.supabaseService.getGenderDistribution();

    const start = new Date();
    start.setDate(start.getDate() - 30);
    const end = new Date();

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    this.cancelRate = await this.supabaseService.getCancelledRate(startISO, endISO);
    this.avgDuration = await this.supabaseService.getAvgAppointmentDuration();
    this.staffStats = await this.supabaseService.getStaffWorkloadBalance();
  }
}
