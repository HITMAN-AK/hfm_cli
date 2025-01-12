import React, { useEffect, useState } from "react";
import Patientcard from "./Patientcard";
import "./css/mpatient.css";
import axios from "axios";

function Mpatient() {
  const [patients, setPatients] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showForm, setShowForm] = useState(false); 
  const [formTitle, setFormTitle] = useState("Add New Patient"); 
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [newPatient, setNewPatient] = useState({
    patientName: "",
    diseases: "",
    allergies: "",
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    age: "",
    gender: "",
    address: "",
    emergencyContact: "",
    dietPlan:false
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/gp`);
        setPatients(res.data);
        console.log("Fetched patients:", res.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPatient = () => {
    setFormTitle("Add New Patient");
    setNewPatient({
      patientName: "",
      diseases: "",
      allergies: "",
      roomNumber: "",
      bedNumber: "",
      floorNumber: "",
      age: "",
      gender: "",
      address: "",
      emergencyContact: "",
    });
    setEditingPatientId(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient) => {
    setFormTitle(`Editing Patient: ${patient.patientName}`);
    setNewPatient(patient);
    setEditingPatientId(patient._id);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    try {
      if (editingPatientId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/update/${editingPatientId}`, newPatient);
        setPatients(
          patients.map((patient) =>
            patient._id === editingPatientId ? newPatient : patient
          )
        );
      } else {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/ap`, newPatient);
        setPatients([...patients, res.data]);
      }
      setShowForm(false);
      setEditingPatientId(null);
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mpatient-container">
      <div className="mpatient-header">
        <input
          type="text"
          placeholder="Search patient by name..."
          className="mpatient-search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="mpatient-add-button" onClick={handleAddPatient}>
          + Add Patient
        </button>
      </div>
      <div className="mpatient-card-scroll-container">
        {filteredPatients.map((patient, index) => (
          <Patientcard
            key={index}
            {...patient}
            onEdit={() => handleEditPatient(patient)}
          />
        ))}
      </div>
      {showForm && (
        <div className="mpatient-form-overlay">
          <form className="mpatient-patient-form" onSubmit={handleFormSubmit}>
            <h2>{formTitle}</h2>
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={newPatient.patientName}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="diseases"
              placeholder="Diseases"
              value={newPatient.diseases}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="allergies"
              placeholder="Allergies"
              value={newPatient.allergies}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="roomNumber"
              placeholder="Room Number"
              value={newPatient.roomNumber}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="bedNumber"
              placeholder="Bed Number"
              value={newPatient.bedNumber}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="floorNumber"
              placeholder="Floor Number"
              value={newPatient.floorNumber}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newPatient.age}
              onChange={handleFormChange}
            />
            <select
              name="gender"
              value={newPatient.gender}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              name="address"
              placeholder="Contact Information (Address)"
              value={newPatient.address}
              onChange={handleFormChange}
              required
            />
            <input
              type="number"
              name="emergencyContact"
              placeholder="Emergency Contact"
              value={newPatient.emergencyContact}
              onChange={handleFormChange}
              required
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Mpatient;
