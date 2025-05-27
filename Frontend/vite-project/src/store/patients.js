import { create } from "zustand";

export const usePatientStore = create((set) => ({
  patients: [],
  setPatients: (patients) => set({ patients }),

  createPatient: async (newPatient) => {
    if (
      !newPatient.name ||
      !newPatient.dob ||
      !newPatient.bloodType ||
      !newPatient.contactInfo
    ) {
      return { success: false, message: "Please fill in all required fields." };
    }

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };

      set((state) => ({ patients: [...state.patients, data.data] }));
      return { success: true, message: "Patient record created successfully" };
    } catch (error) {
      return { success: false, message: "Error creating patient record" };
    }
  },

  fetchPatients: async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      set({ patients: data.data });
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error fetching patients:", error);
      return { success: false, message: "Error fetching patient records" };
    }
  },

  deletePatient: async (patientId) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        patients: state.patients.filter((patient) => patient._id !== patientId),
      }));
      return { success: true, message: "Patient record deleted successfully" };
    } catch (error) {
      return { success: false, message: "Error deleting patient record" };
    }
  },

  updatePatient: async (patientId, updatedPatient) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPatient),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        patients: state.patients.map((patient) =>
          patient._id === patientId ? { ...patient, ...updatedPatient } : patient
        ),
      }));
      return { success: true, message: "Patient record updated successfully" };
    } catch (error) {
      return { success: false, message: "Error updating patient record" };
    }
  },

  // Additional medical-specific methods
  addMedicalRecord: async (patientId, medicalRecord) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicalRecord),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        patients: state.patients.map((patient) =>
          patient._id === patientId
            ? {
                ...patient,
                medicalRecords: [...(patient.medicalRecords || []), data.data],
              }
            : patient
        ),
      }));
      return { success: true, message: "Medical record added successfully" };
    } catch (error) {
      return { success: false, message: "Error adding medical record" };
    }
  },

  updatePatientStatus: async (patientId, status) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        patients: state.patients.map((patient) =>
          patient._id === patientId ? { ...patient, status } : patient
        ),
      }));
      return { success: true, message: "Patient status updated successfully" };
    } catch (error) {
      return { success: false, message: "Error updating patient status" };
    }
  },
}));