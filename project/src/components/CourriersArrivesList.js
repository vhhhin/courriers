import React, { useState, useEffect } from 'react';
import { courierService } from '../services/courierService';

const CourriersArrives = () => {
  const [courriersArrives, setCourriersArrives] = useState([]);

  useEffect(() => {
    // Fetch courriers arrivés from the service
    const fetchedCourriers = courierService.getIncoming();
    setCourriersArrives(fetchedCourriers);
  }, []);

  return (
    <div>
      <h1>Courriers Arrivés</h1>
      <ul>
        {courriersArrives.map((courrier, index) => (
          <li key={index}>
            {courrier.numero} - {courrier.objet}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourriersArrives;