// ==================== IMPORTS ====================
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { GoogleComponent } from '../../components/google/google.component';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// ==================== COMPONENT DECORATOR ====================
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, GoogleComponent, TranslateModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterComponent {
  // ==================== STATE / PROPERTY ====================
  showPass = false;
  showConfirmPass = false;
  formSubmitted = false;
  isUsed = false;
  errorMsg = '';
  isSubmitting = false;

  // ==================== VIEWCHILD & DEPENDENCY INJECTION ====================
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  // ==================== CONSTRUCTOR ====================
  constructor() {
    afterNextRender(() => {
      // --- Lấy dữ liệu đã lưu, nếu có ---
      const savedForm = window.localStorage.getItem('save-register-form');
      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        Promise.resolve().then(() => {
          if (this.form().controls['phone'] && loadedFormData.phone) {
            this.form().controls['phone'].setValue(loadedFormData.phone);
          }
        });
      }
      // --- Lưu form mỗi khi thay đổi, debounce tránh spam ---
      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'save-register-form',
              JSON.stringify({
                phone: value.phone,
              })
            ),
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  // ==================== METHODS ====================

  /**
   * Khi user nhập phone thì reset cờ isUsed và errorMsg
   */
  onPhoneInput() {
    this.isUsed = false;
    this.errorMsg = '';
  }

  /**
   * Xử lý khi submit form đăng ký
   * @param formData Dữ liệu form (NgForm)
   */
  onRegister(formData: NgForm) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.formSubmitted = true;
    this.errorMsg = '';
    if (formData.valid) {
      const subscription = this.authService
        .registerUser(formData.form.value)
        .subscribe({
          next: (res: any) => {
            // --- Lấy token từ response (tùy BE) ---
            const token =
              res.access_token ||
              (res.data && res.data.access_token) ||
              res.token;
            if (token) {
              console.log(token);
              this.tokenService.setTokenSession(token);
              // TODO: redirect user sang trang chính nếu muốn
              this.router.navigate(['/']);
            }
            // --- Xoá form lưu tạm & reset form (nếu muốn) ---
            // localStorage.removeItem('save-register-form');
            // formData.resetForm();
          },
          error: (err) => {
            if (err.status === 401) {
              this.errorMsg = this.translate.instant(
                'REGISTER.ERRORS.PHONE_ALREADY_USED'
              );
              alert(this.errorMsg);
              this.isUsed = true;
            } else if (err.status === 500) {
              this.errorMsg = this.translate.instant(
                'REGISTER.ERRORS.SERVER_ERROR'
              );
              alert(this.errorMsg);
            } else {
              this.errorMsg = this.translate.instant(
                'REGISTER.ERRORS.REGISTRATION_FAILED'
              );
              alert(this.errorMsg);
            }
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    } else {
      this.formSubmitted = true;
      this.isSubmitting = false;
      return;
    }
  }
}
