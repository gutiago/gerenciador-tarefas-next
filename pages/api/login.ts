import type { NextApiRequest, NextApiResponse } from 'next';
import { Login } from '../../types/Login';
import { LoginResponse } from '../../types/LoginResponse';
import { DefaultResponseMessage } from '../../types/DefaultResponseMessage';
import { UserModel } from '../../models/UserModel';
import connectDB from '../../middlewares/connectDB';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage | LoginResponse>) => {
    try {
        if (req.method !== 'POST') {
            res.status(400).json({ error: 'HTTP method not allowed' });
            return;
        }

        const auth = req.body as Login;

        if (await hasUser(auth, res)) {
            return;
        }

        res.status(400).json({ error: 'Invalid user or password' });
    } catch (e) {
        console.log('Authentication failed: ', e);
        res.status(500).json({ error: 'Authentication failed, try again' });
    }
}

export default connectDB(handler);

async function hasUser(auth: Login, res: NextApiResponse<DefaultResponseMessage | LoginResponse>) {
    const usersFound = await UserModel.find({ email: auth.login, password: md5(auth.password) })

    const { MY_SECRET_KEY } = process.env;

    if (!MY_SECRET_KEY) {
        res.status(500).json({ error: 'Internal error' });
        return false;
    }

    if (usersFound && usersFound[0]) {
        const user = usersFound[0];
        const token = jwt.sign({ _id: user._id }, MY_SECRET_KEY)

        res.status(200).json(
            {
                name: user.name,
                email: user.email,
                token,
            }
        );
        return true;
    }

    return false;
}
