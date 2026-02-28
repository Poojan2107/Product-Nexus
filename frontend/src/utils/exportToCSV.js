export const exportToCSV = (products) => {
  if (!products || products.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Define headers representing the columns in the CSV
  const headers = ['Asset ID', 'Name', 'Category', 'Subcategory', 'Stock Count', 'Valuation (Price)', 'Status', 'Date Added'];
  
  // Map data to match headers
  const csvRows = products.map(p => {
    return [
      p._id,
      `"${p.name.replace(/"/g, '""')}"`, // escape double quotes
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${(p.subcategory || '').replace(/"/g, '""')}"`,
      p.stock || 0,
      p.price || 0,
      p.stock > 0 ? 'In Stock' : 'Out of Stock',
      new Date(p.createdAt).toLocaleDateString()
    ].join(',');
  });

  // Combine headers and rows
  const csvString = [headers.join(','), ...csvRows].join('\n');

  // Create a Blob from the CSV string
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link to trigger the download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Asset_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
