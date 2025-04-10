import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportCourriersPDF = (courriers, type) => {
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(14);
  doc.text(
    `Liste des courriers (${type === 'depart' ? 'Départ' : 'Arrivée'})`,
    105,
    10,
    { align: 'center' }
  );

  // En-têtes
  const headers =
    type === 'depart'
      ? ['Numéro', 'Date', 'Destinataire', 'Objet', 'Pièces jointes']
      : ['Numéro', 'Date', 'Expéditeur', 'Objet', 'Référence', 'Destinataire'];

  // Lignes
  const rows = courriers.map((courrier) => {
    if (type === 'depart') {
      return [
        courrier.numero || '',
        new Date(courrier.date).toLocaleDateString() || '',
        courrier.destinataire || '',
        courrier.objet || '',
        Array.isArray(courrier.piecesJointes)
          ? courrier.piecesJointes.join(', ')
          : 'Aucune',
      ];
    } else {
      return [
        courrier.numero || '',
        new Date(courrier.date).toLocaleDateString() || '',
        courrier.expediteur || '',
        courrier.objet || '',
        courrier.reference || '',
        courrier.destinataire || '',
      ];
    }
  });

  // Génération du tableau
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: {
      fillColor: [39, 174, 96], // Vert
      textColor: 255,
      halign: 'center',
    },
    bodyStyles: {
      halign: 'left',
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { cellWidth: 40 },
      3: { cellWidth: 50 },
      4: { cellWidth: 40 },
      5: { cellWidth: 40 },
    },
  });

  // Export du fichier
  doc.save(`courriers_${type}.pdf`);
};

export default exportCourriersPDF;
