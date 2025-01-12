import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/mpreparation.css";

function Mpreparation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uname = await sessionStorage.getItem("username");
        const username = uname;
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/getCombinedData/${username}`);
        setData(res.data.combinedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("FIRST ADMIN NEED TO ASSIGN DIET CHART TO THE PANTRY");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (uuid, mealType) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/updateMealStatus`, {
        uuid,
        mealType,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.mealPlan.uuid === uuid
            ? {
                ...item,
                mealPlan: {
                  ...item.mealPlan,
                  [`${mealType}`]: true,
                },
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="mpreparation-card-container">
      {data.map((item, index) => {
        const { patientDetail, mealPlan } = item;
        const { mdes, edes, ndes, mps, eps, nps, plan } = mealPlan;

        return (
          <div key={index} className="mpreparation-patient-card">
            <h3>{patientDetail.patientName}</h3>
            <p><b>Diseases:</b> {patientDetail.diseases}</p>
            <p><b>Allergies:</b> {patientDetail.allergies}</p>
            <p><b>Room:</b> {patientDetail.roomNumber}, <b>Bed:</b> {patientDetail.bedNumber}</p>
            <p><b>Floor:</b> {patientDetail.floorNumber}</p>
            <p><b>Age:</b> {patientDetail.age}, <b>Gender:</b> {patientDetail.gender}</p>
            <p><b>Address:</b> {patientDetail.address}</p>
            <p><b>Emergency Contact:</b> {patientDetail.emergencyContact}</p>

            <h4>Meal Plan:</h4>
            <div className="mpreparation-meal-section">
              {plan.includes("Morning") && (
                <div className="mpreparation-meal-item">
                  <h5>Morning</h5>
                  <p>{mdes || "No instructions provided"}</p>
                  {mps ? (
                    <span className="status-text">Prepared</span>
                  ) : (
                    <div className="button-group">
                      <button onClick={() => handleStatusUpdate(mealPlan.uuid, "mps")}>Prepare</button>
                      <button onClick={() => alert("Issue in preparing morning meal")}>Issue</button>
                    </div>
                  )}
                </div>
              )}
              {plan.includes("Evening") && (
                <div className="mpreparation-meal-item">
                  <h5>Evening</h5>
                  <p>{edes || "No instructions provided"}</p>
                  {eps ? (
                    <span className="status-text">Prepared</span>
                  ) : (
                    <div className="button-group">
                      <button onClick={() => handleStatusUpdate(mealPlan.uuid, "eps")}>Prepare</button>
                      <button onClick={() => alert("Issue in preparing evening meal")}>Issue</button>
                    </div>
                  )}
                </div>
              )}
              {plan.includes("Night") && (
                <div className="mpreparation-meal-item">
                  <h5>Night</h5>
                  <p>{ndes || "No instructions provided"}</p>
                  {nps ? (
                    <span className="status-text">Prepared</span>
                  ) : (
                    <div className="button-group">
                      <button onClick={() => handleStatusUpdate(mealPlan.uuid, "nps")}>Prepare</button>
                      <button onClick={() => alert("Issue in preparing night meal")}>Issue</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Mpreparation;
