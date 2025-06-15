import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-service-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './service-table.component.html',
  styleUrl: './service-table.component.css'
})
export class ServiceTableComponent {
  @Input() filteredServices: any[] = [];
  @Input() categories: any[] = [];

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.category_id === categoryId);
    return category ? category.category_name : categoryId;
  }

  isToggled: boolean = false;

  // onToggleChange(): void {
  //   console.log('Switch state:', this.isToggled ? 'ON' : 'OFF');
  // }
}
