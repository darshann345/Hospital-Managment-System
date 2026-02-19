// api/patients.js
import mongoose from 'mongoose';
import Cors from 'cors';
import initMiddleware from './_initMiddleware';
import Patient from '../models/Patient';

const cors = initMiddleware(Cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
};

export default async function handler(req, res) {
  await cors(req, res);
  await connectDB();

  const id = req.query.id;

  switch (req.method) {
    case 'GET':
      if (id) {
        const patient = await Patient.findById(id);
        return res.status(200).json(patient);
      }
      const patients = await Patient.find();
      res.status(200).json(patients);
      break;

    case 'POST':
      const newPatient = new Patient(req.body);
      await newPatient.save();
      res.status(201).json(newPatient);
      break;

    case 'PUT':
      if (!id) return res.status(400).json({ error: 'ID is required' });
      const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedPatient);
      break;

    case 'DELETE':
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await Patient.findByIdAndDelete(id);
      res.status(200).json({ message: 'Patient deleted' });
      break;

    default:
      res.status(405).end();
  }
}
