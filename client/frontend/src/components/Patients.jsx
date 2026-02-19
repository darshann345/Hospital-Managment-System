import React, { useState, useEffect } from 'react';
import './Patients.css';
import PatientCard from './PatientCard';
import { getPatients, addPatient, updatePatient, deletePatient } from '../api';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '' });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch patients
    const fetchPatients = () => {
        getPatients()
            .then(res => setPatients(res.data))
            .catch(err => console.error('Error fetching patients:', err));
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Add patient
    const handleAddPatient = (e) => {
        e.preventDefault();
        addPatient(newPatient)
            .then(res => {
                setPatients([...patients, res.data]);
                setNewPatient({ name: '', age: '', gender: '' });
            })
            .catch(err => console.error('Error adding patient:', err));
    };

    // Update patient
    const handleUpdatePatient = (id, e) => {
        e.preventDefault();
        updatePatient(id, selectedPatient)
            .then(() => {
                setPatients(patients.map(p => p._id === id ? { ...selectedPatient, _id: id } : p));
                setSelectedPatient(null);
                setIsEditMode(false);
            })
            .catch(err => console.error('Error updating patient:', err));
    };

    // Delete patient
    const handleDeletePatient = (id) => {
        deletePatient(id)
            .then(() => setPatients(patients.filter(p => p._id !== id)))
            .catch(err => console.error('Error deleting patient:', err));
    };

    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        setIsEditMode(true);
    };

    return (
        <div className="patient-main">
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h4>
                <form onSubmit={isEditMode ? (e) => handleUpdatePatient(selectedPatient._id, e) : handleAddPatient}>
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
                    <button type="submit">{isEditMode ? 'Update Patient' : 'Add Patient'}</button>
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
