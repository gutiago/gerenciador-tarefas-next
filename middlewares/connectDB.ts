import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';

const connectDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        const { DB_CONNECTION_STRING } = process.env;

        if (!DB_CONNECTION_STRING) {
            return res.status(500).json({ error: 'DB connection not specified'})
        }

        await mongoose.connect(DB_CONNECTION_STRING);
        mongoose.connection.on('connected', () => console.log('DB Connected'));
        mongoose.connection.on('error', error => console.log('Error trying to connect database', error));

        return handler(req, res);
    }

export default connectDB;