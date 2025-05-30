
export interface ExportNeed {
  school_name: string;
  need_title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  quantity: number;
  governorate: string;
  created_at: string;
}

export const exportToCSV = (data: ExportNeed[], filename: string = 'needs-export.csv') => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = [
    'School Name',
    'Need Title', 
    'Description',
    'Category',
    'Priority',
    'Status',
    'Quantity',
    'Governorate',
    'Created Date'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.school_name}"`,
      `"${row.need_title}"`,
      `"${row.description || ''}"`,
      `"${row.category}"`,
      `"${row.priority}"`,
      `"${row.status}"`,
      row.quantity,
      `"${row.governorate}"`,
      `"${new Date(row.created_at).toLocaleDateString()}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToExcel = async (data: ExportNeed[], filename: string = 'needs-export.xlsx') => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // For Excel export, we'll create a more structured format
  const excelData = data.map(row => ({
    'School Name': row.school_name,
    'Need Title': row.need_title,
    'Description': row.description || '',
    'Category': row.category,
    'Priority': row.priority,
    'Status': row.status,
    'Quantity': row.quantity,
    'Governorate': row.governorate,
    'Created Date': new Date(row.created_at).toLocaleDateString()
  }));

  // Convert to CSV format for now (can be enhanced with actual Excel library later)
  const headers = Object.keys(excelData[0]);
  const csvContent = [
    headers.join(','),
    ...excelData.map(row => 
      headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
