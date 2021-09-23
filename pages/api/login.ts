import type { NextApiRequest, NextApiResponse } from 'next';
import { Login } from '../../types/Login';
import { DefaultResponseMessage } from '../../types/DefaultResponseMessage';

export default function handler (req : NextApiRequest, res : NextApiResponse<DefaultResponseMessage>) {
    try {
        if (req.method !== 'POST') {
            res.status(400).json({ error: 'HTTP method not allowed' });
            return;
        }

        const body = req.body as Login;
        if (body.login && body.password) {
            res.status(200).json({ message: 'Login successfully' });
            return;
        }

        res.status(400).json({ error: 'Invalid user or password' });
    } catch (e) {
        console.log('Authentication failed: ', e);
        res.status(500).json({ error: 'Authentication failed, try again' });
    }
}