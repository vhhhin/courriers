import React, { useState } from 'react';
import OutgoingMailManagement from './OutgoingMailManagement';

const CourriersDepart = () => {
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const handleOpenManagement = () => {
    setIsManagementOpen(true);
  };

  const handleCloseManagement = () => {
    setIsManagementOpen(false);
  };

  return (
    <div>
      <h1>Courriers Départ</h1>
      <button onClick={handleOpenManagement} className="btn btn-primary">
        Gérer les Courriers Départ
      </button>

      {isManagementOpen && (
        <OutgoingMailManagement
          isOpen={isManagementOpen}
          onClose={handleCloseManagement}
          language="fr"
        />
      )}
    </div>
  );
};

export default CourriersDepart;