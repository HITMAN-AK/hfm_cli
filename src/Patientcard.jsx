import React from "react";
import "./css/patientcard.css";

function Patientcard({
  patientName,
  diseases,
  allergies,
  roomNumber,
  bedNumber,
  floorNumber,
  age,
  gender,
  address,
  emergencyContact,
  onEdit,
}) {
  return (
    <div className="patient-card-container">
      <h2 className="patient-card-title">{patientName}</h2>
      <div className="patient-card-details">
        <p>
          <strong>Diseases:</strong> {diseases}
        </p>
        <p>
          <strong>Allergies:</strong> {allergies}
        </p>
        <p>
          <strong>Room Number:</strong> {roomNumber}
        </p>
        <p>
          <strong>Bed Number:</strong> {bedNumber}
        </p>
        <p>
          <strong>Floor Number:</strong> {floorNumber}
        </p>
        <p>
          <strong>Age:</strong> {age}
        </p>
        <p>
          <strong>Gender:</strong> {gender}
        </p>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Emergency Contact:</strong> {emergencyContact}
        </p>
      </div>
      <button className="patient-card-edit-button" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

export default Patientcard;
