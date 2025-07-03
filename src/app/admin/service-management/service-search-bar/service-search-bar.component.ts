import { Category } from './../../../models/category.interface';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-service-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-search-bar.component.html',
  styleUrls: ['./service-search-bar.component.css']
})
export class ServiceSearchBarComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];
  @Output() filterChange = new EventEmitter<{
    searchTerm: string;
    selectedCategory: string;
    selectedStatus: string;
  }>();
  @Output() addService = new EventEmitter<void>();

  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.emitFilters());
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  onFilter() {
    this.emitFilters();
  }

  onAddService() {
    this.addService.emit();
  }

  private emitFilters() {
    this.filterChange.emit({
      searchTerm: this.searchTerm.trim(),
      selectedCategory: this.selectedCategory,
      selectedStatus: this.selectedStatus
    });
  }
}
