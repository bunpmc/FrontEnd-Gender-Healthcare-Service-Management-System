
import { error } from 'console';
import { supabase } from './../supabase-client';
import { SupabaseService } from './../supabase.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { flush } from '@angular/core/testing';

interface StatsCard {
  title: string;
  iconPath: string;
  value: string;
  subtext: string;
  alert?: string;
  loading?: boolean;
}

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.css'
})

export class StatsCardComponent implements OnInit {
  statsCards: StatsCard[] = [
    {
      title: "Today's Appointment",
      iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      value: '-',
      subtext: 'Loading...',
      loading: true
    },
    {
      title: 'Total Patients',
      iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      value: '-',
      subtext: 'Loading...',
      loading: true
    },
    {
      title: 'Revenue Today',
      iconPath: 'M3 3v18h18M7 14l4-4 4 4 4-4',
      value: '-',
      subtext: 'Loading...',
      loading: true
    },
    {
      title: 'Pending Tasks',
      iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      value: '-',
      subtext: '2 urgent',
      alert: '2 urgent'
    }
  ];

  constructor(private SupabaseService : SupabaseService){}

  ngOnInit(): void {
    this.loadStatsData();
  }

  private loadStatsData() : void {
    const today = this.SupabaseService.getTodayDate();
    const yesterday = this.SupabaseService.getYesterdayDate();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

    forkJoin({
      todayAppointments : this.SupabaseService.getAppointmentCountByDay(today),
      yesterdayAppointments: this.SupabaseService.getAppointmentCountByDay(yesterday),
      totalPatients: this.SupabaseService.getPatientCountByMonth(currentYear, currentMonth),
      todayRevenue: this.SupabaseService.getDailyRevenue(today),
      yesterdayRevenue: this.SupabaseService.getDailyRevenue(yesterday),
    }).subscribe({
      next: (data) => {
        this.updateStatsCards(data);
      },
      error: (error) => {
        console.error('Error loading stats data:', error);
        this.handleError();
      }
    });
  }

  private updateStatsCards(data : any): void{
    // Cập nhật Today's Appointment
    const appointmentChange = this.calculatePercentageChange(
      data.todayAppointments,
      data.yesterdayAppointments
    );

    this.statsCards[0] = {
      ...this.statsCards[0],
      value: data.todayAppointments.toString(),
      subtext: `${appointmentChange >= 0 ? '+' : '-'}${appointmentChange}%from yesterday`,
      loading: false
    };

    // Cập nhật Total Patients (theo tháng hiện tại)
    this.statsCards[1] = {
      ...this.statsCards[1],
      value: this.formatNumber(data.totalPatients),
      subtext: 'This month',
      loading: false
    }

    // Cập nhật Revenue Today
    const revenueChange = this.calculatePercentageChange(
      data.todayRevenue,
      data.yesterdayRevenue
    );
    this.statsCards[2] = {
      ...this.statsCards[2],
      value: this.formatCurrency(data.todayRevenue),
      subtext: `${revenueChange >= 0 ? '+' : '-'}${revenueChange}% from yesterday`,
      loading: false
    };
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private formatNumber(num : number) : string {
    return num.toLocaleString();
  }

  private formatCurrency(amount : number) : string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  private handleError(): void {
    this.statsCards.forEach((card, index) => {
      if (index < 3 ){
        this.statsCards[index] = {
          ...card,
          value: 'Error',
          subtext: 'Failed to load',
          loading: false
        };
      }
    });
  }

  // Phương thức để refresh data
  refreshData() : void {
    this.statsCards.forEach((card, index) => {
      if (index < 3) {
        card.loading = true;
        card.value = '-';
        card.subtext = 'Loading....';
      }
    });
    this.loadStatsData();
  }
}
