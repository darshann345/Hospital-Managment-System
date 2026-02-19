// src/api.js
import axios from 'axios';

// Base URL for backend
export const API_URL = 'https://hospital-managment-system-5qat.onrender.com';

/* -------------------- PATIENTS -------------------- */
export const getPatients = () => axios.get(`${API_URL}/patients`);
export const addPatient = (data) => axios.post(`${API_URL}/patients/add`, data);
export const updatePatient = (id, data) => axios.post(`${API_URL}/patients/update/${id}`, data);
export const deletePatient = (id) => axios.delete(`${API_URL}/patients/delete/${id}`);

/* -------------------- DOCTORS -------------------- */
export const getDoctors = () => axios.get(`${API_URL}/doctors`);
export const addDoctor = (data) => axios.post(`${API_URL}/doctors/add`, data);
export const updateDoctor = (id, data) => axios.post(`${API_URL}/doctors/update/${id}`, data);
export const deleteDoctor = (id) => axios.delete(`${API_URL}/doctors/delete/${id}`);

/* -------------------- APPOINTMENTS -------------------- */
export const getAppointments = () => axios.get(`${API_URL}/appointments`);
export const addAppointment = (data) => axios.post(`${API_URL}/appointments/add`, data);
export const updateAppointment = (id, data) => axios.post(`${API_URL}/appointments/update/${id}`, data);
export const deleteAppointment = (id) => axios.delete(`${API_URL}/appointments/delete/${id}`);
