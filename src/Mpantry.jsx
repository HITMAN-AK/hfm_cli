import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/mpantry.css";

function Mpantry() {
  const [pantries, setPantries] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showForm, setShowForm] = useState(false); 
  const [error, setError] = useState(""); 
  const [isEditing, setIsEditing] = useState(false); 
  const [selectedPantry, setSelectedPantry] = useState(null); 

  const [formData, setFormData] = useState({
    uname: "",
    pass: "",
    name: "",
    contactinfo: "",
    location: "",
  });

  useEffect(() => {
    const fetchPantries = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/gpantry`);
        setPantries(res.data); 
        console.log("Fetched pantries:", res.data);
      } catch (err) {
        console.error("Error fetching pantries:", err);
      }
    };
    fetchPantries();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPantry = () => {
    setFormData({
      uname: "",
      pass: "",
      name: "",
      contactinfo: "",
      location: "",
    });
    setShowForm(true);
    setIsEditing(false);
    setError("");
  };

  const handleEditPantry = (pantry) => {
    setFormData(pantry);
    setSelectedPantry(pantry);
    setShowForm(true);
    setIsEditing(true);
    setError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/updatePantry/${selectedPantry._id}`,
          formData
        );
        setPantries(
          pantries.map((p) =>
            p._id === selectedPantry._id ? { ...formData } : p
          )
        );
      } else {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/apantry`, formData);
        setPantries([...pantries, res.data]); // Add the new pantry to the list
      }
      setShowForm(false);
      setFormData({
        uname: "",
        pass: "",
        name: "",
        contactinfo: "",
        location: "",
      });
    } catch (err) {
      console.error("Error saving pantry:", err);
      // Handle error for username duplication
      if (err.response?.data?.message === "Username already exists. Please choose a unique one.") {
        setError("Username already exists. Please choose a unique one.");
      } else {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
  };

  const filteredPantries = pantries.filter((pantry) =>
    pantry.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mpantry-container">
      <div className="mpantry-header">
        <input
          type="text"
          placeholder="Search pantry by name..."
          className="mpantry-search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="mpantry-add-button" onClick={handleAddPantry}>
          + Add Pantry
        </button>
      </div>
      <div className="mpantry-card-scroll-container">
        {filteredPantries.map((pantry, index) => (
          <div key={index} className="mpantry-card">
            <h3>{pantry.name}</h3>
            <p><b>Username:</b> {pantry.uname}</p>
            <p><b>Contact:</b> {pantry.contactinfo}</p>
            <p><b>Location:</b> {pantry.location}</p>
            <button
              className="mpantry-edit-button"
              onClick={() => handleEditPantry(pantry)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="mpantry-form-overlay">
          <form className="mpantry-form" onSubmit={handleFormSubmit}>
            <h2>{isEditing ? `Editing Pantry: ${formData.name}` : "Add New Pantry"}</h2>
            {error && <p className="mpantry-error-message">{error}</p>}
            <input
              type="text"
              name="uname"
              placeholder="Username"
              value={formData.uname}
              onChange={handleFormChange}
              required
              disabled={isEditing} 
            />
            <input
              type="password"
              name="pass"
              placeholder="Password"
              value={formData.pass}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Pantry Name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="contactinfo"
              placeholder="Contact Information"
              value={formData.contactinfo}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleFormChange}
              required
            />
            <button type="submit">{isEditing ? "Update" : "Submit"}</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Mpantry;
