import { useState, useEffect } from 'react';
import { Search, User, Calendar, Phone, Mail, UserCheck } from 'lucide-react';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    reasonForVisit: ''
  });

  // Sample data for demonstration - replace with actual API calls
  const samplePatients = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      reasonForVisit: 'Annual checkup',
      createdAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '+1987654321',
      dateOfBirth: '1990-07-22',
      gender: 'Female',
      reasonForVisit: 'Flu symptoms',
      createdAt: new Date('2024-01-20')
    },
    {
      _id: '3',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@email.com',
      phone: '+1555123456',
      dateOfBirth: '1978-11-08',
      gender: 'Male',
      reasonForVisit: 'Chest pain evaluation',
      createdAt: new Date('2024-01-25')
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    setPatients(samplePatients);
    setFilteredPatients(samplePatients);
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    const filtered = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.reasonForVisit.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Calculate statistics
  const stats = {
    totalPatients: patients.length,
    newThisMonth: patients.filter(p => {
      const now = new Date();
      const patientDate = new Date(p.createdAt);
      return patientDate.getMonth() === now.getMonth() && patientDate.getFullYear() === now.getFullYear();
    }).length,
    activeCases: patients.length, // Assuming all are active for demo
    highPriority: patients.filter(p => 
      p.reasonForVisit.toLowerCase().includes('emergency') || 
      p.reasonForVisit.toLowerCase().includes('urgent')
    ).length
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
          !formData.dateOfBirth || !formData.gender || !formData.reasonForVisit) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Simulate API call - replace with actual MongoDB API call
      const newPatient = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      };

      if (editingPatient) {
        // Update existing patient
        setPatients(prev => prev.map(p => p._id === editingPatient._id ? { ...newPatient, _id: editingPatient._id } : p));
      } else {
        // Add new patient
        setPatients(prev => [...prev, newPatient]);
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        reasonForVisit: ''
      });
      setShowAddForm(false);
      setEditingPatient(null);
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit patient
  const handleEdit = (patient) => {
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      reasonForVisit: patient.reasonForVisit
    });
    setEditingPatient(patient);
    setShowAddForm(true);
  };

  // Handle delete patient
  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        // Simulate API call - replace with actual MongoDB API call
        setPatients(prev => prev.filter(p => p._id !== patientId));
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRow {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceSlow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-3px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-fade-in-row {
          animation: fadeInRow 0.5s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">Patient Records</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <User className="h-8 w-8 text-blue-600 animate-bounce-slow" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-slide-up animation-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.newThisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600 animate-bounce-slow" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-slide-up animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeCases}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600 animate-bounce-slow" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-slide-up animation-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-gray-900">{stats.highPriority}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6 animate-slide-up animation-delay-400">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200" size={20} />
            <input
              type="text"
              placeholder="Search patients by name, email, phone, or reason for visit..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Add/Edit Patient Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                <textarea
                  name="reasonForVisit"
                  value={formData.reasonForVisit}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the reason for the visit..."
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editingPatient ? 'Update Patient' : 'Add Patient'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPatient(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patient Records Table */}
        <div className="bg-white rounded-lg shadow-sm border animate-slide-up animation-delay-500">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Patient List</h2>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500 animate-fade-in">
                {searchTerm ? 'No patients found matching your search criteria.' : 'No patient records found.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Age/Gender</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reason for Visit</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date Added</th>
      
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient, index) => (
                      <tr key={patient._id} className="border-b hover:bg-gray-50 transition-colors duration-200 animate-fade-in-row" style={{animationDelay: `${index * 100}ms`}}>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                              <Mail size={14} />
                              {patient.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                              <Phone size={14} />
                              {patient.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {calculateAge(patient.dateOfBirth)} years
                          </div>
                          <div className="text-sm text-gray-600">{patient.gender}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {patient.reasonForVisit}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(patient.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                           
                           
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;