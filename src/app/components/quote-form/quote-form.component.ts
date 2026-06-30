import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

interface ContactForm {
  nombre:   string;
  apellido: string;
  empresa:  string;
  telefono: string;
  email:    string;
  mensaje:  string;
}

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.scss',
})
export class QuoteFormComponent {

  form = signal<ContactForm>({
    nombre: '', apellido: '', empresa: '',
    telefono: '', email: '', mensaje: ''
  });

  isSubmitting = signal(false);
  submitted    = signal(false);
  
  readonly waUrl = inject(DataService).getWhatsAppUrl();

  updateField(field: keyof ContactForm, value: string): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  isValid(): boolean {
    const f = this.form();
    const phoneDigits = f.telefono.replace(/\D/g, '');
    return f.nombre.trim().length > 0
      && f.apellido.trim().length > 0
      && phoneDigits.length === 9
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)
      && f.mensaje.trim().length > 0;
  }

  async submit(): Promise<void> {
    if (!this.isValid()) return;
    this.isSubmitting.set(true);
    
    try {
      const f = this.form();
      // Usamos formsubmit.co para enviar correos directamente sin backend
      const response = await fetch('https://formsubmit.co/ajax/casreconsultores@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nueva Cotización de ${f.nombre} ${f.apellido} - CASRE Ingeniería`,
          Nombre: f.nombre,
          Apellido: f.apellido,
          Empresa: f.empresa || 'No especificada',
          Teléfono: f.telefono || 'No especificado',
          Email: f.email,
          Mensaje: f.mensaje
        })
      });

      const Swal = (await import('sweetalert2')).default;
      
      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: '¡Mensaje Enviado!',
          text: 'Hemos recibido tu solicitud. Nos pondremos en contacto contigo muy pronto.',
          confirmButtonColor: '#F37021',
          confirmButtonText: 'Entendido'
        });
        this.form.set({ nombre: '', apellido: '', empresa: '', telefono: '', email: '', mensaje: '' });
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      const Swal = (await import('sweetalert2')).default;
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema enviando el mensaje. Por favor intenta contactarnos por WhatsApp.',
        confirmButtonColor: '#0f2d52',
        confirmButtonText: 'Cerrar'
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}