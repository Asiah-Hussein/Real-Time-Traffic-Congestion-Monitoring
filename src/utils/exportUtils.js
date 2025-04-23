// Convert data array to CSV format
export const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle strings with commas, quotes, etc.
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };
  
  // Download data as CSV file
  export const downloadCSV = (data, filename = 'traffic-data.csv') => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Generate a simple PDF report (mock function - in a real app you'd use a PDF library)
  export const downloadPDF = (data, title = 'Traffic Report') => {
    alert('PDF export functionality would typically use a library like jsPDF or pdfmake.');
    
    // In a real implementation, you would use a PDF library like:
    // import jsPDF from 'jspdf';
    // import 'jspdf-autotable';
    //
    // const doc = new jsPDF();
    // doc.text(title, 20, 10);
    // doc.autoTable({ head: [headers], body: rows });
    // doc.save('traffic-report.pdf');
  };