import { Staff, Role } from './../models/staff.interface';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../supabase.service';
import { StaffSearchBarComponent } from './staff-search-bar/staff-search-bar.component';
import { StaffTableComponent } from './staff-table/staff-table.component';

@Component({
  selector: 'app-staff-management',
  imports: [CommonModule, StaffSearchBarComponent, StaffTableComponent],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css'],
  standalone: true
})
export class StaffManagementComponent implements OnInit {
  staffMembers: Staff[] = [];
  roles: Role[] = [];
  filteredStaff: Staff[] = [];
  isLoading = false;
  page: number = 1;
  pageSize: number = 10;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.staffMembers = await this.supabaseService.getStaffMembers();
      this.roles = await this.supabaseService.getStaffRoles();
      this.filteredStaff = [...this.staffMembers];
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  applyFilters(filters: { searchTerm: string; selectedRole: string; selectedStatus: string }) {
    this.page = 1; // Reset to first page when filters change
    this.filteredStaff = this.staffMembers.filter(staff =>
      (!filters.searchTerm || staff.full_name.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.selectedRole || staff.role === filters.selectedRole) &&
      (!filters.selectedStatus || staff.staff_status === filters.selectedStatus)
    );
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.page = event.page;
    this.pageSize = event.pageSize; // Keep for compatibility, but pageSize is fixed
  }

  onViewStaff(staff: Staff) {
    console.log('View staff:', staff);
  }

  onEditStaff(staff: Staff) {
    console.log('Edit staff:', staff);
  }

  onAddStaff() {
    console.log('Add new staff');
  }
}
