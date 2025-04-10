import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportCourriersDepartPDF = (courriers) => {
  const doc = new jsPDF({ orientation: 'landscape' });

  const headers = ['Numéro', 'Date', 'Destinataire', 'Objet'];

  const rows = courriers.map(courrier => [
    courrier.numero || '',
    new Date(courrier.date).toLocaleDateString() || '',
    courrier.destinataire || '',
    courrier.objet || ''
  ]);

  doc.text('Liste des Courriers Départ', 148, 10, { align: 'center' });
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
    bodyStyles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 60 },
      3: { cellWidth: 80 },
    },
  });

  doc.save('courriers-depart.pdf');
};

export default exportCourriersDepartPDF;