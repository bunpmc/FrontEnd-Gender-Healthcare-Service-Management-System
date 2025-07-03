import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-header',
  imports: [CommonModule],
  templateUrl: './doctor-header.component.html',
  styleUrls: ['./doctor-header.component.css']
})
export class DoctorHeaderComponent {
  showNotificationMenu: boolean = false;
  showProfileMenu: boolean = false;
  notifications: string[] = [
    'New message from John',
    'Your order has been shipped',
    'New comment on your post'
  ];

  toggleNotificationMenu() {
    this.showNotificationMenu = !this.showNotificationMenu;
    this.showProfileMenu = false; // Close profile menu if open
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotificationMenu = false; // Close notification menu if open
  }
}
