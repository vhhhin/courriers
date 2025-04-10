import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportCourriersArrivesPDF = (courriers) => {
  const doc = new jsPDF({ orientation: 'landscape' });

  const headers = ['Numéro', 'Date', 'Expéditeur', 'Objet', 'Référence', 'Destinataire'];

  const rows = courriers.map(courrier => [
    courrier.number || '',
    new Date(courrier.date).toLocaleDateString() || '',
    courrier.sender || '',
    courrier.subject || '',
    courrier.reference || '',
    courrier.recipient || ''
  ]);

  doc.text('Liste des Courriers Arrivés', 148, 10, { align: 'center' });
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    styles: { fontSize: 9, cellPadding: 2 },
    margin: { left: 10, right: 10 },
    tableWidth: 'auto',
  });

  doc.save('courriers-arrives.pdf');
};

export default exportCourriersArrivesPDF;