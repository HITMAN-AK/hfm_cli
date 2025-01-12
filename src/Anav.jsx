import React, { useState } from "react";
import "./css/anav.css";

function Anav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <a href="/admindashboard">Dashboard</a>
          </li>
          <li>
            <a href="/managepatient">Manage Patient</a>
          </li>
          <li>
            <a href="/managepantry">Manage Pantry</a>
          </li>
          <li>
            <a href="/dietchart">Diet Charts</a>
          </li>
        </ul>
      </div>
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default Anav;
