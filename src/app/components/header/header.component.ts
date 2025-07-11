import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../test/auth.service';
import { CartService } from '../../test/cart.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // THÊM
import { TokenService } from '../../test/token.service';
import { Cart } from '../../models/payment.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, TranslateModule, CommonModule], // THÊM TranslateModule
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSearch = false;
  isActive = false;
  isMenuOpen = false;
  isUserMenuOpen = false;
  isScrolled = false;
  user: any = null;
  currentLang = 'vi'; // Ngôn ngữ hiện tại
  cart: Cart = { items: [], total: 0, itemCount: 0 };

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private translate = inject(TranslateService); // THÊM
  private destroy$ = new Subject<void>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  ngOnInit() {
    this.currentLang = localStorage.getItem('lang') || 'vi';
    this.translate.use(this.currentLang);
    this.getUserInfo();

    // Subscribe to cart changes
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart: Cart) => {
        this.cart = cart;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeLang(lang: string) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    }
  }

  getUserInfo() {
    this.authService.getUserProfile().subscribe({
      next: (data: any) => {
        this.user = data;
      },
      error: (err: any) => {
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
