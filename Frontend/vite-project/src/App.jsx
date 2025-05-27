import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AdminDashboard from "./Pages/Dashboard";
import Login from "./Pages/Auth/Login";
import Hospital from "./Pages/Hospital/Hospital";
import Doctors from "./Pages/Doctors/Doctors";
import Patients from "./Pages/Patients";
import AddHospital from "./Pages/Hospital/AddHospital";
import CreatePage from "./Pages/Doctors/CreatePage";
import DoctorSchedulerAdmin from "./Pages/schedule";
import PatientRecords from "./Pages/Hospital/patientData";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/Hospital" element={<Hospital />} />
            <Route path="/Doctors" element={<Doctors />} />
            <Route path="/Patients" element={<Patients />} />
            <Route path="/AddHospital" element={<AddHospital />} />
            <Route path="/CreatePage" element={<CreatePage />} />
            <Route path="/Schedule" element={<DoctorSchedulerAdmin />} />
            <Route path="/patient" element={<PatientRecords />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
