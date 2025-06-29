import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ContactMessage } from '../../models/user.model';
import { SupabaseService } from '../../Services/supabase.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-consultation-page',
  imports: [FooterComponent, HeaderComponent, FormsModule],
  templateUrl: './consultation-page.component.html',
  styleUrl: './consultation-page.component.css',
})
export class ConsultationPageComponent implements OnInit {
  isSubmitting = false;
  formSubmitted = false;
  errorMsg = '';
  RememberContact = false;

  // Bind cho form
  contactData: Partial<ContactMessage> = {};

  private supabaseService = inject(SupabaseService);

  ngOnInit() {
    // 1. Nếu có Remember-contact-form thì lấy tất cả data đã lưu
    const saved = localStorage.getItem('Remember-contact-form');
    if (saved) {
      this.contactData = JSON.parse(saved);
      this.RememberContact = true;
    }

    // 2. Nếu có pre-fill-message thì overwrite field message
    const prefill = localStorage.getItem('pre-fill-message');
    if (prefill) {
      this.contactData.message = prefill;
      localStorage.removeItem('pre-fill-message');
    }
  }

  onFieldInput(form: NgForm) {
    if (this.RememberContact) {
      localStorage.setItem('Remember-contact-form', JSON.stringify(form.value));
    }
  }
  markAllAsTouched(form: NgForm) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  async onContactSubmit(form: NgForm) {
    this.formSubmitted = true;
    this.errorMsg = '';
    if (form.invalid || this.isSubmitting) {
      this.markAllAsTouched(form);
      return;
    }
    this.isSubmitting = true;

    const contactData = { ...form.value };

    try {
      await this.supabaseService.callRpc('send_contact_message', {
        full_name: contactData.fullName,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
      });
      alert('Gửi thành công lên Supabase!');
      if (this.RememberContact) {
        localStorage.setItem(
          'Remember-contact-form',
          JSON.stringify(contactData)
        );
      } else {
        localStorage.removeItem('Remember-contact-form');
      }
      form.resetForm();
      this.formSubmitted = false;
      this.isSubmitting = false;
      this.contactData = {};
    } catch (err: any) {
      this.errorMsg = 'Lỗi gửi lên Supabase! ' + (err.message || '');
      alert(this.errorMsg);
      this.isSubmitting = false;
    }
  }
}
