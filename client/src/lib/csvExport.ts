import { Professional } from './types';

export const exportToCsv = (professionals: Professional[]): void => {
  if (!professionals || professionals.length === 0) {
    console.error('No data to export');
    return;
  }

  try {
    // Define column headers in the correct order
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

    // Convert professionals data to CSV rows
    const rows = professionals.map((professional, index) => [
      index + 1, // Roll number
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

    // Join headers and rows
    const csvContent = [
      headers.map(header => `"${header}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create and trigger the download link
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `professionals_data_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log(`Successfully exported ${professionals.length} records to CSV`);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};
