// src/components/Patients.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Patients.css';
import PatientCard from './PatientCard';

// Use environment variable for backend URL
const API_URL = import.meta.env.VITE_API_URL;

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({
        name: '',
        age: '',
        gender: ''
    });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch patients from backend
    useEffect(() => {
        axios
            .get(`${API_URL}/patients`)
            .then(response => setPatients(response.data))
            .catch(error =>
                console.error('Error fetching patients:', error)
            );
    }, []);

    // Add new patient
    const handleAddPatient = (e) => {
        e.preventDefault();

        axios
            .post(`${API_URL}/patients/add`, newPatient)
            .then(response => {
                setPatients([...patients, response.data]);
                setNewPatient({ name: '', age: '', gender: '' });
            })
            .catch(error =>
                console.error('Error adding patient:', error)
            );
    };

    // Update patient
    const handleUpdatePatient = (id, e) => {
        e.preventDefault();

        axios
            .post(`${API_URL}/patients/update/${id}`, selectedPatient)
            .then(() => {
                const updatedPat = { ...selectedPatient, _id: id };

                setPatients(
                    patients.map(patient =>
                        patient._id === id ? updatedPat : patient
                    )
                );

                setSelectedPatient(null);
                setIsEditMode(false);
            })
            .catch(error =>
                console.error('Error updating patient:', error)
            );
    };

    // Delete patient
    const handleDeletePatient = (id) => {
        axios
            .delete(`${API_URL}/patients/delete/${id}`)
            .then(() => {
                setSelectedPatient(null);
                setPatients(
                    patients.filter(patient => patient._id !== id)
                );
            })
            .catch(error =>
                console.error('Error deleting patient:', error)
            );
    };

    // Edit patient
    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        setIsEditMode(true);
    };

    return (
        <div className="patient-main">
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h4>

                <form
                    onSubmit={
                        isEditMode
                            ? (e) => handleUpdatePatient(selectedPatient._id, e)
                            : handleAddPatient
                    }
                >
                    <label>Name:</label>
                    <input
                        type="text"
                        value={isEditMode ? selectedPatient?.name : newPatient.name}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedPatient({ ...selectedPatient, name: e.target.value })
                                : setNewPatient({ ...newPatient, name: e.target.value })
                        }
                    />

                    <label>Age:</label>
                    <input
                        type="text"
                        value={isEditMode ? selectedPatient?.age : newPatient.age}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedPatient({ ...selectedPatient, age: e.target.value })
                                : setNewPatient({ ...newPatient, age: e.target.value })
                        }
                    />

                    <label>Gender:</label>
                    <input
                        type="text"
                        value={isEditMode ? selectedPatient?.gender : newPatient.gender}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedPatient({ ...selectedPatient, gender: e.target.value })
                                : setNewPatient({ ...newPatient, gender: e.target.value })
                        }
                    />

                    <button type="submit">
                        {isEditMode ? 'Update Patient' : 'Add Patient'}
                    </button>
                </form>
            </div>

            <div className="patients-section">
                <h3 style={{ textAlign: "center" }}>Patients ({patients.length})</h3>

                <div className="patient-list">
                    {patients.map(patient => (
                        <PatientCard
                            key={patient._id}
                            patient={patient}
                            onEdit={handleEditPatient}
                            onDelete={handleDeletePatient}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Patients;
