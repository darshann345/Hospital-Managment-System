import React, { useState, useEffect } from 'react';
import './Doctors.css';
import DoctorCard from './DoctorCard';
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from '../api';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchDoctors = () => {
        getDoctors()
            .then(res => setDoctors(res.data))
            .catch(err => console.error('Error fetching doctors:', err));
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleAddDoctor = (e) => {
        e.preventDefault();
        addDoctor(newDoctor)
            .then(res => {
                setDoctors([...doctors, res.data]);
                setNewDoctor({ name: '', specialty: '' });
            })
            .catch(err => console.error('Error adding doctor:', err));
    };

    const handleUpdateDoctor = (id, e) => {
        e.preventDefault();
        updateDoctor(id, selectedDoctor)
            .then(() => {
                setDoctors(doctors.map(d => d._id === id ? { ...selectedDoctor, _id: id } : d));
                setSelectedDoctor(null);
                setIsEditMode(false);
            })
            .catch(err => console.error('Error updating doctor:', err));
    };

    const handleDeleteDoctor = (id) => {
        deleteDoctor(id)
            .then(() => setDoctors(doctors.filter(d => d._id !== id)))
            .catch(err => console.error('Error deleting doctor:', err));
    };

    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditMode(true);
    };

    return (
        <div className="doctor-main">
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h4>
                <form onSubmit={isEditMode ? (e) => handleUpdateDoctor(selectedDoctor._id, e) : handleAddDoctor}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={isEditMode ? selectedDoctor?.name : newDoctor.name}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                                : setNewDoctor({ ...newDoctor, name: e.target.value })
                        }
                    />
                    <label>Specialty:</label>
                    <input
                        type="text"
                        value={isEditMode ? selectedDoctor?.specialty : newDoctor.specialty}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedDoctor({ ...selectedDoctor, specialty: e.target.value })
                                : setNewDoctor({ ...newDoctor, specialty: e.target.value })
                        }
                    />
                    <button type="submit">{isEditMode ? 'Update Doctor' : 'Add Doctor'}</button>
                </form>
            </div>

            <div className="doctors-section">
                <h3 style={{ textAlign: "center" }}>Doctors ({doctors.length})</h3>
                <div className="doctor-list">
                    {doctors.map(doctor => (
                        <DoctorCard
                            key={doctor._id}
                            doctor={doctor}
                            onEdit={handleEditDoctor}
                            onDelete={handleDeleteDoctor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
