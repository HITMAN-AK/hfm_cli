import React, { useState, useEffect } from "react";
import "./css/apantry.css";
import axios from "axios";

function Apantry() {
  const [data, setData] = useState(null); 
  const [pantries, setPantries] = useState([]); 
  const [showAssignPantry, setShowAssignPantry] = useState(false); 
  const [selectedMealPlanId, setSelectedMealPlanId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/gm`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching meal plans and patient details:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPantries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/pantries`);
        setPantries(response.data); 
      } catch (error) {
        console.error("Error fetching pantry details:", error);
      }
    };
    fetchPantries();
  }, []);

  const renderPlans = (mealPlan) => {
    const { plan, mdes, edes, ndes } = mealPlan;

    return (
      <div className="apantry-meal-plan">
        {plan.includes("Morning") && (
          <p>
            <strong>Morning:</strong> {mdes || "No instructions provided"}
          </p>
        )}
        {plan.includes("Evening") && (
          <p>
            <strong>Evening:</strong> {edes || "No instructions provided"}
          </p>
        )}
        {plan.includes("Night") && (
          <p>
            <strong>Night:</strong> {ndes || "No instructions provided"}
          </p>
        )}
      </div>
    );
  };

  const handleAssignPantry = (mealPlanId) => {
    setSelectedMealPlanId(mealPlanId); 
    setShowAssignPantry(true); 
  };

  const handleSelectPantry = async (pantryId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/assign-pantry`, {
        mealPlanId: selectedMealPlanId,
        pantryId,
      });
      alert("Pantry assigned successfully!");
      setShowAssignPantry(false); 
      window.location.reload(false);
    } catch (error) {
      console.error("Error assigning pantry:", error);
    }
  };

  const filteredPantries = pantries.filter((pantry) =>
    pantry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!data) {
    return <div className="apantry-loading">Loading data...</div>;
  }

  const filteredMealPlans = data
    .filter(({ patientDetails, mealPlan }) => patientDetails && mealPlan) 
    .filter(({ mealPlan }) => mealPlan.status !== true); 

  return (
    <div className="apantry-main-container">
      <div className="apantry-card-scroll-container">
        {filteredMealPlans.length > 0 ? (
          filteredMealPlans.map(({ mealPlan, patientDetails }, index) => (
            <div key={index} className="apantry-pantry-card">
              <div className="apantry-patient-details">
                <h3>{patientDetails.patientName}</h3>
                <p><strong>Name:</strong> {patientDetails.patientName}</p>
                <p><strong>Diseases:</strong> {patientDetails.diseases}</p>
                <p><strong>Allergies:</strong> {patientDetails.allergies}</p>
                <p><strong>Room Number:</strong> {patientDetails.roomNumber}</p>
                <p><strong>Bed Number:</strong> {patientDetails.bedNumber}</p>
                <p><strong>Floor Number:</strong> {patientDetails.floorNumber}</p>
                <p><strong>Age:</strong> {patientDetails.age}</p>
                <p><strong>Gender:</strong> {patientDetails.gender}</p>
                <p><strong>Address:</strong> {patientDetails.address}</p>
                <p><strong>Emergency Contact:</strong> {patientDetails.emergencyContact}</p>
              </div>

              <div className="apantry-meal-plan-details">
                <h3>Meal Plan</h3>
                {renderPlans(mealPlan)}
              </div>

              <button
                className="apantry-assign-btn"
                onClick={() => handleAssignPantry(mealPlan._id)} 
              >
                Assign Pantry
              </button>
            </div>
          ))
        ) : (
          <div className="apantry-no-plans">First create a diet chart and then assign</div>
        )}
      </div>

      {showAssignPantry && (
        <div className="apantry-assign-container">
          <div className="apantry-assign-overlay">
            <input
              type="text"
              className="apantry-search-bar"
              placeholder="Search Pantry"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />

            <div className="apantry-pantry-list">
              {filteredPantries.length > 0 ? (
                filteredPantries.map((pantry, index) => (
                  <div key={index} className="apantry-list-card">
                    <h3>{pantry.name}</h3>
                    <p><strong>Contact Info:</strong> {pantry.contactinfo}</p>
                    <p><strong>Location:</strong> {pantry.location}</p>
                    <button
                      className="apantry-select-btn"
                      onClick={() => handleSelectPantry(pantry._id)} 
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <p>No pantries available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Apantry;
