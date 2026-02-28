import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToCSV } from './exportToCSV';

describe('exportToCSV', () => {
  beforeEach(() => {
    // Mock global objects
    global.alert = vi.fn();
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    
    // Mock document.createElement and link behavior
    const mockLink = {
      setAttribute: vi.fn(),
      style: {},
      click: vi.fn(),
    };
    
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  it('shows an alert if products array is empty', () => {
    exportToCSV([]);
    expect(global.alert).toHaveBeenCalledWith("No data available to export.");
  });

  it('generates a CSV and triggers download', () => {
    const mockProducts = [
      {
        _id: '123',
        name: 'Test Asset "Pro"',
        category: 'Hardware',
        subcategory: 'Laptops',
        stock: 5,
        price: 999,
        createdAt: '2026-01-01T12:00:00Z'
      }
    ];

    exportToCSV(mockProducts);

    // Ensure it didn't alert
    expect(global.alert).not.toHaveBeenCalled();

    // Verify it created a link and clicked it
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });
});
