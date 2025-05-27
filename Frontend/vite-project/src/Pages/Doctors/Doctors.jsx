import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDoctorStore } from "../../store/doctors";
import DoctorCard from "../../components/doctorscard";
import Sidebar from "../../common/sidepannel";

const Doctors = () => {
  const { fetchDoctors, doctors } = useDoctorStore();

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  console.log("doctors", doctors);

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
                  to="/CreatePage"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add New Doctor
                </Link>
              </button>
              <h1 className="text-3xl font-bold text-center">
                Our Medical Team 👨‍⚕️👩‍⚕️
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>

              {doctors.length === 0 && (
                <div className="text-center space-y-4">
                  <p className="text-lg text-gray-600">No doctors found 😢</p>
                  <Link
                    to="/create-doctor"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add a Doctor
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

export default Doctors;
