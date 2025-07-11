import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './forget-password-page.component.html',
  styleUrl: './forget-password-page.component.css',
})
export class ForgotPasswordComponent {
  @Output() close = new EventEmitter<void>();

  step = signal(1); // 1: nhập sđt, 2: nhập otp + mk mới, 3: done
  phone = signal('');
  otp = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  // Gửi OTP
  onSubmitPhone(form: NgForm) {
    if (this.isLoading()) return;
    this.errorMsg.set('');
    this.successMsg.set('');
    if (!form.valid) return;
    this.isLoading.set(true);
    this.authService.forgotPassword(this.phone()).subscribe({
      next: () => {
        this.successMsg.set(
          this.translate.instant('FORGOT_PASSWORD.SUCCESS.OTP_SENT')
        );
        this.step.set(2);
      },
      error: (err: any) => {
        const errorMsg =
          err?.error?.message ||
          this.translate.instant('FORGOT_PASSWORD.ERRORS.OTP_SEND_FAILED');
        this.errorMsg.set(errorMsg);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  // Đặt lại mật khẩu
  onSubmitReset(form: NgForm) {
    if (this.isLoading()) return;
    this.errorMsg.set('');
    this.successMsg.set('');
    if (!form.valid) return;
    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMsg.set(
        this.translate.instant('FORGOT_PASSWORD.ERRORS.PASSWORD_MISMATCH')
      );
      return;
    }
    this.isLoading.set(true);
    this.authService
      .resetPassword(this.phone(), this.otp(), this.newPassword())
      .subscribe({
        next: () => {
          this.successMsg.set(
            this.translate.instant('FORGOT_PASSWORD.SUCCESS.PASSWORD_RESET')
          );
          this.step.set(3);
        },
        error: (err: any) => {
          const errorMsg =
            err?.error?.message ||
            this.translate.instant(
              'FORGOT_PASSWORD.ERRORS.INVALID_OTP_PASSWORD'
            );
          this.errorMsg.set(errorMsg);
        },
        complete: () => this.isLoading.set(false),
      });
  }
}
