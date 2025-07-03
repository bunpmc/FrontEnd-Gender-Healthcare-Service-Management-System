import { NgClass } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // THÊM
import { TokenService } from '../../Services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, TranslateModule], // THÊM TranslateModule
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isSearch = false;
  isActive = false;
  isMenuOpen = false;
  isUserMenuOpen = false;
  isScrolled = false;
  user: any = null;
  currentLang = 'vi'; // Ngôn ngữ hiện tại

  private userService = inject(UserService);
  private router = inject(Router);
  private translate = inject(TranslateService); // THÊM

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  ngOnInit() {
    this.currentLang = localStorage.getItem('lang') || 'vi';
    this.translate.use(this.currentLang);
    this.getUserInfo();
  }

  changeLang(lang: string) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    }
  }

  getUserInfo() {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.user = null;
      },
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.user = null;
    this.router.navigate(['/login']);
  }

  isSearchHandle(val: boolean) {
    this.isSearch = val;
  }
  closeSearch() {
    this.isSearch = false;
  }
  openMenu() {
    this.isMenuOpen = true;
  }
  closeMenu() {
    this.isMenuOpen = false;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleHamburger() {
    this.isActive = !this.isActive;
  }
}
