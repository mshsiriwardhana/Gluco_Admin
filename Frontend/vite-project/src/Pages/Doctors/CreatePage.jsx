import { useState } from "react";
import PropTypes from "prop-types";
import { useDoctorStore } from "../../store/doctors.js";
import Sidebar from "../../common/sidepannel";
import {
  Briefcase,
  Clock,
  Mail,
  Phone,
  Home,
  Award,
  DollarSign,
  User,
} from "lucide-react";

const Toast = ({ message, type, onClose }) => (
  <div className="fixed top-4 right-4 flex items-center gap-2 min-w-[300px] p-4 text-white rounded-lg shadow-lg animate-slide-in">
    <div
      className={`${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } p-4 rounded-lg flex items-center justify-between w-full`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  </div>
);
Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};


const CreatePage = () => {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    experience: "",
    contact: "",
    email: "",
    hospital: false,
    availability: "",
    qualifications: "",
    charges: "",
    profilePicture: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { createDoctor } = useDoctorStore();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleAddDoctor = async () => {
    if (!newDoctor.name || !newDoctor.specialization || !newDoctor.contact) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const { success, message } = await createDoctor(newDoctor);
    showToast(message, success ? "success" : "error");

    if (success) {
      setNewDoctor({
        name: "",
        specialization: "",
        experience: "",
        contact: "",
        email: "",
        hospital: false,
        availability: "",
        qualifications: "",
        charges: "",
        profilePicture: "",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar*/}
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() =>
                setToast({ show: false, message: "", type: "success" })
              }
            />
          )}

          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">
              Add New Doctor
            </h1>

            <div className="w-full bg-white p-6 rounded-lg shadow-md space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Personal Information
                </h2>

                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Name (Dr. John Doe)"
                    value={newDoctor.name}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contact Number"
                    value={newDoctor.contact}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, contact: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email Address"
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Professional Information
                </h2>

                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specialization"
                    value={newDoctor.specialization}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        specialization: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Experience (e.g., 5 years)"
                    value={newDoctor.experience}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, experience: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Award size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Qualifications (MD, PhD, etc.)"
                    value={newDoctor.qualifications}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        qualifications: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Consultation Charges"
                    value={newDoctor.charges}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, charges: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Home size={18} className="text-gray-500" />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hospital"
                      checked={newDoctor.hospital}
                      onChange={(e) =>
                        setNewDoctor({
                          ...newDoctor,
                          hospital: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="hospital" className="text-gray-700">
                      Hospital-based
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-500" />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Availability (e.g., Mon-Fri 9am-5pm)"
                    value={newDoctor.availability}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        availability: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Profile Picture */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Profile Picture
                </h2>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Profile Picture URL"
                  value={newDoctor.profilePicture}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      profilePicture: e.target.value,
                    })
                  }
                />
              </div>

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 mt-6"
                onClick={handleAddDoctor}
              >
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
