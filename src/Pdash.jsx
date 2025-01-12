import React from 'react';
import './css/pdash.css'; 

function Pdash() {
  return (
    <div className="pdash-main-container">
      <div className="pdash-links-container">
        <a href="/trackdelivery" className="pdash-link">
          Track All Food Deliveries
        </a>
        <a href="/trackpreparation" className="pdash-link">
          Track Pantry Performance
        </a>
      </div>
    </div>
  );
}

export default Pdash;
