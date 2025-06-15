import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-staff-table',
  imports: [CommonModule],
  templateUrl: './staff-table.component.html',
  styleUrl: './staff-table.component.css'
})
export class StaffTableComponent {
  staffs = [
    {
      initials: 'JS',
      name: 'John Smith',
      id: '0001', // UUID giả lập cho staff_id
      role: 'Doctor',
      email: 'john.smith@email.com',
      years_experience: 10, // Thêm để khớp với database
      hiredDate: '2015-12-15', // Định dạng YYYY-MM-DD để khớp với hired_at
      status: 'active', // Khớp với staff_status
      available: true
    },
    {
      initials: 'JS',
      name: 'John Smith',
      id: '0001', // UUID giả lập cho staff_id
      role: 'Doctor',
      email: 'john.smith@email.com',
      years_experience: 10, // Thêm để khớp với database
      hiredDate: '2015-12-15', // Định dạng YYYY-MM-DD để khớp với hired_at
      status: 'active', // Khớp với staff_status
      available: true
    },
    {
      initials: 'JS',
      name: 'John Smith',
      id: '0001', // UUID giả lập cho staff_id
      role: 'Doctor',
      email: 'john.smith@email.com',
      years_experience: 10, // Thêm để khớp với database
      hiredDate: '2015-12-15', // Định dạng YYYY-MM-DD để khớp với hired_at
      status: 'active', // Khớp với staff_status
      available: true
    },
    {
      initials: 'JS',
      name: 'John Smith',
      id: '0001', // UUID giả lập cho staff_id
      role: 'Doctor',
      email: 'john.smith@email.com',
      years_experience: 10, // Thêm để khớp với database
      hiredDate: '2015-12-15', // Định dạng YYYY-MM-DD để khớp với hired_at
      status: 'active', // Khớp với staff_status
      available: true
    }
  ];
}
