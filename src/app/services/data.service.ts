import { Injectable } from '@angular/core';

export interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly companyInfo = {
    name: 'CASRE INGENIERÍA',
    whatsapp: '51931750970',
    email: 'casreconsultores@gmail.com',
    address: 'Jr. Simón Bolívar S/N Sector Educación Mz E Lt 01B. Distrito de Ayacucho, Provincia de Huamanga',
    ruc: '20601234567',
    manager: 'Ing. Responsable'
  };

  readonly services: ServiceItem[] = [
    { title: 'Topografía y Geodesia', description: 'Levantamiento con uso de Sistema GNSS.', imageUrl: 'assets/img1.webp' },
    { title: 'Fotogrametría', description: 'Cartografía digital mediante drones.', imageUrl: 'assets/img2.webp' },
    { title: 'Topografía LiDAR', description: 'Modelos de alta precisión láser.', imageUrl: 'assets/img3.webp' },
    { title: 'Saneamiento Físico Legal', description: 'Titulación de predios rurales.', imageUrl: 'assets/img4.webp' },
    { title: 'Primera Inscripción', description: 'Gestión registral de dominio.', imageUrl: 'assets/img5.webp' }
  ];

  getWhatsAppUrl(): string {
    const message = encodeURIComponent(
      'Hola, me interesa solicitar una cotización de sus servicios de topografía y catastro. ¿Me pueden brindar más información?'
    );
    return `https://wa.me/${this.companyInfo.whatsapp}?text=${message}`;
  }
}