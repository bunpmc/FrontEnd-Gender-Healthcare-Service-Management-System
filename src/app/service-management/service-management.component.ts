import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { ServiceSearchBarComponent } from './service-search-bar/service-search-bar.component';
import { ServiceTableComponent } from './service-table/service-table.component';
import { Service } from '../models/service.interface';
import { Category } from '../models/category.interface';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceSearchBarComponent, ServiceTableComponent],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css']
})
export class ServiceManagementComponent implements OnInit {
  services: Service[] = [];
  categories: Category[] = [];
  filteredServices: Service[] = [];
  isLoading = false;
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;
  newService: Service = {
    service_id: '',
    category_id: '',
    service_name: '',
    service_description: null,
    service_cost: null,
    duration_minutes: null,
    is_active: true,
    image_link: null,
    description: null,
    overall: null
  };
  selectedService: Service = { ...this.newService };
  errors: {
    service_name: boolean;
    category_id: boolean;
    service_cost: boolean;
    duration_minutes: boolean;
    description: boolean;
  } = {
    service_name: false,
    category_id: false,
    service_cost: false,
    duration_minutes: false,
    description: false
  };

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      const [services, categories] = await Promise.all([
        this.supabaseService.getMedicalService(),
        this.supabaseService.getServiceCategories()
      ]);
      this.services = services;
      this.categories = categories;
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

  validateJson(field: 'description') {
    const value = field === 'description' ? this.newService.description : this.selectedService.description;
    if (value) {
      try {
        JSON.parse(value);
        this.errors[field] = false;
      } catch (e) {
        this.errors[field] = true;
      }
    } else {
      this.errors[field] = false;
    }
  }

  hasErrors(): boolean {
    return Object.values(this.errors).some(error => error) ||
      !this.newService.service_name ||
      !this.newService.category_id ||
      (this.newService.service_cost != null && this.newService.service_cost < 0) ||
      (this.newService.duration_minutes != null && (this.newService.duration_minutes <= 0 || this.newService.duration_minutes > 60));
  }

  openAddServiceModal() {
    this.newService = {
      service_id: '',
      category_id: '',
      service_name: '',
      service_description: null,
      service_cost: null,
      duration_minutes: null,
      is_active: true,
      image_link: null,
      description: null,
      overall: null
    };
    this.errors = {
      service_name: false,
      category_id: false,
      service_cost: false,
      duration_minutes: false,
      description: false
    };
    this.showAddModal = true;
  }

  closeAddServiceModal() {
    this.showAddModal = false;
    this.errors = {
      service_name: false,
      category_id: false,
      service_cost: false,
      duration_minutes: false,
      description: false
    };
  }

  async addService() {
    this.errors = {
      service_name: !this.newService.service_name,
      category_id: !this.newService.category_id,
      service_cost: this.newService.service_cost != null && this.newService.service_cost < 0,
      duration_minutes: this.newService.duration_minutes != null && (this.newService.duration_minutes <= 0 || this.newService.duration_minutes > 60),
      description: false
    };
    this.validateJson('description');

    if (this.hasErrors()) {
      return;
    }

    try {
      this.isLoading = true;
      const serviceToAdd = {
        ...this.newService,
        description: this.newService.description ? JSON.parse(this.newService.description) : null
      };
      await this.supabaseService.addMedicalService(serviceToAdd);
      this.services = await this.supabaseService.getMedicalService();
      this.filteredServices = [...this.services];
      this.closeAddServiceModal();
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    } finally {
      this.isLoading = false;
    }
  }

  openEditServiceModal(service: Service) {
    this.selectedService = {
      ...service,
      description: service.description ? JSON.stringify(service.description, null, 2) : null
    };
    this.errors = {
      service_name: false,
      category_id: false,
      service_cost: false,
      duration_minutes: false,
      description: false
    };
    this.showEditModal = true;
  }

  closeEditServiceModal() {
    this.showEditModal = false;
    this.errors = {
      service_name: false,
      category_id: false,
      service_cost: false,
      duration_minutes: false,
      description: false
    };
  }

  async updateService() {
    this.errors = {
      service_name: !this.selectedService.service_name,
      category_id: !this.selectedService.category_id,
      service_cost: this.selectedService.service_cost != null && this.selectedService.service_cost < 0,
      duration_minutes: this.selectedService.duration_minutes != null && (this.selectedService.duration_minutes <= 0 || this.selectedService.duration_minutes > 60),
      description: false
    };
    this.validateJson('description');

    if (this.hasErrors()) {
      return;
    }

    try {
      this.isLoading = true;
      const serviceToUpdate = {
        ...this.selectedService,
        description: this.selectedService.description ? JSON.parse(this.selectedService.description) : null
      };
      await this.supabaseService.updateMedicalService(serviceToUpdate);
      this.services = await this.supabaseService.getMedicalService();
      this.filteredServices = [...this.services];
      this.closeEditServiceModal();
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    } finally {
      this.isLoading = false;
    }
  }

  openViewServiceModal(service: Service) {
    this.selectedService = { ...service };
    this.showViewModal = true;
  }

  closeViewServiceModal() {
    this.showViewModal = false;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.category_id === categoryId);
    return category ? category.category_name : 'Unknown';
  }
}
