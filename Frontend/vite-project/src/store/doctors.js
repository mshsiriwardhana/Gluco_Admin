import { create } from "zustand";

export const useDoctorStore = create((set) => ({
  doctors: [],
  setDoctors: (doctors) => set({ doctors }),
  createDoctor: async (newDoctor) => {
    if (
      !newDoctor.name ||
      !newDoctor.specialization ||
      !newDoctor.bio ||
      !newDoctor.contact ||
      !newDoctor.image
    ) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch("/api/doctors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDoctor),
    });
    const data = await res.json();
    set((state) => ({ doctors: [...state.doctors, data.data] }));
    return { success: true, message: "Doctor created successfully" };
  },
  fetchDoctors: async () => {
    const res = await fetch("/api/doctors");
    const data = await res.json();
    set({ doctors: data.data });
  },
  deleteDoctor: async (pid) => {
    const res = await fetch(`/api/doctors/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      doctors: state.doctors.filter((doctor) => doctor._id !== pid),
    }));
    return { success: true, message: data.message };
  },
  updateDoctor: async (pid, updatedDoctor) => {
    try {
      const res = await fetch(`/api/doctors/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDoctor),
      });

      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }

      // Update the state with the new doctor data
      set((state) => ({
        doctors: state.doctors.map((doctor) =>
          doctor._id === pid ? { ...doctor, ...updatedDoctor } : doctor
        ),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error updating doctor" };
    }
  },
}));