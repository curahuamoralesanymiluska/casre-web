import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly waNumber = inject(DataService).companyInfo.whatsapp;
  
  formData = {
    name: '',
    phone: '',
    service: 'Topografía y Geodesia',
    message: ''
  };

  sendToWhatsApp() {
    if (!this.formData.name || !this.formData.phone || !this.formData.message) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const text = `Hola CASRE INGENIERÍA.%0A%0AMi nombre es: ${this.formData.name}%0AMi celular es: ${this.formData.phone}%0AMe interesa el servicio de: ${this.formData.service}%0A%0A${this.formData.message}`;
    window.open(`https://wa.me/${this.waNumber}?text=${text}`, '_blank');
  }
}