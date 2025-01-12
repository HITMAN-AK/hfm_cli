import React from "react";
import { Routes, Route } from "react-router-dom";
import Log from "./Log";
import Anav from "./Anav";
import Adash from "./Adash";
import Mpatient from "./Mpatient";
import Mpantry from "./Mpantry";
import Mdiet from "./Mdiet";
import Apantry from "./Apantry";
import Td from "./Td";
import Tp from "./Tp";
import Pnav from "./Pnav";
import Mdelivery from "./Mdelivery";
import Mpreparation from "./Mpreparation";
import Adelivery from "./Adelivery";
import Pdash from "./Pdash";
import Ddash from "./Ddash";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const role = sessionStorage.getItem("role");

  return (
    <>
      {/* Conditional Rendering of Navigation Bars */}
      {role === "admin" && <Anav />}
      {role === "pantry" && <Pnav />}

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Log />} />

        {/* Admin Routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Adash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managepatient"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Mpatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managepantry"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Mpantry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dietchart"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Mdiet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignpantry"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Apantry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trackdelivery"
          element={
            <ProtectedRoute allowedRoles={["admin", "pantry"]}>
              <Td />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trackpreparation"
          element={
            <ProtectedRoute allowedRoles={["admin", "pantry"]}>
              <Tp />
            </ProtectedRoute>
          }
        />

        {/* Pantry Routes */}
        <Route
          path="/managedelivery"
          element={
            <ProtectedRoute allowedRoles={["pantry"]}>
              <Mdelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managepreparation"
          element={
            <ProtectedRoute allowedRoles={["pantry"]}>
              <Mpreparation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assigndelivery"
          element={
            <ProtectedRoute allowedRoles={["pantry"]}>
              <Adelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pantrydashboard"
          element={
            <ProtectedRoute allowedRoles={["pantry"]}>
              <Pdash />
            </ProtectedRoute>
          }
        />

        {/* Delivery Routes */}
        <Route
          path="/deliverydashboard"
          element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <Ddash />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
