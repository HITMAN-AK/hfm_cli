import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/adelivery.css";

function Adelivery() {
  const [combinedData, setCombinedData] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealPlan, setSelectedMealPlan] = useState(null); 
  const [selectedMealType, setSelectedMealType] = useState(""); 

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getCombinedData/${username}`
        );
        setCombinedData(response.data.combinedData);
      } catch (err) {
        console.error("Error fetching combined data:", err);
      }
    };
    fetchCombinedData();
  }, []);

  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getDeliveryPersons`
        );
        setDeliveryPersons(response.data);
      } catch (err) {
        console.error("Error fetching delivery persons:", err);
      }
    };
    fetchDeliveryPersons();
  }, []);

  const assignDeliveryPerson = async (deliveryPersonId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/assignDeliveryPerson`, {
        mealPlanId: selectedMealPlan,
        mealType: selectedMealType,
        deliveryPersonId,
        mealStatus: selectedMealType,
      });

      setCombinedData((prevData) =>
        prevData.map((data) =>
          data.mealPlan._id === selectedMealPlan
            ? {
                ...data,
                mealPlan: {
                  ...data.mealPlan,
                  dstatus: [...data.mealPlan.dstatus, selectedMealType],
                },
              }
            : data
        )
      );

      setSelectedMealPlan(null);
      setSelectedMealType("");
    } catch (err) {
      console.error("Error assigning delivery person:", err);
    }
  };

  const filteredDeliveryPersons = deliveryPersons.filter((dp) =>
    dp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Meal Delivery Assignment</h1>
      <div className="adelivery-meal-assignment-container">
        <div className="adelivery-meal-list">
          {combinedData.map(({ patientDetail, mealPlan }) => {
            if (!patientDetail || !mealPlan) return null;

            const preparedMeals = [];
            if (mealPlan.mps) preparedMeals.push("Morning");
            if (mealPlan.eps) preparedMeals.push("Evening");
            if (mealPlan.nps) preparedMeals.push("Night");

            if (preparedMeals.length === 0) return null;

            return (
              <div key={mealPlan._id} className="adelivery-meal-card">
                <h2>{patientDetail.patientName}</h2>
                <p>Diseases: {patientDetail.diseases}</p>
                <p>Allergies: {patientDetail.allergies}</p>
                <p>
                  Room: {patientDetail.roomNumber}, Bed: {patientDetail.bedNumber}, Floor:{" "}
                  {patientDetail.floorNumber}
                </p>
                <p>Age: {patientDetail.age}, Gender: {patientDetail.gender}</p>
                <p>Address: {patientDetail.address}</p>
                <p>Emergency Contact: {patientDetail.emergencyContact}</p>

                <div>
                  <h3>Prepared Meals:</h3>
                  {preparedMeals.map((mealType) => (
                    <div key={mealType} className="adelivery-meal">
                      <p>{mealType} Meal</p>
                      {mealPlan.dstatus.includes(mealType) ? (
                        <p>Already Assigned</p>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedMealPlan(mealPlan._id);
                            setSelectedMealType(mealType);
                          }}
                        >
                          Assign Delivery Person
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selectedMealPlan && (
          <div className="adelivery-delivery-person-container">
            <h3>
              Select Delivery Person for {selectedMealType} Meal
            </h3>
            <input
              type="text"
              placeholder="Search Delivery Persons"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="adelivery-delivery-person-list">
              {filteredDeliveryPersons.map((dp) => (
                <div key={dp._id} className="adelivery-delivery-person-card">
                  <p>Name: {dp.name}</p>
                  <p>Contact: {dp.contactinfo}</p>
                  <p>Location: {dp.location}</p>
                  <button
                    onClick={() => assignDeliveryPerson(dp._id)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Adelivery;
