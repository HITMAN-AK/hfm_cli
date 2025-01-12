import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/td.css";

function MealPlanCard({ patientDetails, mealPlan }) {
  if (!patientDetails || !mealPlan) {
    return null;
  }
  const getMealPreparationStatus = (plan) => {
    const status = [];
    if (plan.includes("Morning") && mealPlan.mps) {
      status.push("Morning meal prepared");
    }
    if (plan.includes("Evening") && mealPlan.eps) {
      status.push("Evening meal prepared");
    }
    if (plan.includes("Night") && mealPlan.nps) {
      status.push("Night meal prepared");
    }
    return status.length > 0 ? status.join(", ") : "No meals prepared yet";
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{patientDetails.patientName}</h4>
        <p>Diseases: {patientDetails.diseases}</p>
        <p>Allergies: {patientDetails.allergies}</p>
      </div>
      <div className="card-body">
        <h5>
          Room: {patientDetails.roomNumber} | Bed: {patientDetails.bedNumber}
        </h5>
        <p>
          Age: {patientDetails.age} | Gender: {patientDetails.gender}
        </p>
        <p>Emergency Contact: {patientDetails.emergencyContact}</p>

        <h6>Meal Plan</h6>
        <ul>
          {mealPlan.plan.map((item, index) => (
            <li key={index}>
              {item}: {getMealPreparationStatus([item])}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Tp() {
  const [mealData, setMealData] = useState([]);
  const [filter, setFilter] = useState({
    morning: true,
    evening: true,
    night: true,
  });

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/gm`);
        setMealData(response.data);
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    fetchMealData();
  }, []);

  const filteredMealData = mealData.filter((data) => {
    if (!data.patientDetails || !data.mealPlan) return false;
    const { plan } = data.mealPlan;
    return (
      (filter.morning && plan.includes("Morning")) ||
      (filter.evening && plan.includes("Evening")) ||
      (filter.night && plan.includes("Night"))
    );
  });

  const handleCheckboxChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div>
      <div className="filter-checkboxes">
        <label>
          <input
            type="checkbox"
            name="morning"
            checked={filter.morning}
            onChange={handleCheckboxChange}
          />
          Morning Preparation
        </label>
        <label>
          <input
            type="checkbox"
            name="evening"
            checked={filter.evening}
            onChange={handleCheckboxChange}
          />
          Evening Preparation
        </label>
        <label>
          <input
            type="checkbox"
            name="night"
            checked={filter.night}
            onChange={handleCheckboxChange}
          />
          Night Preparation
        </label>
      </div>
      {filteredMealData.length > 0 ? (
        filteredMealData.map((data, index) => (
          data.patientDetails && data.mealPlan ? (
            <MealPlanCard
              key={index}
              patientDetails={data.patientDetails}
              mealPlan={data.mealPlan}
            />
          ) : null
        ))
      ) : (
        <div className="no-data-message">No preparation available</div>
      )}
    </div>
  );
}

export default Tp;
