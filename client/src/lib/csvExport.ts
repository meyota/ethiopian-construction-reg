import { Professional } from './types';

export const exportToCsv = (professionals: Professional[]): void => {
  // Headers for the CSV
  const headers = [
    'Tracking Number',
    'Full Name',
    'Gender',
    'Date of Registration',
    'Phone Number',
    'Professional Title',
    'Professional Number',
    'Sector',
    'Service Type'
  ];

  // Convert each professional to CSV row
  const rows = professionals.map((professional) => [
    professional.trackingNumber,
    professional.fullName,
    professional.gender,
    professional.dateOfRegistration,
    professional.phoneNumber,
    professional.professionalTitle,
    professional.professionalNumber,
    professional.sector,
    professional.serviceType
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `professionals_export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
