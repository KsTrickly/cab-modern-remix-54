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

  const opt: any = {
    margin,
    filename,
    image: { type: 'png', quality: 1 },
    html2canvas: {
      scale: Math.max(quality, (globalThis as any).devicePixelRatio || 1),
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      letterRendering: true
    },
    jsPDF: {
      unit: 'mm',
      format,
      orientation
    },
    pagebreak: { mode: ['avoid-all'] }
  };

  try {
    // Ensure fonts are loaded for accurate rendering
    try { await (document as any).fonts?.ready; } catch {}

    // Apply print-friendly class and temporarily scale the ticket to guarantee a single A4 page
    (element as HTMLElement).classList.add('pdf-export');
    const pxPerMm = 96 / 25.4;
    const pageSize = { widthMm: orientation === 'landscape' ? 297 : 210, heightMm: orientation === 'landscape' ? 210 : 297 };
    const margins = Array.isArray(margin) ? margin : [margin, margin, margin, margin];
    const [mt, , mb] = [margins[0] ?? 0, margins[1] ?? 0, margins[2] ?? margins[0] ?? 0];
    const usableHeightPx = (pageSize.heightMm - (mt + mb)) * pxPerMm;

    const originalStyle = (element.getAttribute('style') || '').toString();

    const elementHeight = element.scrollHeight;
    const scaleNeeded = elementHeight > 0 ? Math.min(1, usableHeightPx / elementHeight) : 1;

    if (scaleNeeded < 1) {
      // Scale down and expand width inversely so layout remains consistent
      (element as HTMLElement).style.transformOrigin = 'top left';
      (element as HTMLElement).style.transform = `scale(${scaleNeeded})`;
      (element as HTMLElement).style.width = `calc(100% / ${scaleNeeded})`;
    }

    await (html2pdf as any)().set(opt).from(element).save();

    // Restore original styles
    if (originalStyle) {
      element.setAttribute('style', originalStyle);
    } else {
      element.removeAttribute('style');
    }
    (element as HTMLElement).classList.remove('pdf-export');
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