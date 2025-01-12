import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/mdelivery.css";

function Mdelivery() {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);

  const [formData, setFormData] = useState({
    uname: "",
    pass: "",
    name: "",
    contactinfo: "",
    location: "",
  });

  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/gdelivery`);
        setDeliveryPersons(res.data);
        console.log("Fetched delivery persons:", res.data);
      } catch (err) {
        console.error("Error fetching delivery persons:", err);
      }
    };
    fetchDeliveryPersons();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddDeliveryPerson = () => {
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

  const handleEditDeliveryPerson = (person) => {
    setFormData(person);
    setSelectedDeliveryPerson(person);
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
          `${process.env.REACT_APP_API_URL}/updateDeliveryPerson/${selectedDeliveryPerson._id}`,
          formData
        );
        setDeliveryPersons(
          deliveryPersons.map((person) =>
            person._id === selectedDeliveryPerson._id ? { ...formData } : person
          )
        );
      } else {
        // Add new delivery person
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/adelivery`, formData);
        setDeliveryPersons([...deliveryPersons, res.data]); // Add the new person to the list
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
      console.error("Error saving delivery person:", err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const filteredDeliveryPersons = deliveryPersons.filter((person) =>
    person.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mdelivery-container">
      <div className="mdelivery-header">
        <input
          type="text"
          placeholder="Search delivery person by name..."
          className="mdelivery-search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="mdelivery-add-button" onClick={handleAddDeliveryPerson}>
          + Add Delivery Person
        </button>
      </div>
      <div className="mdelivery-card-scroll-container">
        {filteredDeliveryPersons.map((person, index) => (
          <div key={index} className="mdelivery-person-card">
            <h3>{person.name}</h3>
            <p><b>Username:</b> {person.uname}</p>
            <p><b>Contact:</b> {person.contactinfo}</p>
            <p><b>Location:</b> {person.location}</p>
            <button
              className="mdelivery-edit-button"
              onClick={() => handleEditDeliveryPerson(person)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="mdelivery-form-overlay">
          <form className="mdelivery-person-form" onSubmit={handleFormSubmit}>
            <h2>{isEditing ? `Editing Delivery Person: ${formData.name}` : "Add New Delivery Person"}</h2>
            {error && <p className="mdelivery-error-message">{error}</p>}
            <input
              type="text"
              name="uname"
              placeholder="Username"
              value={formData.uname}
              onChange={handleFormChange}
              required
              disabled={isEditing} // Prevent editing username during update
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
              placeholder="Delivery Person Name"
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

export default Mdelivery;
