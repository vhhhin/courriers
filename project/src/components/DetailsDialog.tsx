import React from 'react';

export const DetailsDialog = ({ isOpen, onClose, mail }) => {
  if (!isOpen || !mail) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Détails du Courrier</h2>
        <div className="space-y-2">
          <p><strong>Numéro:</strong> {mail.number}</p>
          <p><strong>Date:</strong> {new Date(mail.date).toLocaleDateString()}</p>
          <p><strong>Destinataire:</strong> {mail.destinataire}</p>
          <p><strong>Objet:</strong> {mail.subject}</p>
          {mail.piecesJointes && (
            <p><strong>Pièces Jointes:</strong> {mail.piecesJointes.join(', ')}</p>
          )}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};