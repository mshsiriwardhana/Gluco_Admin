import { useState } from "react";
import { useDoctorStore } from "../store/doctors";
import {
  Edit,
  Trash2,
  Briefcase,
  Clock,
  Award,
  DollarSign,
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

const DoctorCard = ({ doctor: initialDoctor }) => {
  const [doctor, setDoctor] = useState(initialDoctor);
  const [updatedDoctor, setUpdatedDoctor] = useState(doctor);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { deleteDoctor, updateDoctor } = useDoctorStore();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const { success, message } = await deleteDoctor(doctorId);
      showToast(message, success ? "success" : "error");
      if (success) {
        setDoctor(null);
      }
    } catch (error) {
      showToast("An error occurred while deleting the doctor", "error");
    }
  };

  const handleUpdateDoctor = async (doctorId, updatedDoctorData) => {
    try {
      const { success, message } = await updateDoctor(
        doctorId,
        updatedDoctorData
      );
      showToast(message, success ? "success" : "error");

      if (success) {
        setDoctor(updatedDoctorData);
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast("An error occurred while updating the doctor", "error");
    }
  };

  if (!doctor) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 dark:bg-gray-800">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({ show: false, message: "", type: "success" })
          }
        />
      )}

      <img
        src={doctor.profilePicture || "https://via.placeholder.com/350x200"}
        alt={doctor.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          Dr. {doctor.name}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <Briefcase size={16} className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">
            {doctor.specialization}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <Clock size={16} className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">
            {doctor.experience} experience
          </p>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <Award size={16} className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">
            {doctor.qualifications}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={16} className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">{doctor.charges}</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-blue-600">
            {doctor.hospital ? "Hospital-based" : "Private practice"}
          </span>
          <span className="text-sm text-gray-500">
            Available: {doctor.availability}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Edit size={20} className="w-5 h-5 mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteDoctor(doctor._id)}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <Trash2 size={20} className="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-fit overflow-hidden shadow-lg">
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Update Doctor
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Full Name"
                    value={updatedDoctor.name}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="Endocrinologist"
                    value={updatedDoctor.specialization}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        specialization: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="10 years"
                    value={updatedDoctor.experience}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        experience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 123-4567"
                    value={updatedDoctor.contact}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        contact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@example.com"
                    value={updatedDoctor.email}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hospital"
                    checked={updatedDoctor.hospital}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        hospital: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="hospital"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Hospital-based
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Availability
                  </label>
                  <input
                    type="text"
                    placeholder="Mon-Fri, 9am-5pm"
                    value={updatedDoctor.availability}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        availability: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    placeholder="MD, Board Certified"
                    value={updatedDoctor.qualifications}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        qualifications: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Consultation Charges
                  </label>
                  <input
                    type="text"
                    placeholder="$200 per consultation"
                    value={updatedDoctor.charges}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        charges: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/profile.jpg"
                    value={updatedDoctor.profilePicture}
                    onChange={(e) =>
                      setUpdatedDoctor({
                        ...updatedDoctor,
                        profilePicture: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateDoctor(doctor._id, updatedDoctor)
                    }
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;
