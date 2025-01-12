// Mdiet.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/mdiet.css";
import Dpatientcard from "./Dpatientcard";

function Mdiet() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/gp`);
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDietPlan = (patientId) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient._id === patientId ? { ...patient, dietPlan: true } : patient
      )
    );
  };

  return (
    <div className="mdiet-container">
      <div className="mdiet-header">
        <input
          type="text"
          placeholder="Search patient by name..."
          className="mdiet-search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="mdiet-card-scroll-container">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div key={patient._id} className="mdiet-patient-card-container">
              <Dpatientcard
                {...patient}
                patientId={patient._id}
                onCreateDietPlan={handleCreateDietPlan}
                dietPlan={patient.dietPlan}
              />
            </div>
          ))
        ) : (
          <p>No patients found</p>
        )}
      </div>
    </div>
  );
}

export default Mdiet;
