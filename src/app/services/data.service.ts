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
    { title: 'Topografía y Geodesia', description: 'Levantamiento de alta precisión con uso de Sistema GNSS y Drones.', imageUrl: 'assets/img-fotogrametria-dron.webp' },
    { title: 'Saneamiento Físico Legal', description: 'Diagnóstico, titulación y saneamiento integral de predios.', imageUrl: 'assets/img-saneamiento-campo.webp' },
    { title: 'Edificaciones y Licencias', description: 'Declaratoria de fábrica, habilitación urbana y licencias.', imageUrl: 'assets/img-edificaciones-dron.webp' },
    { title: 'Recursos Hídricos', description: 'Estudios de balance hídrico, fajas marginales y licencias de uso de agua.', imageUrl: 'assets/img-recursos-hidricos.webp' },
    { title: 'Gestión del Territorio', description: 'Evaluación de Riesgos (EVAR) y Análisis de Riesgos (AdR) territoriales.', imageUrl: 'assets/img-gestion-territorio.webp' }
  ];

  getWhatsAppUrl(): string {
    const message = encodeURIComponent(
      'Hola, me interesa solicitar una cotización de sus servicios de topografía y catastro. ¿Me pueden brindar más información?'
    );
    return `https://wa.me/${this.companyInfo.whatsapp}?text=${message}`;
  }
}