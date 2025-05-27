import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useHospitalStore } from "../store/hospital";

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

const HospitalCard = ({ hospital: initialHospital }) => {
  const [hospital, setHospital] = useState(initialHospital);
  const [updatedHospital, setUpdatedHospital] = useState(hospital);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { deleteHospital, updateHospital } = useHospitalStore();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleDeleteHospital = async (hospitalId) => {
    try {
      const { success, message } = await deleteHospital(hospitalId);
      showToast(message, success ? "success" : "error");
      if (success) {
        setHospital(null);
      }
    } catch (error) {
      showToast("An error occurred while deleting the hospital", "error");
    }
  };

  const handleUpdateHospital = async (hospitalId, updatedHospitalData) => {
    try {
      const { success, message } = await updateHospital(
        hospitalId,
        updatedHospitalData
      );
      showToast(message, success ? "success" : "error");

      if (success) {
        setHospital(updatedHospitalData);
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast("An error occurred while updating the hospital", "error");
    }
  };

  if (!hospital) return null;

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
        src={
          hospital.image || "https://via.placeholder.com/400x250?text=Hospital"
        }
        alt={hospital.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{hospital.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {hospital.location}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {hospital.description}
        </p>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Edit size={20} className="w-5 h-5 mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteHospital(hospital._id)}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <Trash2 size={20} className="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Update Hospital
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Hospital Name"
                value={updatedHospital.name}
                onChange={(e) =>
                  setUpdatedHospital({
                    ...updatedHospital,
                    name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
              />

              <input
                type="text"
                placeholder="Location"
                value={updatedHospital.location}
                onChange={(e) =>
                  setUpdatedHospital({
                    ...updatedHospital,
                    location: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
              />

              <textarea
                placeholder="Description"
                value={updatedHospital.description}
                onChange={(e) =>
                  setUpdatedHospital({
                    ...updatedHospital,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                rows={3}
              />

              <input
                type="text"
                placeholder="Image URL"
                value={updatedHospital.image}
                onChange={(e) =>
                  setUpdatedHospital({
                    ...updatedHospital,
                    image: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
              />

              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleUpdateHospital(hospital._id, updatedHospital)
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
      )}
    </div>
  );
};

export default HospitalCard;