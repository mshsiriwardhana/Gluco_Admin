import { create } from "zustand";

export const useHospitalStore = create((set) => ({
  hospitals: [],
  loading: false,
  error: null,

  // Set hospitals directly
  setHospitals: (hospitals) => set({ hospitals }),

  // Create new hospital
  createHospital: async (newHospital) => {
    if (
      !newHospital.name ||
      !newHospital.location ||
      !newHospital.description ||
      !newHospital.image
    ) {
      return { success: false, message: "Please fill in all required fields." };
    }

    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHospital),
      });

      if (!res.ok) throw new Error("Failed to create hospital");

      const data = await res.json();
      set((state) => ({
        hospitals: [...state.hospitals, data.data],
        loading: false,
      }));
      return { success: true, message: "Hospital created successfully" };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Fetch all hospitals
  fetchHospitals: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/hospitals");

      if (!res.ok) throw new Error("Failed to fetch hospitals");

      const data = await res.json();
      set({ hospitals: data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Delete hospital
  deleteHospital: async (hospitalId) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/hospitals/${hospitalId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete hospital");

      const data = await res.json();
      set((state) => ({
        hospitals: state.hospitals.filter((h) => h._id !== hospitalId),
        loading: false,
      }));
      return { success: true, message: data.message };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Update hospital
  updateHospital: async (hospitalId, updatedHospital) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/hospitals/${hospitalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHospital),
      });

      if (!res.ok) throw new Error("Failed to update hospital");

      const data = await res.json();
      set((state) => ({
        hospitals: state.hospitals.map((h) =>
          h._id === hospitalId ? { ...h, ...updatedHospital } : h
        ),
        loading: false,
      }));
      return { success: true, message: data.message };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },
}));
