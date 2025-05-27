import  { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Trash2, Save, ArrowLeft, CheckCircle } from 'lucide-react';


const DoctorSchedulerAdmin = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Sample doctors data
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        console.log('Fetching doctors from:', `${API_URL}/api/doctors`);
        
        const res = await fetch(`${API_URL}/api/doctors`);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
        }
        
        const data = await res.json();
        if (data.success) {
          setDoctors(data.data);
        } else {
          throw new Error(data.message || "Failed to load doctors");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err.message);
      }
    };

    fetchDoctors();
  }, []);


   // Load from localStorage on mount
   useEffect(() => {
    const stored = localStorage.getItem('doctorSchedules');
    if (stored) {
      setSchedules(JSON.parse(stored));
    } else {
      const initialSchedules = {};
      doctors.forEach(doctor => {
        initialSchedules[doctor._id] = {};
      });
      setSchedules(initialSchedules);
    }
  }, [doctors]);

  // Save to localStorage on schedules change
  useEffect(() => {
    localStorage.setItem('doctorSchedules', JSON.stringify(schedules));
  }, [schedules]);


   const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAddSlot(false);
    setError(null);
    setSuccess(null);
  };


  const hasOverlap = (slot1, slot2) =>
    slot1.startTime < slot2.endTime && slot2.startTime < slot1.endTime;



  const handleAddTimeSlot = async () => {
    try {
      setError(null);
      setSuccess(null);

      // Validate inputs
      if (!newSlot.startTime || !newSlot.endTime) {
        throw new Error("Both start and end times are required");
      }

      if (newSlot.startTime >= newSlot.endTime) {
        throw new Error("Start time must be before end time");
      }

      if (!selectedDoctor?._id) {
        throw new Error("No doctor selected");
      }

      if (!currentDate) {
        throw new Error("No date selected");
      }

      const doctorId = selectedDoctor._id;
      const dateKey = currentDate;
      const existingSlots = schedules[doctorId]?.[dateKey] || [];

      if (existingSlots.some(slot => hasOverlap(slot, newSlot))) {
        throw new Error("Time slot overlaps with an existing one");
      }

      // Prepare updated slots
      const updatedSlots = [
        ...existingSlots,
        {
          id: Date.now(),
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          isBooked: false
        }
      ];

      // Update local state
      setSchedules(prev => ({
        ...prev,
        [doctorId]: {
          ...(prev[doctorId] || {}),
          [dateKey]: updatedSlots
        }
      }));

      // Prepare data for backend
      const scheduleData = {
         doctor:doctorId,
        date: dateKey,
        slots: updatedSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: slot.isBooked
        }))
      };

      // Verify data before sending
      if (!scheduleData.doctor || !scheduleData.date || !scheduleData.slots?.length) {
        throw new Error("Incomplete schedule data");
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

      // Send to backend
      const response = await fetch(`${API_BASE}/api/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save schedule");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Backend failed to save schedule");
      }

      setSuccess("Schedule saved successfully!");
      setNewSlot({ startTime: '', endTime: '' });
      setShowAddSlot(false);
    } catch (err) {
      console.error("Error in handleAddTimeSlot:", err);
      setError(err.message);
    }
  };

  const handleDeleteSlot = (slotId) => {
    try {
      if (!selectedDoctor?._id || !currentDate) {
        throw new Error("No doctor or date selected");
      }

      const doctorId = selectedDoctor._id;
      const dateKey = currentDate;

      const slot = schedules[doctorId]?.[dateKey]?.find(s => s.id === slotId);
      if (slot?.isBooked) {
        throw new Error("Cannot delete a booked slot");
      }

      setSchedules(prev => ({
        ...prev,
        [doctorId]: {
          ...prev[doctorId],
          [dateKey]: prev[doctorId][dateKey]?.filter((slot) => slot.id !== slotId) || [],
        }
      }));

      setSuccess("Slot deleted successfully");
    } catch (err) {
      console.error("Error in handleDeleteSlot:", err);
      setError(err.message);
    }
  };

  const getCurrentDaySchedule = () => {
    if (!selectedDoctor) return [];
    return schedules[selectedDoctor._id]?.[currentDate] || [];
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };


  if (selectedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
           {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Doctors
              </button>
              <div className="flex items-center">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h1>
                  <p className="text-gray-600">{selectedDoctor.specialty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Schedule for</h2>
              </div>
              <input
                type="date"
                value={currentDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Available Time Slots</h3>
              <button
                onClick={() => setShowAddSlot(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </button>
            </div>

            {/* Add New Slot Form */}
            {showAddSlot && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Add New Time Slot</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={handleAddTimeSlot}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddSlot(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Slots */}
            <div className="space-y-3">
              {getCurrentDaySchedule().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No time slots scheduled for this date</p>
                  <p className="text-sm">Click &quot;Add Time Slot&quot; to create a schedule</p>
                </div>
              ) : (
                getCurrentDaySchedule()
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <span className="text-lg font-medium text-gray-900">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                          <div className="flex items-center mt-1">
                            {slot.isBooked ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Booked
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
          {/* Error Message for doctors list */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Schedule Management</h1>
              <p className="text-gray-600 mt-1">Select a doctor to manage their schedule</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              onClick={() => handleDoctorSelect(doctor)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  <span>Manage Schedule</span>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {Object.keys(schedules?.[doctor._id] || {}).length} days scheduled
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedulerAdmin;