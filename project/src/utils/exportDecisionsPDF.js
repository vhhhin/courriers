import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportDecisionsPDF = (decisions) => {
  const doc = new jsPDF();

  const headers = ['Numéro', 'Date', 'Objet', 'Observation'];

  const rows = decisions.map(decision => [
    decision.number || '',
    new Date(decision.date).toLocaleDateString() || '',
    decision.subject || '',
    decision.observation || ''
  ]);

  doc.text('Liste des Décisions', 105, 10, { align: 'center' });
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
    bodyStyles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 60 },
      3: { cellWidth: 60 },
    },
  });

  doc.save('decisions.pdf');
};

export default exportDecisionsPDF;