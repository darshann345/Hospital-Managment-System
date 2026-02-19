import React, { useState, useEffect } from 'react';
import './Appointments.css';
import AppointmentCard from './AppointmentCard';
import { getAppointments, addAppointment, updateAppointment, deleteAppointment } from '../api';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({ patientName: '', doctorName: '', date: '' });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchAppointments = () => {
        getAppointments()
            .then(res => setAppointments(res.data))
            .catch(err => console.error('Error fetching appointments:', err));
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleAddAppointment = (e) => {
        e.preventDefault();
        addAppointment(newAppointment)
            .then(res => {
                setAppointments([...appointments, res.data]);
                setNewAppointment({ patientName: '', doctorName: '', date: '' });
            })
            .catch(err => console.error('Error adding appointment:', err));
    };

    const handleUpdateAppointment = (id, e) => {
        e.preventDefault();
        updateAppointment(id, selectedAppointment)
            .then(() => {
                setAppointments(appointments.map(a => a._id === id ? { ...selectedAppointment, _id: id } : a));
                setSelectedAppointment(null);
                setIsEditMode(false);
            })
            .catch(err => console.error('Error updating appointment:', err));
    };

    const handleDeleteAppointment = (id) => {
        deleteAppointment(id)
            .then(() => setAppointments(appointments.filter(a => a._id !== id)))
            .catch(err => console.error('Error deleting appointment:', err));
    };

    const handleEditAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setIsEditMode(true);
    };

    return (
        <div className="appointment-main">
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Appointment' : 'Add New Appointment'}</h4>
                <form onSubmit={isEditMode ? (e) => handleUpdateAppointment(selectedAppointment._id, e) : handleAddAppointment}>
                    <label>Patient Name:</label>
                    <input
                        type="text"
                        value={isEditMode ? selectedAppointment?.patientName : newAppointment.patientName}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedAppointment({ ...selectedAppointment, patientName: e.target.value })
                                : setNewAppointment({ ...newAppointment, patientName: e.target.value })
                        }
                    />
                    <label>Doctor Name:</label>
                    <input
                        type="text"
                        value={isEditMode ? selectedAppointment?.doctorName : newAppointment.doctorName}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedAppointment({ ...selectedAppointment, doctorName: e.target.value })
                                : setNewAppointment({ ...newAppointment, doctorName: e.target.value })
                        }
                    />
                    <label>Date:</label>
                    <input
                        type="date"
                        value={isEditMode ? selectedAppointment?.date : newAppointment.date}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedAppointment({ ...selectedAppointment, date: e.target.value })
                                : setNewAppointment({ ...newAppointment, date: e.target.value })
                        }
                    />
                    <button type="submit">{isEditMode ? 'Update Appointment' : 'Add Appointment'}</button>
                </form>
            </div>

            <div className="appointments-section">
                <h3 style={{ textAlign: "center" }}>Appointments ({appointments.length})</h3>
                <div className="appointment-list">
                    {appointments.map(appointment => (
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
