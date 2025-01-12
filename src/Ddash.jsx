import React, { useState } from "react";
import axios from "axios";
import './css/ddash.css';

function Ddash() {
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [day, setDay] = useState("");

  const fetchDeliveryDetails = async (timeOfDay) => {
    setLoading(true);
    setError("");
    setDay(timeOfDay);

    try {
      const uname = await sessionStorage.getItem("username");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/${timeOfDay}-delivery/${uname}`);
      setDeliveryDetails(response.data);
    } catch (err) {
      setError("Failed to fetch delivery details.");
    } finally {
      setLoading(false);
    }
  };

  const updateMealStatus = async (mealplanId, timeOfDay, status) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/update-status/${mealplanId}/${timeOfDay}`, { status });
      fetchDeliveryDetails(timeOfDay);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const renderCard = (delivery) => {
    const { patientDetails, mealPlanDetails } = delivery;
    return (
      <div className="ddash-card" key={patientDetails._id}>
        <h3>Patient: {patientDetails.patientName}</h3>
        <p>Room: {patientDetails.roomNumber}</p>
        <p>Bed: {patientDetails.bedNumber}</p>
        <p>Floor: {patientDetails.floorNumber}</p>
        <h4>Meal Details:</h4>
        <p>{mealPlanDetails}</p>

        {!delivery.status && (
          <>
            <button className="ddash-status-btn" onClick={() => updateMealStatus(patientDetails._id, day, true)}>
              Delivered
            </button>
            <button className="ddash-status-btn" onClick={() => updateMealStatus(patientDetails._id, day, false)}>
              Issue
            </button>
          </>
        )}

        {delivery.status && <p>Meal Delivered</p>}
      </div>
    );
  };

  return (
    <div className="ddash-container">
      <div className="ddash-buttons-container">
        <button className="ddash-time-btn" onClick={() => fetchDeliveryDetails("morning")}>Morning Delivery</button>
        <button className="ddash-time-btn" onClick={() => fetchDeliveryDetails("evening")}>Evening Delivery</button>
        <button className="ddash-time-btn" onClick={() => fetchDeliveryDetails("night")}>Night Delivery</button>
      </div>

      {loading && <p className="ddash-loading-text">Loading...</p>}
      {error && <p className="ddash-error-text">{error}</p>}

      {deliveryDetails.length === 0 ? (
        <p className="ddash-no-orders-text">You have no orders, first the pantry manager needs to assign delivery to you.</p>
      ) : (
        <div className="ddash-delivery-cards">
          {deliveryDetails.map((delivery) => renderCard(delivery))}
        </div>
      )}
    </div>
  );
}

export default Ddash;
