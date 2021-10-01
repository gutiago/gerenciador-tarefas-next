import type { NextApiRequest, NextApiResponse } from 'next';
import { DefaultResponseMessage } from '../../types/DefaultResponseMessage';
import { User } from '../../types/User';
import { UserModel } from '../../models/UserModel';
import md5 from 'md5';
import connectDB from '../../middlewares/connectDB';

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>) => {
    try {
        if (req.method !== 'POST') {
            res.status(400).json({ error: 'Método HTTP não permitido' });
            return;
        }

        const user = req.body as User;

        if (!isValidUser(user, res)) {
            return;
        }

        if (await isExistingUser(user, res)) {
            return;
        }

        const final = {
            ...user,
            password: md5(user.password)
        }

        await UserModel.create(final);

        res.status(200).json({ message: 'Usuário criado com sucesso' });
    } catch (e) {
        console.log('Error to create user: ', e);
        res.status(500).json({ error: 'Erro ao criar o usuário' });
    }
}

async function isExistingUser(user: User, res: NextApiResponse<DefaultResponseMessage>) {
    const existingUser = await UserModel.find({ email: user.email });

    if (existingUser && existingUser.length > 0) {
        res.status(400).json({ error: 'Usuário já existe' });
        return true;
    }

    return false;
}

function isValidUser(user: User, res: NextApiResponse<DefaultResponseMessage>) {
    if (!user) {
        res.status(400).json({ error: 'Parâmetros inválidos' });
        return false;
    }

    if (!isValidName(user.name)) {
        res.status(400).json({ message: 'Nome inválido' });
        return false;
    }

    if (!isValidEmail(user.email)) {
        res.status(400).json({ message: 'Email inválido' });
        return false;
    }

    if (!isValidPassword(user.password)) {
        res.status(400).json({ message: 'Senha inválida' });
        return false;
    }

    return true;
}

function isValidName(name: string) {
    return name.length > 2;
}

function isValidEmail(email: string) {
    let re = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
    return re.test(email);
}

// 1 lowercase letter (?=.*[a-z]), 
// 1 uppercase letter (?=.*[A-Z]), 
// 1 digit (?=.*[0-9]), 
// 1 special character (?=.*[^A-Za-z0-9]), a
// at least eight characters long(?=.{8,}).

function isValidPassword(password: string) {
    let re = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    return re.test(password);
}

export default connectDB(handler);