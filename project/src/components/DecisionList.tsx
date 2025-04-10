import React, { useState, useEffect } from 'react';
import decisionService, { Decision } from '../services/decisionService';
import { FileText, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import exportDecisionsPDF from '../utils/exportDecisionsPDF';

interface DecisionListProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'ar';
}

const customConfirm = (message: string) => {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dialog.style.zIndex = '1000';
    dialog.style.borderRadius = '8px';
    dialog.style.textAlign = 'center';

    const messageText = document.createElement('p');
    messageText.innerText = message;
    messageText.style.marginBottom = '20px';
    dialog.appendChild(messageText);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-around';

    const yesButton = document.createElement('button');
    yesButton.innerText = 'Oui';
    yesButton.style.padding = '10px 20px';
    yesButton.style.backgroundColor = '#007BFF';
    yesButton.style.color = '#fff';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '5px';
    yesButton.style.cursor = 'pointer';
    yesButton.onclick = () => {
      document.body.removeChild(dialog);
      resolve(true);
    };

    const noButton = document.createElement('button');
    noButton.innerText = 'Non';
    noButton.style.padding = '10px 20px';
    noButton.style.backgroundColor = '#ccc';
    noButton.style.color = '#000';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '5px';
    noButton.style.cursor = 'pointer';
    noButton.onclick = () => {
      document.body.removeChild(dialog);
      resolve(false);
    };

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
  });
};

export const DecisionList = ({ isOpen, onClose, language }: DecisionListProps) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDecisions(decisionService.getAll());
    }
  }, [isOpen]);

  const handleDelete = async (decisionId: string) => {
    const confirmation = await customConfirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا القرار؟' : 'Êtes-vous sûr de vouloir supprimer cette décision ?');
    if (confirmation) {
      try {
        decisionService.deleteById(decisionId);
        setDecisions(prev => prev.filter(d => d.id !== decisionId));
        toast.success(language === 'ar' ? 'تم حذف القرار بنجاح' : 'Décision supprimée avec succès');
      } catch (error) {
        toast.error(language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Erreur lors de la suppression');
      }
    }
  };

  const handleExportPDF = () => {
    exportDecisionsPDF(decisions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {decisions.map(decision => (
              <div key={decision.id} className="p-3 border rounded-lg hover:shadow-md dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-base text-gray-900 dark:text-white">{decision.subject}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span>N° {decision.number}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(decision.date).toLocaleDateString()}</span>
                    </div>
                    {decision.observation && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {decision.observation}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(decision.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title={language === 'ar' ? 'حذف' : 'Supprimer'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
