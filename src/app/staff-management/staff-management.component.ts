import { Component } from '@angular/core';
import { StaffOverviewComponent } from "./staff-overview/staff-overview.component";
import { FilterBarComponent } from "./filter-bar/filter-bar.component";
import { StaffTableComponent } from "./staff-table/staff-table.component";

@Component({
  selector: 'app-staff-management',
  imports: [StaffOverviewComponent, FilterBarComponent, StaffTableComponent],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.css'
})
export class StaffManagementComponent {

}
