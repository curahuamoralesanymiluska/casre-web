import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
// Eliminamos los import estáticos para hacer lazy loading de las demás páginas
// import { ServicesComponent } from './pages/services/services.component';
// import { AboutComponent } from './pages/about/about.component';
// import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'nosotros', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'servicios', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent) },
  { path: 'contacto', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', redirectTo: '' }
];