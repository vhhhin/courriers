import React, { useState, useEffect } from 'react';
import decisionService from '../services/decisionService';
import toast from 'react-hot-toast';

interface NewDecisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'ar';
  onSuccess?: () => void;
}

export const NewDecisionDialog = ({ isOpen, onClose, language, onSuccess }: NewDecisionDialogProps) => {
  const [newDecision, setNewDecision] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    observation: '',
    priority: 'normal' as const
  });
  const [nextNumber, setNextNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      const number = decisionService.getNextNumber();
      setNextNumber(number);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      decisionService.save({
        type: 'decision',
        number: nextNumber,
        date: new Date(newDecision.date),
        subject: newDecision.subject,
        description: '',
        reference: `${nextNumber}/${new Date().getFullYear()}`,
        status: 'pending',
        priority: newDecision.priority,
        observation: newDecision.observation,
        qrCode: '',
        history: [{
          date: new Date(),
          action: 'created',
          user: 'current-user'
        }],
        createdBy: 'current-user',
        createdAt: new Date(),
        updatedBy: 'current-user',
        updatedAt: new Date()
      });
      setNewDecision({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        observation: '',
        priority: 'normal'
      });
      toast.success(language === 'ar' ? 'تم حفظ القرار بنجاح' : 'Décision enregistrée avec succès');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Erreur lors de l\'enregistrement');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-12 relative">
        <button
          onClick={onClose}
          className="absolute top-10 right-10 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          aria-label={language === 'ar' ? 'إغلاق' : 'Fermer'}
        >
          <span className="text-3xl">×</span>
        </button>
        
        <div className="flex items-center justify-center mb-12">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-40 w-40 mr-12"
          />
          <div className="text-center border-b-2 border-blue-600 pb-5">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
              {language === 'ar' ? 'المجلس الإقليمي لسخيرات-تمارة - مكتب الضبط' : 'Le Conseil Préfectoral de Skhirat-Témara - Bureau d\'Ordre'}
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              {language === 'ar' ? 'نظام إدارة المراسلات' : 'Système de Gestion des Courriers'}
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-semibold mb-12 text-center text-gray-700">
          {language === 'ar' ? 'قرار جديد' : 'Nouvelle Décision'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-medium mb-4 text-gray-700">
                {language === 'ar' ? 'الرقم' : 'Numéro'}
              </label>
              <input
                type="text"
                value={nextNumber}
                disabled
                className="w-full px-5 py-4 border rounded bg-gray-50 text-lg"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-4 text-gray-700">
                {language === 'ar' ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                value={newDecision.date}
                onChange={e => setNewDecision(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-5 py-4 border rounded text-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-medium mb-4 text-gray-700">
                {language === 'ar' ? 'الموضوع' : 'Objet'}
              </label>
              <input
                type="text"
                value={newDecision.subject}
                onChange={e => setNewDecision(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-5 py-4 border rounded text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-4 text-gray-700">
                {language === 'ar' ? 'ملاحظة' : 'Observation'}
              </label>
              <textarea
                value={newDecision.observation}
                onChange={e => setNewDecision(prev => ({ ...prev, observation: e.target.value }))}
                className="w-full px-5 py-4 border rounded text-lg"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-8 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-4 text-gray-600 hover:bg-gray-100 rounded text-lg"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-10 py-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg"
            >
              {language === 'ar' ? 'حفظ' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
