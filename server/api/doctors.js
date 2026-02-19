// api/doctors.js
import mongoose from 'mongoose';
import Cors from 'cors';
import initMiddleware from './_initMiddleware';
import Doctor from '../models/Doctor';

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
        const doctor = await Doctor.findById(id);
        return res.status(200).json(doctor);
      }
      const doctors = await Doctor.find();
      res.status(200).json(doctors);
      break;

    case 'POST':
      const newDoctor = new Doctor(req.body);
      await newDoctor.save();
      res.status(201).json(newDoctor);
      break;

    case 'PUT':
      if (!id) return res.status(400).json({ error: 'ID is required' });
      const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedDoctor);
      break;

    case 'DELETE':
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await Doctor.findByIdAndDelete(id);
      res.status(200).json({ message: 'Doctor deleted' });
      break;

    default:
      res.status(405).end();
  }
}
