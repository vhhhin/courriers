import React, { useState, useEffect } from 'react';
import decisionService, { Decision } from '../services/decisionService';
import toast from 'react-hot-toast';
import { FileText, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import exportCourriersPDF from '../utils/exportCourriersPDF';
import exportDecisionsPDF from '../utils/exportDecisionsPDF';

interface DecisionManagementProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'ar';
}

export const DecisionManagement = ({ isOpen, onClose, language }: DecisionManagementProps) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [newDecision, setNewDecision] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    observation: '',
    status: 'pending' as const
  });

  useEffect(() => {
    if (isOpen) {
      setDecisions(decisionService.getAll());
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const decisionToSave = {
        ...newDecision,
        date: new Date(newDecision.date),
      };

      decisionService.save(decisionToSave);
      
      toast.success('Décision enregistrée avec succès');
      
      // Réinitialiser le formulaire
      setNewDecision({
        number: '',
        date: new Date().toISOString().split('T')[0],
        subject: '',
        observation: '',
        status: 'pending'
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur détaillée:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = (decisionId: string) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette décision ?');
    if (confirmation) {
      try {
        decisionService.deleteById(decisionId);
        setDecisions(prev => prev.filter(d => d.id !== decisionId));
        toast.success('Décision supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const exportToPDF = (decision: Decision) => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.text("Décision", 105, 20, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.text(`Numéro: ${decision.number}`, 20, 40);
    doc.text(`Date: ${new Date(decision.date).toLocaleDateString()}`, 20, 50);
    doc.text(`Objet: ${decision.subject}`, 20, 60);
    
    if (decision.observation) {
      doc.text(`Observation:`, 20, 80);
      doc.text(doc.splitTextToSize(decision.observation, 170), 20, 90);
    }

    doc.save(`decision-${decision.number}.pdf`);
  };

  const handleExportPDF = () => {
    exportDecisionsPDF(decisions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {language === 'ar' ? 'القرارات' : 'Décisions'}
          </h2>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <FileText size={18} className="mr-2" />
            Exporter en PDF
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro
              </label>
              <input
                type="text"
                value={newDecision.number}
                onChange={e => setNewDecision(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newDecision.date}
                onChange={e => setNewDecision(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objet
            </label>
            <input
              type="text"
              value={newDecision.subject}
              onChange={e => setNewDecision(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observation
            </label>
            <textarea
              value={newDecision.observation}
              onChange={e => setNewDecision(prev => ({ ...prev, observation: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Décisions récentes</h3>
          <div className="space-y-2">
            {decisions.map(decision => (
              <div key={decision.id} className="p-4 border rounded flex justify-between items-start">
                <div>
                  <div className="font-medium">{decision.subject}</div>
                  <div className="text-sm text-gray-600">N° {decision.number}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(decision.date).toLocaleDateString()}
                  </div>
                  {decision.observation && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      Note: {decision.observation}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToPDF(decision)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Exporter en PDF"
                  >
                    <FileText size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(decision.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
