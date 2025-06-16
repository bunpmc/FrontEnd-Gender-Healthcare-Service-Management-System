import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../supabase.service';
import { ServiceSearchBarComponent } from './service-search-bar/service-search-bar.component';
import { ServiceTableComponent } from './service-table/service-table.component';
import { Service } from '../models/service.interface';
import { Category } from '../models/category.interface';

@Component({
  selector: 'app-service-management',
  imports: [CommonModule, ServiceSearchBarComponent, ServiceTableComponent],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css']
})
export class ServiceManagementComponent {
  services: Service[] = [];
  categories: Category[] = [];
  filteredServices: Service[] = [];
  isLoading = false;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.services = await this.supabaseService.getMedicalService();
      this.categories = await this.supabaseService.getServiceCatagories(); // Ensure correct method name
      this.filteredServices = [...this.services];
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  applyFilters(filters: { searchTerm: string; selectedCategory: string; selectedStatus: string }) {
    this.filteredServices = this.services.filter(sv =>
      (!filters.searchTerm || sv.service_name.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.selectedCategory || sv.category_id === filters.selectedCategory) &&
      (!filters.selectedStatus || sv.is_active.toString() === filters.selectedStatus)
    );
  }

  onViewService(service: Service) {
    // Implement view logic (e.g., open a modal with service details)
    console.log('View service:', service);
  }

  onEditService(service: Service) {
    // Implement edit logic (e.g., open a form to edit service)
    console.log('Edit service:', service);
  }
}
