import { Professional } from './types';

export const exportToCsv = (professionals: Professional[]): void => {
  // Headers for the CSV
  const headers = [
    'Roll No.',
    'Tracking Number',
    'Full Name',
    'Gender',
    'Phone Number',
    'Professional Title',
    'Professional Number',
    'Sector',
    'Service Type',
    'Date of Registration'
  ];

  // Convert each professional to CSV row
  const rows = professionals.map((professional, index) => [
    index + 1,
    professional.trackingNumber,
    professional.fullName,
    professional.gender,
    professional.phoneNumber,
    professional.professionalTitle,
    professional.professionalNumber,
    professional.sector,
    professional.serviceType,
    professional.dateOfRegistration
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
