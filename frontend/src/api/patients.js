// frontend/src/api/patients.js

import api from "./index";

export const getPatients = async () => {
  try {
    console.log("📡 Fetching patients from API...");
    const response = await api.get("/patients/");
    console.log("✅ Patients fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Get patients error:", error);
    throw error;
  }
};

export const getPatient = async (id) => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Get patient error:", error);
    throw error;
  }
};

export const createPatient = async (data) => {
  try {
    console.log("📡 Creating patient with data:", data);
    const response = await api.post("/patients/", data);
    console.log("✅ Patient created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Create patient error:", error.response?.data || error);
    throw error;
  }
};

export const updatePatient = async (id, data) => {
  try {
    console.log("📡 Updating patient with ID:", id);
    console.log("📡 Update data:", data);
    const response = await api.put(`/patients/${id}`, data);
    console.log("✅ Patient updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Update patient error:", error.response?.data || error);
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    console.log("📡 Deleting patient with ID:", id);
    const response = await api.delete(`/patients/${id}`);
    console.log("✅ Patient deleted");
    return response.data;
  } catch (error) {
    console.error("❌ Delete patient error:", error.response?.data || error);
    throw error;
  }
};