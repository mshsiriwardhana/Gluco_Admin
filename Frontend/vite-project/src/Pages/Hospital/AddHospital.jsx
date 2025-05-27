import { useState } from "react";
import PropTypes from "prop-types";
import { useHospitalStore } from "../../store/hospital";
import Sidebar from "../../common/sidepannel";
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
  type: PropTypes.string,
  onClose: PropTypes.func,
};


const AddHospital = () => {
  const [newHospital, setNewHospital] = useState({
    name: "",
    location: "",
    description: "",
    image: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
    isClosable: true,
  });

  const { createHospital } = useHospitalStore();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleAddHospital = async () => {
    const { success, message } = await createHospital(newHospital);
    showToast(message, success ? "success" : "error");

    if (success) {
      setNewHospital({
        name: "",
        location: "",
        description: "",
        image: "",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar*/}
      <Sidebar />
      <div className="max-w-2xl mx-auto px-4">
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
          <h1 className="text-4xl font-bold text-center mb-8">
            Add New Hospital
          </h1>

          <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Hospital Name"
                name="name"
                value={newHospital.name}
                onChange={(e) =>
                  setNewHospital({ ...newHospital, name: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Location"
                name="location"
                type="text"
                value={newHospital.location}
                onChange={(e) =>
                  setNewHospital({
                    ...newHospital,
                    location: e.target.value,
                  })
                }
              />

              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Description"
                name="description"
                value={newHospital.description}
                onChange={(e) =>
                  setNewHospital({
                    ...newHospital,
                    description: e.target.value,
                  })
                }
                rows={3}
              />

              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Image URL"
                name="image"
                value={newHospital.image}
                onChange={(e) =>
                  setNewHospital({ ...newHospital, image: e.target.value })
                }
              />

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                onClick={handleAddHospital}
              >
                Add Hospital
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHospital;
