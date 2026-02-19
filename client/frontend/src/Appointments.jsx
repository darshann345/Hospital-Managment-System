// Appointments.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentCard from "./components/AppointmentCard";
import "./components/AppointmentCard.css";

// Fallback if env variable not set
// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        patientName: "",
        doctorName: "",
        date: "",
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // ✅ Fetch appointments
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_URL}/appointments/add`);
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments:", error.message);
        }
    };

    // ✅ Add Appointment
    const handleAddAppointment = async (e) => {
        e.preventDefault();

        if (!newAppointment.patientName || !newAppointment.doctorName || !newAppointment.date) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/appointments`,
                newAppointment
            );
            setAppointments([...appointments, res.data]);
            setNewAppointment({ patientName: "", doctorName: "", date: "" });
        } catch (error) {
            console.error("Error adding appointment:", error.message);
        }
    };

    // ✅ Update Appointment
    const handleUpdateAppointment = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `${API_URL}/appointments/${selectedAppointment._id}`,
                selectedAppointment
            );

            setAppointments(
                appointments.map((appointment) =>
                    appointment._id === selectedAppointment._id
                        ? selectedAppointment
                        : appointment
                )
            );

            setSelectedAppointment(null);
            setIsEditMode(false);
        } catch (error) {
            console.error("Error updating appointment:", error.message);
        }
    };

    // ✅ Delete Appointment
    const handleDeleteAppointment = async (id) => {
        try {
            await axios.delete(`${API_URL}/appointments/${id}`);
            setAppointments(
                appointments.filter((appointment) => appointment._id !== id)
            );
        } catch (error) {
            console.error("Error deleting appointment:", error.message);
        }
    };

    const handleEditAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setIsEditMode(true);
    };

    return (
        <div className="flex-row" style={{ width: "100%" }}>
            <div className="flex-column">
                <div className="add-form">
                    <h4>{isEditMode ? "Edit Appointment" : "Add New Appointment"}</h4>

                    <form
                        className="appointment-form"
                        onSubmit={isEditMode ? handleUpdateAppointment : handleAddAppointment}
                    >
                        <label>Patient Name:</label>
                        <input
                            type="text"
                            value={
                                isEditMode
                                    ? selectedAppointment?.patientName
                                    : newAppointment.patientName
                            }
                            onChange={(e) =>
                                isEditMode
                                    ? setSelectedAppointment({
                                        ...selectedAppointment,
                                        patientName: e.target.value,
                                    })
                                    : setNewAppointment({
                                        ...newAppointment,
                                        patientName: e.target.value,
                                    })
                            }
                        />

                        <label>Doctor Name:</label>
                        <input
                            type="text"
                            value={
                                isEditMode
                                    ? selectedAppointment?.doctorName
                                    : newAppointment.doctorName
                            }
                            onChange={(e) =>
                                isEditMode
                                    ? setSelectedAppointment({
                                        ...selectedAppointment,
                                        doctorName: e.target.value,
                                    })
                                    : setNewAppointment({
                                        ...newAppointment,
                                        doctorName: e.target.value,
                                    })
                            }
                        />

                        <label>Date:</label>
                        <input
                            type="date"
                            value={
                                isEditMode
                                    ? selectedAppointment?.date?.substring(0, 10)
                                    : newAppointment.date
                            }
                            onChange={(e) =>
                                isEditMode
                                    ? setSelectedAppointment({
                                        ...selectedAppointment,
                                        date: e.target.value,
                                    })
                                    : setNewAppointment({
                                        ...newAppointment,
                                        date: e.target.value,
                                    })
                            }
                        />

                        <button type="submit">
                            {isEditMode ? "Update Appointment" : "Add Appointment"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="appointments">
                <h3>Appointments ({appointments.length})</h3>

                <div className="appointment-list">
                    {appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment._id}
                            appointment={appointment}
                            onEdit={handleEditAppointment}
                            onDelete={handleDeleteAppointment}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
