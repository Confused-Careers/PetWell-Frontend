// Professional PDF Service
import jsPDF from 'jspdf';

interface VaccineData {
  id: string;
  vaccine_name: string;
  date_administered?: string;
  administered_date?: string;
  administered?: string;
  date_due?: string;
  expiry_date?: string;
  expires?: string;
  soon?: boolean;
  warning?: string;
}

interface PetData {
  id: string;
  pet_name: string;
  age?: number;
  breed_species_id?: string;
  breed_id?: string;
}

// Helper function to add a modern header
const addModernHeader = (doc: jsPDF, petName: string, isDetailed: boolean = false) => {
  // Background rectangle for header
  doc.setFillColor(28, 35, 46); // Dark blue background
  doc.rect(0, 0, 210, 40, 'F');
  
  // PetWell logo text (simulated)
  doc.setFontSize(28);
  doc.setTextColor(255, 178, 62); // Orange color
  doc.setFont('helvetica', 'bold');
  doc.text('PetWell', 20, 25);
  
  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(235, 213, 189); // Light beige
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Pet Care Records', 20, 35);
  
  // Document title
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  const title = isDetailed ? 'Detailed Vaccine Records' : 'Vaccine Records Summary';
  doc.text(title, 20, 50);
  
  // Pet name with modern styling
  doc.setFontSize(16);
  doc.setTextColor(255, 178, 62);
  doc.text(`${petName}'s Records`, 20, 65);
  
  // Decorative line
  doc.setDrawColor(255, 178, 62);
  doc.setLineWidth(0.5);
  doc.line(20, 70, 190, 70);
};

// Helper function to add pet information section
const addPetInfoSection = (doc: jsPDF, pet: PetData, yStart: number) => {
  let yPos = yStart;
  
  // Section header
  doc.setFontSize(14);
  doc.setTextColor(28, 35, 46);
  doc.setFont('helvetica', 'bold');
  doc.text('Pet Information', 20, yPos);
  
  yPos += 15;
  
  // Info box background
  doc.setFillColor(248, 250, 252);
  doc.rect(20, yPos - 5, 170, 35, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, yPos - 5, 170, 35, 'S');
  
  // Pet details
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Name: ${pet.pet_name}`, 25, yPos + 5);
  if (pet.age) {
    doc.text(`Age: ${pet.age} years`, 25, yPos + 15);
  }
  if (pet.breed_species_id) {
    doc.text(`Species: ${pet.breed_species_id}`, 100, yPos + 5);
  }
  if (pet.breed_id) {
    doc.text(`Breed: ${pet.breed_id}`, 100, yPos + 15);
  }
  
  return yPos + 45;
};

// Helper function to add modern table
const addModernTable = (doc: jsPDF, selectedVaccines: VaccineData[], yStart: number) => {
  let yPos = yStart;
  
  // Section header
  doc.setFontSize(14);
  doc.setTextColor(28, 35, 46);
  doc.setFont('helvetica', 'bold');
  doc.text('Vaccine Records', 20, yPos);
  
  yPos += 15;
  
  // Table header background
  doc.setFillColor(255, 178, 62);
  doc.rect(20, yPos - 5, 170, 12, 'F');
  
  // Table header text
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Vaccine Name', 25, yPos + 2);
  doc.text('Administered', 85, yPos + 2);
  doc.text('Expires', 125, yPos + 2);
  doc.text('Status', 155, yPos + 2);
  
  yPos += 12;
  
  // Table rows
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  selectedVaccines.forEach((vaccine, index) => {
    // Check if we need a new page (accounting for footer space)
    if (yPos > 240) {
      doc.addPage();
      addModernHeader(doc, 'Pet', true);
      yPos = 90;
    }
    
    // Row background (alternating colors)
    const bgColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(20, yPos - 3, 170, 10, 'F');
    
    // Row border
    doc.setDrawColor(226, 232, 240);
    doc.line(20, yPos + 7, 190, yPos + 7);
    
    // Row content
    doc.setTextColor(71, 85, 105);
    doc.text(vaccine.vaccine_name || 'Unknown Vaccine', 25, yPos + 2);
    doc.text(vaccine.date_administered || vaccine.administered_date || vaccine.administered || 'Unknown', 85, yPos + 2);
    doc.text(vaccine.date_due || vaccine.expiry_date || vaccine.expires || 'Unknown', 125, yPos + 2);
    
    // Status with color coding
    if (vaccine.soon) {
      doc.setTextColor(239, 68, 68); // Red for expiring soon
      doc.text('⚠️ Expiring', 155, yPos + 2);
    } else {
      doc.setTextColor(34, 197, 94); // Green for valid
      doc.text('✅ Valid', 155, yPos + 2);
    }
    
    yPos += 10;
  });
  
  return yPos + 10;
};

// Helper function to add detailed vaccine information
const addDetailedVaccineInfo = (doc: jsPDF, selectedVaccines: VaccineData[], yStart: number) => {
  let yPos = yStart;
  
  // Section header
  doc.setFontSize(14);
  doc.setTextColor(28, 35, 46);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Vaccine Information', 20, yPos);
  
  yPos += 15;
  
  selectedVaccines.forEach((vaccine, index) => {
    // Check if we need a new page (accounting for footer space)
    if (yPos > 230) {
      doc.addPage();
      addModernHeader(doc, 'Pet', true);
      yPos = 90;
    }
    
    // Vaccine card background
    doc.setFillColor(248, 250, 252);
    doc.rect(20, yPos - 5, 170, 45, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, yPos - 5, 170, 45, 'S');
    
    // Vaccine name
    doc.setFontSize(12);
    doc.setTextColor(28, 35, 46);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${vaccine.vaccine_name || 'Unknown Vaccine'}`, 25, yPos + 5);
    
    // Vaccine details
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    
    const adminDate = vaccine.date_administered || vaccine.administered_date || vaccine.administered;
    const expiryDate = vaccine.date_due || vaccine.expiry_date || vaccine.expires;
    
    doc.text(`Administered: ${adminDate || 'Unknown'}`, 25, yPos + 15);
    doc.text(`Expires: ${expiryDate || 'Unknown'}`, 25, yPos + 25);
    
    // Status indicator
    if (vaccine.soon) {
      doc.setTextColor(239, 68, 68);
      doc.text('⚠️ Expiring Soon', 100, yPos + 15);
    } else {
      doc.setTextColor(34, 197, 94);
      doc.text('✅ Valid', 100, yPos + 15);
    }
    
    if (vaccine.warning) {
      doc.setTextColor(245, 158, 11);
      doc.text(`Note: ${vaccine.warning}`, 25, yPos + 35);
    }
    
    yPos += 55;
  });
  
  return yPos + 10;
};

// Helper function to add modern footer
const addModernFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background - moved higher to avoid being cut off
    doc.setFillColor(28, 35, 46);
    doc.rect(0, 270, 210, 25, 'F');
    
    // Footer text - adjusted positioning
    doc.setFontSize(8);
    doc.setTextColor(235, 213, 189);
    doc.setFont('helvetica', 'normal');
    
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Generated on ${currentDate}`, 20, 280);
    doc.text(`Page ${i} of ${pageCount}`, 150, 280);
    
    // PetWell branding
    doc.setTextColor(255, 178, 62);
    doc.setFont('helvetica', 'bold');
    doc.text('PetWell', 20, 288);
    doc.setTextColor(235, 213, 189);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Pet Care Management', 50, 288);
  }
};

// Generate summary PDF
export const generateVaccinePDF = (
  vaccines: VaccineData[],
  pet: PetData,
  selectedVaccines: VaccineData[]
) => {
  const doc = new jsPDF();
  
  // Add header
  addModernHeader(doc, pet.pet_name, false);
  
  // Add pet information
  let yPos = addPetInfoSection(doc, pet, 85);
  
  // Add vaccine table
  yPos = addModernTable(doc, selectedVaccines, yPos);
  
  // Add footer
  addModernFooter(doc);
  
  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${pet.pet_name}_Vaccine_Summary_${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
  
  return filename;
};

// Generate detailed PDF
export const generateDetailedVaccinePDF = (
  vaccines: VaccineData[],
  pet: PetData,
  selectedVaccines: VaccineData[]
) => {
  const doc = new jsPDF();
  
  // Add header
  addModernHeader(doc, pet.pet_name, true);
  
  // Add pet information
  let yPos = addPetInfoSection(doc, pet, 85);
  
  // Add detailed vaccine information
  yPos = addDetailedVaccineInfo(doc, selectedVaccines, yPos);
  
  // Add footer
  addModernFooter(doc);
  
  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${pet.pet_name}_Detailed_Vaccine_Records_${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
  
  return filename;
};