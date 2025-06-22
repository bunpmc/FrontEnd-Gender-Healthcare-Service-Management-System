import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../models/service.interface';
import { Category } from '../../models/category.interface';

@Component({
  selector: 'app-service-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.css']
})
export class ServiceTableComponent {
  @Input() filteredServices: Service[] = [];
  @Input() categories: Category[] = [];
  @Output() viewService = new EventEmitter<Service>();
  @Output() editService = new EventEmitter<Service>();

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.category_id === categoryId);
    return category ? category.category_name : 'Unknown';
  }

  onViewService(service: Service) {
    this.viewService.emit(service);
  }

  onEditService(service: Service) {
    this.editService.emit(service);
  }
}
