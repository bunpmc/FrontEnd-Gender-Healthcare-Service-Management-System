import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../supabase.service';
import { 
  ActivityLog, 
  ActivityLogCreate, 
  ActivityLogUpdate, 
  ActivityLogFilters, 
  ActivityType, 
  ACTIVITY_TYPE_LABELS, 
  ACTIVITY_TYPE_COLORS 
} from '../../../models/activity-log.interface';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css']
})
export class ActivityLogsComponent implements OnInit {
  // Data properties
  activityLogs: ActivityLog[] = [];
  filteredLogs: ActivityLog[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  isLoading = false;

  // UI state
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedLog: ActivityLog | null = null;
  
  // Forms
  createForm: FormGroup;
  editForm: FormGroup;
  filterForm: FormGroup;

  // Constants
  activityTypeLabels = ACTIVITY_TYPE_LABELS;
  activityTypeColors = ACTIVITY_TYPE_COLORS;
  activityTypes: ActivityType[] = Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[];
  Math = Math; // Expose Math to template

  // Toast notification
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private supabaseService: SupabaseService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      activity_type: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      patient_id: [''],
      appointment_id: [''],
      metadata: ['']
    });

    this.editForm = this.fb.group({
      activity_type: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      patient_id: [''],
      appointment_id: [''],
      metadata: ['']
    });

    this.filterForm = this.fb.group({
      activity_type: [''],
      date_from: [''],
      date_to: [''],
      search_term: ['']
    });
  }

  async ngOnInit() {
    await this.loadActivityLogs();
    this.setupFilterSubscription();
  }

  setupFilterSubscription() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  async loadActivityLogs() {
    this.isLoading = true;
    try {
      const doctorId = this.getCurrentDoctorId();
      const response = await this.supabaseService.getDoctorActivityLogs(
        doctorId,
        this.currentPage,
        this.itemsPerPage
      );
      this.activityLogs = response.data;
      this.totalItems = response.total;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading activity logs:', error);
      this.showToastMessage('Failed to load activity logs', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  applyFilters() {
    const filters = this.filterForm.value;
    let filtered = [...this.activityLogs];

    if (filters.activity_type) {
      filtered = filtered.filter(log => log.activity_type === filters.activity_type);
    }

    if (filters.date_from) {
      filtered = filtered.filter(log => 
        new Date(log.created_at) >= new Date(filters.date_from)
      );
    }

    if (filters.date_to) {
      filtered = filtered.filter(log => 
        new Date(log.created_at) <= new Date(filters.date_to)
      );
    }

    if (filters.search_term) {
      const searchTerm = filters.search_term.toLowerCase();
      filtered = filtered.filter(log => 
        log.title.toLowerCase().includes(searchTerm) ||
        log.description.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredLogs = filtered;
  }

  // CRUD Operations
  openCreateModal() {
    this.createForm.reset();
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createForm.reset();
  }

  async createActivityLog() {
    if (this.createForm.valid) {
      try {
        const formData = this.createForm.value;
        const newLog: ActivityLogCreate = {
          doctor_id: this.getCurrentDoctorId(),
          activity_type: formData.activity_type,
          title: formData.title,
          description: formData.description,
          patient_id: formData.patient_id || null,
          appointment_id: formData.appointment_id || null,
          metadata: formData.metadata ? JSON.parse(formData.metadata) : null
        };

        await this.supabaseService.createActivityLog(newLog);
        this.showToastMessage('Activity log created successfully', 'success');
        this.closeCreateModal();
        await this.loadActivityLogs();
      } catch (error) {
        console.error('Error creating activity log:', error);
        this.showToastMessage('Failed to create activity log', 'error');
      }
    }
  }

  openEditModal(log: ActivityLog) {
    this.selectedLog = log;
    this.editForm.patchValue({
      activity_type: log.activity_type,
      title: log.title,
      description: log.description,
      patient_id: log.patient_id || '',
      appointment_id: log.appointment_id || '',
      metadata: log.metadata ? JSON.stringify(log.metadata, null, 2) : ''
    });
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedLog = null;
    this.editForm.reset();
  }

  async updateActivityLog() {
    if (this.editForm.valid && this.selectedLog) {
      try {
        const formData = this.editForm.value;
        const updateData: ActivityLogUpdate = {
          activity_type: formData.activity_type,
          title: formData.title,
          description: formData.description,
          patient_id: formData.patient_id || null,
          appointment_id: formData.appointment_id || null,
          metadata: formData.metadata ? JSON.parse(formData.metadata) : null
        };

        await this.supabaseService.updateActivityLog(this.selectedLog.id, updateData);
        this.showToastMessage('Activity log updated successfully', 'success');
        this.closeEditModal();
        await this.loadActivityLogs();
      } catch (error) {
        console.error('Error updating activity log:', error);
        this.showToastMessage('Failed to update activity log', 'error');
      }
    }
  }

  openDeleteModal(log: ActivityLog) {
    this.selectedLog = log;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedLog = null;
  }

  async deleteActivityLog() {
    if (this.selectedLog) {
      try {
        await this.supabaseService.deleteActivityLog(this.selectedLog.id);
        this.showToastMessage('Activity log deleted successfully', 'success');
        this.closeDeleteModal();
        await this.loadActivityLogs();
      } catch (error) {
        console.error('Error deleting activity log:', error);
        this.showToastMessage('Failed to delete activity log', 'error');
      }
    }
  }

  // Pagination
  get paginatedLogs() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredLogs.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Utility methods
  getCurrentDoctorId(): string {
    // TODO: Replace with actual doctor ID from authentication
    return 'doctor-123';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getActivityTypeClass(type: ActivityType): string {
    return this.activityTypeColors[type] || 'bg-gray-100 text-gray-800';
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  clearFilters() {
    this.filterForm.reset();
    this.currentPage = 1;
  }

  async exportLogs() {
    try {
      const csvContent = this.generateCSV(this.filteredLogs);
      this.downloadCSV(csvContent, 'activity-logs.csv');
      this.showToastMessage('Activity logs exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting logs:', error);
      this.showToastMessage('Failed to export activity logs', 'error');
    }
  }

  private generateCSV(logs: ActivityLog[]): string {
    const headers = ['Date', 'Type', 'Title', 'Description', 'Patient ID', 'Appointment ID'];
    const csvRows = [headers.join(',')];
    
    logs.forEach(log => {
      const row = [
        this.formatDate(log.created_at),
        this.activityTypeLabels[log.activity_type],
        `"${log.title}"`,
        `"${log.description}"`,
        log.patient_id || '',
        log.appointment_id || ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  trackByLogId(index: number, log: ActivityLog): string {
    return log.id;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
