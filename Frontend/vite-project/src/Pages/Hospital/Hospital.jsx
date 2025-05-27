
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHospitalStore } from "../../store/hospital";
import HospitalCard from "../../components/hospitalcard";
import Sidebar from "../../common/sidepannel";

const Hospital = () => {
  const { fetchHospitals, hospitals } = useHospitalStore();

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  console.log("hospitals", hospitals);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar*/}
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              <button>
                <Link
                  to="/AddHospital"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add new hospital
                </Link>
              </button>
              <h1 className="text-3xl font-bold text-center">Hospital List</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map((hospital) => (
                  <HospitalCard key={hospital._id} hospital={hospital} />
                ))}
              </div>

              {hospitals.length === 0 && (
                <div className="text-center space-y-4">
                  <p className="text-lg text-gray-600">No hospitals found 😢</p>
                  <Link
                    to="/create-hospital"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add a hospital
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospital;
