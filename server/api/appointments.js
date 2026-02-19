// api/appointments.js
import mongoose from 'mongoose';
import Cors from 'cors';
import initMiddleware from './_initMiddleware';
import Appointment from '../models/Appointment';

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
        const appointment = await Appointment.findById(id);
        return res.status(200).json(appointment);
      }
      const appointments = await Appointment.find();
      res.status(200).json(appointments);
      break;

    case 'POST':
      const newAppointment = new Appointment(req.body);
      await newAppointment.save();
      res.status(201).json(newAppointment);
      break;

    case 'PUT':
      if (!id) return res.status(400).json({ error: 'ID is required' });
      const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedAppointment);
      break;

    case 'DELETE':
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await Appointment.findByIdAndDelete(id);
      res.status(200).json({ message: 'Appointment deleted' });
      break;

    default:
      res.status(405).end();
  }
}
