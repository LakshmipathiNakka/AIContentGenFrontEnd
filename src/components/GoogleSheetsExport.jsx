import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:3000';

export const GoogleSheetsExport = ({ questions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if the server is healthy
      const healthCheck = await fetch(`${API_URL}/api/health`);
      if (!healthCheck.ok) {
        throw new Error('Server is not responding');
      }
      
      const response = await fetch(`${API_URL}/api/export-to-sheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions,
          title: 'Generated Questions',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export to Google Sheets');
      }

      const data = await response.json();
      
      // Open the spreadsheet in a new tab
      window.open(data.url, '_blank');
    } catch (err) {
      setError(err.message || 'Failed to export to Google Sheets. Please try again.');
      console.error('Export error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleExport}
        disabled={isLoading || !questions?.length}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          'Open in Google Sheets'
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}; 