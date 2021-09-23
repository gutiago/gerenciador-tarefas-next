import type { NextApiRequest, NextApiResponse } from 'next';
import { DefaultResponseMessage } from '../../types/DefaultResponseMessage';
import connectDB from '../../middlewares/connectDB';
import jwtValidator from '../../middlewares/jwtValidator';
import { Task } from '../../types/Task';
import { TaskModel } from '../../models/TaskModel';
import { UserModel } from '../../models/UserModel';

const handler = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>) =>{
    try{
        if(req.method === 'POST'){
            return await saveTask(req, res);
        }else if(req.method === 'GET'){
            return;
        }else if(req.method === 'PUT'){
            return;
        }else if(req.method === 'DELETE'){
            return;
        }

        res.status(400).json({ error: 'HTTP method not allowed' });
    }catch(e){
        console.log('Error processing task: ', e);
        res.status(500).json({ error: 'Error processing task: ' });
    }
}

const saveTask = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>) =>{
    if(req.body){
        const userId = req.body.userId;

        if(!userId){
            return res.status(400).json({ error: 'Missing user identifier'});
        }

        const userFound = await UserModel.findById(userId);

        if(!userFound){
            return res.status(400).json({ error: 'User not found' });
        }

        const task = req.body as Task;

        if (!isValidTask(task, res)) {
            return;
        }

        const final = {
            ...task,
            userId,
            finishDate : undefined
        } as Task;

        await TaskModel.create(final);
        return res.status(200).json({ message: 'Task created successfully'});
    }

    return res.status(400).json({ error: 'Invalid params'});
}

export default connectDB(jwtValidator(handler));

function isValidTask(task: Task, res: NextApiResponse<DefaultResponseMessage>) {
    if (!isValidTaskName(task.name)) {
        res.status(400).json({ error: 'Invalid task name'});
        return false;
    }

    if (!hasValidPrevisionDate(task.finishPrevisionDate)) {
        res.status(400).json({ error: 'Invalid prevision date'});
        return false;
    }

    return true;
}

function isValidTaskName(name: string) {
    return name && name.length > 2;
}

function hasValidPrevisionDate(date: Date) {
    return date && new Date(date).getDate() < new Date().getDate();
}