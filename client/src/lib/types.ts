export interface Professional {
  id: number;
  trackingNumber: string;
  fullName: string;
  gender: string;
  dateOfRegistration: string;
  phoneNumber: string;
  professionalTitle: string;
  professionalNumber: string;
  sector: string;
  serviceType: string;
}

export interface ProfessionalFormData {
  trackingNumber: string;
  fullName: string;
  gender: string;
  dateOfRegistration: string;
  phoneNumber: string;
  professionalTitle: string;
  professionalNumber: string;
  sector: string;
  serviceType: string;
}

export type ThemeMode = 'light' | 'dark';
