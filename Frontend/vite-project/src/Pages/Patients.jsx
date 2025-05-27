import  { useEffect, useState } from "react";
import Sidebar from "../common/sidepannel.jsx";
import { usePatientStore } from "../store/patients.js";
import { ChevronDown, ChevronUp, Trash2, Search } from "lucide-react";

function Patients() {
  const { patients, fetchPatients, deletePatient } = usePatientStore();
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Fetch patients when the component mounts
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Update filtered patients when patients or search term changes
  useEffect(() => {
    setFilteredPatients(
      patients.filter(patient => 
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.medicalHistory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentMedications?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [patients, searchTerm]);

  // Handle patient deletion
  const handleDeletePatient = async (pid, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      const result = await deletePatient(pid);
      if (result.success) {
        alert("Patient record deleted successfully!");
      } else {
        alert(`Failed to delete patient record: ${result.message}`);
      }
    }
  };

  // Format date to remove time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Toggle expanded patient
  const toggleExpandPatient = (id) => {
    setExpandedPatient(expandedPatient === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Patient Records</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Total Patients</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">New This Month</p>
              <p className="text-2xl font-bold">
                {patients.filter(patient => {
                  const patientDate = new Date(patient.registrationDate);
                  const currentDate = new Date();
                  return patientDate.getMonth() === currentDate.getMonth() && 
                         patientDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Active Cases</p>
              <p className="text-2xl font-bold">
                {patients.filter(patient => patient.status === 'active').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">High Priority</p>
              <p className="text-2xl font-bold">
                {patients.filter(patient => patient.priority === 'high').length}
              </p>
            </div>
          </div>

          {/* Patient Cards */}
          <div className="space-y-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md"
                >
                  {/* Card Header - Always visible */}
                  <div
                    className="p-4 cursor-pointer flex justify-between items-start"
                    onClick={() => toggleExpandPatient(patient._id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {patient.name || "Unknown"}
                        </h3>
                        <span className="ml-3 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {patient.status || "N/A"}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDate(patient.dob)}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Patient ID</p>
                          <p className="text-sm">{patient.patientId || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Blood Type</p>
                          <p className="text-sm">{patient.bloodType || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Last Visit</p>
                          <p className="text-sm">{formatDate(patient.lastVisit) || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => handleDeletePatient(patient._id, e)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      {expandedPatient === patient._id ? (
                        <ChevronUp size={20} className="text-gray-500 ml-2" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500 ml-2" />
                      )}
                    </div>
                  </div>

                  {/* Card Details - Conditionally visible */}
                  {expandedPatient === patient._id && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">Personal Information</h4>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="text-gray-500">Email:</span> {patient.email || "N/A"}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Phone:</span> {patient.phone || "N/A"}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Address:</span> {patient.address || "N/A"}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Emergency Contact:</span> {patient.emergencyContact || "N/A"}
                            </p>
                          </div>

                          <h4 className="font-medium text-gray-800 mt-4 mb-3">Medical Information</h4>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="text-gray-500">Allergies:</span> {patient.allergies || "None reported"}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Current Medications:</span> {patient.currentMedications || "None"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">Medical History</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-500">Conditions:</p>
                              <p className="text-sm bg-blue-50 p-2 rounded mt-1">{patient.medicalHistory || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Recent Procedures:</p>
                              <p className="text-sm bg-yellow-50 p-2 rounded mt-1">{patient.recentProcedures || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Notes:</p>
                              <p className="text-sm bg-gray-100 p-2 rounded mt-1">{patient.notes || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-medium text-gray-800 mb-3">Vitals</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Blood Pressure</p>
                            <p className="text-sm">{patient.bloodPressure || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                            <p className="text-sm">{patient.heartRate || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Temperature</p>
                            <p className="text-sm">{patient.temperature || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Weight</p>
                            <p className="text-sm">{patient.weight || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">No patients found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;