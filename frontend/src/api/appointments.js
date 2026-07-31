import api from "./index";

export const getAppointments = (params) =>
  api.get("/appointments/", { params }).then((res) => res.data);
export const getAppointment = (id) =>
  api.get(`/appointments/${id}`).then((res) => res.data);
export const createAppointment = (data) =>
  api.post("/appointments/", data).then((res) => res.data);
export const updateAppointment = (id, data) =>
  api.put(`/appointments/${id}`, data).then((res) => res.data);
export const updateAppointmentStatus = (id, status) =>
  api.patch(`/appointments/${id}/status`, { status }).then((res) => res.data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export const createAppointmentWithPatientDoctor = (data) =>
  api
    .post("/appointments/", {
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
    })
    .then((res) => res.data);
