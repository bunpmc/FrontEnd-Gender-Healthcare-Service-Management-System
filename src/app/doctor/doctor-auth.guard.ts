import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DoctorAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Replace this with your real authentication logic
    const isDoctor = localStorage.getItem('role') === 'doctor';
    if (!isDoctor) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
