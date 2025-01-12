import React, { useState } from "react";
import "./css/anav.css";

function Pnav() {
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
            <a href="/pantrydashboard">Dashboard</a>
          </li>
          <li>
            <a href="/managedelivery">Manage delivery personnel</a>
          </li>
          <li>
            <a href="/managepreparation">Preparation status</a>
          </li>
          <li>
            <a href="/assigndelivery">Assign delivey personnel</a>
          </li>
        </ul>
      </div>
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default Pnav;
