import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/td.css";

function MealPlanCard({ patientDetails, mealPlan }) {
  if (!patientDetails || !mealPlan) {
    return null;
  }
  const getMealStatus = (plan) => {
    const status = [];
    if (plan.includes("Morning") && mealPlan.mds) {
      status.push("Morning meal delivered");
    }
    if (plan.includes("Evening") && mealPlan.eds) {
      status.push("Evening meal delivered");
    }
    if (plan.includes("Night") && mealPlan.nds) {
      status.push("Night meal delivered");
    }
    return status.length > 0 ? status.join(", ") : "No meals delivered yet";
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{patientDetails.patientName}</h4>
        <p>Diseases : {patientDetails.diseases} </p>
        <p>Allergies : {patientDetails.allergies}</p>
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
              {item}: {getMealStatus([item])}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Td() {
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
          Morning Delivery
        </label>
        <label>
          <input
            type="checkbox"
            name="evening"
            checked={filter.evening}
            onChange={handleCheckboxChange}
          />
          Evening Delivery
        </label>
        <label>
          <input
            type="checkbox"
            name="night"
            checked={filter.night}
            onChange={handleCheckboxChange}
          />
          Night Delivery
        </label>
      </div>

      {filteredMealData.length > 0 ? (
        filteredMealData.map((data, index) =>
          data.patientDetails && data.mealPlan ? (
            <MealPlanCard
              key={index}
              patientDetails={data.patientDetails}
              mealPlan={data.mealPlan}
            />
          ) : null
        )
      ) : (
        <div className="no-delivery">No delivery available</div>
      )}
    </div>
  );
}

export default Td;
