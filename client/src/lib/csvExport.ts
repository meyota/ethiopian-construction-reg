import { Professional } from './types';

export const exportToCsv = (professionals: Professional[]): boolean | void => {
  if (!professionals || professionals.length === 0) {
    console.error('No data to export');
    return false;
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
      professional.trackingNumber || '',
      professional.fullName || '',
      professional.gender || '',
      professional.phoneNumber || '',
      professional.professionalTitle || '',
      professional.professionalNumber || '',
      professional.sector || '',
      professional.serviceType || '',
      professional.dateOfRegistration || ''
    ]);

    // Join headers and rows
    const csvContent = [
      headers.map(header => `"${header}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // For debugging
    console.log("CSV Content Preview:", csvContent.substring(0, 200) + "...");
    
    // Create a blob with BOM for Excel compatibility
    const BOM = "\uFEFF"; // UTF-8 BOM
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create and trigger the download link
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `professionals_data_${date}.csv`);
    
    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 300);
    
    console.log(`Successfully exported ${professionals.length} records to CSV`);
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
};
