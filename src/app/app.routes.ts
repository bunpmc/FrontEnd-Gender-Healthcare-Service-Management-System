import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';

import { DoctorsPageComponent } from './pages/doctors-page/doctors-page.component';

import { BlogsPageComponent } from './pages/blogs-page/blogs-page.component';
import { DoctorDetailComponent } from './pages/doctor-detail/doctor-detail.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'appointment', component: AppointmentPageComponent },
  { path: 'doctor', component: DoctorsPageComponent },
  { path: 'doctor/:id', component: DoctorDetailComponent },
  { path: 'blog', component: BlogsPageComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // <-- THẦN CHÚ!
      anchorScrolling: 'enabled', // bonus: lướt tới #id nếu cần
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
