import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
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
