import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './service-search-bar.component.html',
  styleUrls: ['./service-search-bar.component.css']
})
export class ServiceSearchBarComponent {
  @Input() categories: any[] = [];
  @Output() filterChange = new EventEmitter<{
    searchTerm: string;
    selectedCategory: string;
    selectedStatus: string;
  }>();

  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  onSearch() {
    this.emitFilters();
  }

  onFilter() {
    this.emitFilters();
  }

  private emitFilters() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      selectedCategory: this.selectedCategory,
      selectedStatus: this.selectedStatus
    });
  }
}
