import api from "./index";

export const getDoctors = () => api.get("/doctors/").then((res) => res.data);
export const getDoctor = (id) =>
  api.get(`/doctors/${id}`).then((res) => res.data);
export const createDoctor = (data) =>
  api.post("/doctors/", data).then((res) => res.data);
export const updateDoctor = (id, data) => {
  console.log("Updating doctor:", id, data);
  return api.put(`/doctors/${id}`, data).then((res) => res.data);
};
export const deleteDoctor = (id) => {
  console.log("Deleting doctor:", id);
  return api.delete(`/doctors/${id}`);
};
