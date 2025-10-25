import type { Asset, User } from '../types';

interface CertificateData {
  asset: Asset;
  owner: User;
}

// Declare the global window properties for the libraries
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

/**
 * Diagnose library loading status
 */
const diagnoseLibraries = () => {
  console.log('=== PDF Library Diagnosis ===');
  console.log('window.html2canvas:', typeof window.html2canvas, window.html2canvas);
  console.log('window.jspdf:', typeof window.jspdf, window.jspdf);
  if (window.jspdf) {
    console.log('window.jspdf.jsPDF:', typeof window.jspdf.jsPDF, window.jspdf.jsPDF);
  }
  console.log('=============================');
};

/**
 * Enhanced library loading detection for jsPDF only
 */
const waitForLibraries = async (): Promise<{ jsPDF: any }> => {
  console.log('Starting jsPDF library detection...');
  
  // Try to load jsPDF library
  for (let attempt = 1; attempt <= 30; attempt++) {
    console.log(`jsPDF detection attempt ${attempt}/30`);
    
    // Check if jsPDF is available
    const jsPDFAvailable = typeof window.jspdf !== 'undefined' && 
                           window.jspdf !== null && 
                           typeof window.jspdf.jsPDF === 'function';
    
    if (jsPDFAvailable) {
      console.log('✓ jsPDF loaded successfully');
      return {
        jsPDF: window.jspdf.jsPDF
      };
    }
    
    // If this is the last attempt, provide detailed diagnostics
    if (attempt === 30) {
      console.error('❌ jsPDF loading failed after 30 attempts');
      console.error('jsPDF not available:', {
        jspdfType: typeof window.jspdf,
        jspdfValue: window.jspdf,
        jsPDFType: window.jspdf ? typeof window.jspdf.jsPDF : 'N/A',
        jsPDFValue: window.jspdf ? window.jspdf.jsPDF : 'N/A'
      });
      
      throw new Error('jsPDF library not loaded properly');
    }
    
    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  throw new Error('Unexpected error in jsPDF library loading');
};

/**
 * Downloads a PDF certificate for a digital asset using direct jsPDF text generation
 * @param data Certificate data including asset and owner information
 */
export const downloadCertificate = async (data: CertificateData) => {
  const { asset, owner } = data;
  
  try {
    // Wait for libraries to load
    console.log('Waiting for PDF libraries to load...');
    const { jsPDF } = await waitForLibraries();
    
    console.log('Creating PDF certificate directly with jsPDF...');
    
    // Create PDF with A4 format
    const pdf = new jsPDF({ 
      orientation: 'portrait', 
      unit: 'mm', 
      format: 'a4'
    });
    
    // Fill the entire page with white background
    pdf.setFillColor(255, 255, 255); // White background
    pdf.rect(0, 0, 210, 297, 'F'); // Fill entire page
    
    // Set up colors and fonts
    pdf.setDrawColor(10, 26, 47); // Dark blue border
    pdf.setLineWidth(2);
    
    // Draw border
    pdf.rect(10, 10, 190, 277, 'D');
    
    // Draw inner border
    pdf.setLineWidth(1);
    pdf.rect(15, 15, 180, 267, 'D');
    
    // Set text color to dark blue
    pdf.setTextColor(10, 26, 47);
    
    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    console.log('Adding title text...');
    pdf.text('Certificate of Ownership', 105, 40, { align: 'center' });
    console.log('Title text added');
    
    // Subtitle
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text('This certificate confirms the digital registration of the following asset', 105, 50, { align: 'center' });
    pdf.text('on the IPProtect platform.', 105, 56, { align: 'center' });
    
    // Draw decorative line
    pdf.setDrawColor(10, 26, 47);
    pdf.setLineWidth(1);
    pdf.line(30, 65, 180, 65);
    
    // Asset information section
    let yPosition = 80;
    
    // Asset Name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Asset Name:', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(asset.name, 25, yPosition + 8);
    yPosition += 25;
    
    // Registered To
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Registered To:', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(owner.name, 25, yPosition + 8);
    yPosition += 25;
    
    // Owner Email
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Owner Email:', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(owner.email, 25, yPosition + 8);
    yPosition += 25;
    
    // Registration Date
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Registration Date & Time:', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(new Date(asset.timestamp).toLocaleString(), 25, yPosition + 8);
    yPosition += 25;
    
    // Digital Fingerprint
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Unique Digital Fingerprint (SHA-256):', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    // Split hash into multiple lines
    const hashLines = pdf.splitTextToSize(asset.hash, 160);
    pdf.text(hashLines, 25, yPosition + 8);
    
    // Draw decorative line before footer
    yPosition += 15 + (hashLines.length * 5);
    pdf.setDrawColor(10, 26, 47);
    pdf.setLineWidth(1);
    pdf.line(30, yPosition, 180, yPosition);
    
    // Footer section
    yPosition += 20;
    
    // IPProtect branding
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Blockchain IP Protect', 105, yPosition, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Intellectual Property Protection Platform', 105, yPosition + 8, { align: 'center' });
    
    // Add blockchain and shield logo
    pdf.setFontSize(12);
    
    // Draw blockchain nodes
    const logoX = 170;
    const logoY = yPosition - 8;
    
    // Left side nodes
    pdf.setFillColor(148, 163, 184); // Silver gray
    pdf.setDrawColor(59, 130, 246); // Blue border
    pdf.rect(logoX, logoY, 3, 3, 'FD');
    pdf.rect(logoX, logoY + 4, 3, 3, 'FD');
    pdf.rect(logoX, logoY + 8, 3, 3, 'FD');
    
    // Right side nodes
    pdf.rect(logoX + 6, logoY + 2, 3, 3, 'FD');
    pdf.rect(logoX + 6, logoY + 6, 3, 3, 'FD');
    pdf.rect(logoX + 6, logoY + 10, 3, 3, 'FD');
    
    // Connection lines
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.5);
    pdf.line(logoX + 3, logoY + 1.5, logoX + 6, logoY + 3.5);
    pdf.line(logoX + 3, logoY + 5.5, logoX + 6, logoY + 7.5);
    pdf.line(logoX + 3, logoY + 9.5, logoX + 6, logoY + 11.5);
    
    // Shield
    pdf.setFillColor(59, 130, 246); // Blue shield
    pdf.setDrawColor(148, 163, 184); // Silver border
    pdf.setLineWidth(1);
    
    // Shield shape
    const shieldX = logoX + 12;
    const shieldY = logoY + 1;
    pdf.rect(shieldX, shieldY, 8, 10, 'FD');
    
    // Shield content lines
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.8);
    pdf.line(shieldX + 2, shieldY + 3, shieldX + 6, shieldY + 3);
    pdf.line(shieldX + 2, shieldY + 5, shieldX + 5, shieldY + 5);
    pdf.line(shieldX + 2, shieldY + 7, shieldX + 6, shieldY + 7);
    pdf.line(shieldX + 2, shieldY + 9, shieldX + 4, shieldY + 9);
    
    // Exclamation mark
    pdf.setFillColor(255, 255, 255);
    pdf.circle(shieldX + 3, shieldY + 2, 0.8, 'F');
    pdf.setLineWidth(0.8);
    pdf.line(shieldX + 3, shieldY + 3.5, shieldX + 3, shieldY + 4.5);
    
    // Save the PDF
    console.log('Saving PDF certificate...');
    pdf.save(`${asset.name.replace(/\s+/g, '_')}_certificate.pdf`);
    console.log('PDF certificate saved successfully!');
    
  } catch (error) {
    console.error('Error in PDF generation process:', error);
    throw new Error('PDF generation failed: ' + error.message);
  }
};

/**
 * Fallback function to generate a text certificate if PDF generation fails
 * @param data Certificate data including asset and owner information
 */
export const downloadTextCertificate = (data: CertificateData) => {
  const { asset, owner } = data;
  
  // Create a simple text-based certificate
  const certificateContent = `
IPProtect Digital Asset Certificate
===================================

Certificate of Ownership

This certificate confirms the digital registration of the following asset on the IPProtect platform.

Asset Name: ${asset.name}
Registered To: ${owner.name}
Owner Email: ${owner.email}
Registration Date & Time: ${new Date(asset.timestamp).toLocaleString()}
Unique Digital Fingerprint: ${asset.hash}

------------------------------------

Blockchain IP Protect — Intellectual Property Protection Platform
  `.trim();

  // Create and download text file as a simple fallback
  const blob = new Blob([certificateContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${asset.name.replace(/\s+/g, '_')}_certificate.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default {
  downloadCertificate,
  downloadTextCertificate
};