import React, { useState } from "react";
import "./css/dpatientcard.css";
import axios from "axios";

function Dpatientcard({
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
  dietPlan,
  patientId,
  onCreateDietPlan,
}) {
  const [showDietForm, setShowDietForm] = useState(false);
  const [dietPlanState, setDietPlanState] = useState({
    morningPlan: false,
    eveningPlan: false,
    nightPlan: false,
    morningInstruction: "",
    eveningInstruction: "",
    nightInstruction: "",
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDietPlanState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleInstructionChange = (e) => {
    const { name, value } = e.target;
    setDietPlanState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        uuid: patientId,
        plan: [],
        mdes: dietPlanState.morningInstruction,
        edes: dietPlanState.eveningInstruction,
        ndes: dietPlanState.nightInstruction,
      };

      if (dietPlanState.morningPlan) payload.plan.push("Morning");
      if (dietPlanState.eveningPlan) payload.plan.push("Evening");
      if (dietPlanState.nightPlan) payload.plan.push("Night");

      await axios.post(`${process.env.REACT_APP_API_URL}/dp`, payload);
      alert("Diet Plan Created Successfully");
      onCreateDietPlan(patientId);
      setShowDietForm(false);
    } catch (err) {
      console.error("Error creating diet plan:", err);
    }
  };

  return (
    <div className="patient-card">
      <h3 className="patient-name">{patientName}</h3>

      <div className="patient-details">
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

      {dietPlan ? (
        <p className="meal-plan-status">Meal Plan Created</p>
      ) : (
        <>
          {!showDietForm && (
            <button onClick={() => setShowDietForm(true)}>
              Create Diet Plan
            </button>
          )}

          {showDietForm && (
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="morningPlan"
                    checked={dietPlanState.morningPlan}
                    onChange={handleCheckboxChange}
                  />
                  Morning Plan
                </label>
                {dietPlanState.morningPlan && (
                  <textarea
                    name="morningInstruction"
                    value={dietPlanState.morningInstruction}
                    onChange={handleInstructionChange}
                    placeholder="How to cook?"
                  />
                )}
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    name="eveningPlan"
                    checked={dietPlanState.eveningPlan}
                    onChange={handleCheckboxChange}
                  />
                  Evening Plan
                </label>
                {dietPlanState.eveningPlan && (
                  <textarea
                    name="eveningInstruction"
                    value={dietPlanState.eveningInstruction}
                    onChange={handleInstructionChange}
                    placeholder="How to cook?"
                  />
                )}
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    name="nightPlan"
                    checked={dietPlanState.nightPlan}
                    onChange={handleCheckboxChange}
                  />
                  Night Plan
                </label>
                {dietPlanState.nightPlan && (
                  <textarea
                    name="nightInstruction"
                    value={dietPlanState.nightInstruction}
                    onChange={handleInstructionChange}
                    placeholder="How to cook?"
                  />
                )}
              </div>

              <button type="submit">Submit Diet Plan</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default Dpatientcard;
