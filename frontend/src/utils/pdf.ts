import jsPDF from 'jspdf';

type GeneratePdf = {
    title: string;
    generatePdfCallback: (doc: jsPDF) => void;
};

export const generatePdf = ({ title, generatePdfCallback }: GeneratePdf) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 105, 20, { align: 'center' });

    // Execute the callback to add custom content
    generatePdfCallback(doc);

    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/ /g, '_')}.pdf`);
};
