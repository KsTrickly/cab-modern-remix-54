import html2pdf from 'html2pdf.js';

interface PDFOptions {
  filename?: string;
  format?: string;
  orientation?: 'portrait' | 'landscape';
  margin?: number | [number, number, number, number];
  quality?: number;
}

export const generatePDF = async (
  elementId: string, 
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'booking-ticket.pdf',
    format = 'a4',
    orientation = 'portrait',
    margin = [10, 10, 10, 10],
    quality = 2
  } = options;

  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const opt = {
    margin,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: quality,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'mm', 
      format, 
      orientation 
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadTicketPDF = async (ticketId: string): Promise<void> => {
  return generatePDF('booking-ticket', {
    filename: `booking-ticket-${ticketId}.pdf`,
    margin: [5, 5, 5, 5],
    quality: 2
  });
};