import { SupabaseService } from './../supabase.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceSearchBarComponent } from "./service-search-bar/service-search-bar.component";
import { ServiceTableComponent } from "./service-table/service-table.component";

@Component({
  selector: 'app-service-management',
  imports: [CommonModule, ServiceSearchBarComponent, ServiceTableComponent],
  templateUrl: './service-management.component.html',
  styleUrl: './service-management.component.css'
})
export class ServiceManagementComponent {

  services: any[] = [];
  categories: any[] = [];

  constructor(private supabaseService : SupabaseService) {}

  async ngOnInit(){
    this.services = await this.supabaseService.getMedicalService();
    this.categories = await this.supabaseService.getServiceCatagories();
  }

  filteredServices = [...this.services];

  applyFilters(filters: { searchTerm: string; selectedCategory: string; selectedStatus: string }) {
    this.filteredServices = this.services.filter(sv => {
      // Tìm kiếm theo tên dịch vụ
      const searchMatch = !filters.searchTerm ||
        sv.service_name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      // Lọc theo danh mục
      const categoryMatch = !filters.selectedCategory ||
        sv.category_id === filters.selectedCategory;

      // Lọc theo trạng thái
      const statusMatch = !filters.selectedStatus ||
        sv.is_active.toString() === filters.selectedStatus;

      return searchMatch && categoryMatch && statusMatch;
    });
  }
}
