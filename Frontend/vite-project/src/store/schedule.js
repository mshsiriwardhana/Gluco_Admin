import { create } from "zustand";
import axios from "axios";

const useScheduleStore = create((set) => ({
  schedules: [],
  loading: false,
  error: null,

  // Fetch all schedules
  fetchSchedules: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/schedules");
      set({ schedules: response.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch by doctor
  fetchScheduleByDoctor: async (doctorId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api/schedules/${doctorId}`);
      set({ schedules: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add or update schedule
  upsertSchedule: async (scheduleData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/api/schedules", scheduleData);
      set((state) => ({
        schedules: [
          ...state.schedules.filter(
            (s) => !(s.doctor === scheduleData.doctor && s.date === scheduleData.date)
          ),
          res.data.data,
        ],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Delete a slot from a schedule
  deleteSlot: async (scheduleId, slotId) => {
    set({ loading: true });
    try {
      await axios.delete(`/api/schedules/${scheduleId}/slot/${slotId}`);
      set((state) => ({
        schedules: state.schedules.map((schedule) =>
          schedule._id === scheduleId
            ? {
                ...schedule,
                slots: schedule.slots.filter((slot) => slot._id !== slotId),
              }
            : schedule
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useScheduleStore;
