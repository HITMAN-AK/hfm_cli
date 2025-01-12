import React from "react";
import { Link } from "react-router-dom";
import "./css/adash.css";

function Adash() {
  return (
    <div className="adash-dashboard">
      <div className="adash-links-container">
        <Link to="/trackdelivery" className="adash-dashboard-link">
          Track all food deliveries
        </Link>
        <Link to="/assignpantry" className="adash-dashboard-link">
          Assign pantry for the diet charts
        </Link>
        <Link to="/trackpreparation" className="adash-dashboard-link">
          Track pantry performance
        </Link>
        <Link to="/alerts" className="adash-dashboard-link">
          Alerts for delayed deliveries or issues in preparation
        </Link>
      </div>
    </div>
  );
}

export default Adash;
