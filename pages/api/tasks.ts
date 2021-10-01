import type { NextApiRequest, NextApiResponse } from 'next';
import { DefaultResponseMessage } from '../../types/DefaultResponseMessage';
import connectDB from '../../middlewares/connectDB';
import jwtValidator from '../../middlewares/jwtValidator';
import { Task } from '../../types/Task';
import { TaskModel } from '../../models/TaskModel';
import { UserModel } from '../../models/UserModel';
import { GetTasksQueryParams } from '../../types/GetTasksQueryParams';
import moment from 'moment';

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage | Task[]>) => {
    try {

        const userId = getUserId(req);
        const failedValidation = await validateUser(userId);

        if (failedValidation) {
            return res.status(400).json({ error: 'Failed to validate user' });
        }

        if (req.method === 'POST') {
            return await saveTask(req, res, userId);
        } else if (req.method === 'GET') {
            return await getTasks(req, res, userId);
        } else if (req.method === 'PUT') {
            return await updateTask(req, res, userId);
        } else if (req.method === 'DELETE') {
            return await deleteTasks(req, res, userId);
        }

        res.status(400).json({ error: 'HTTP method not allowed' });
    } catch (e) {
        console.log('Error processing task: ', e);
        res.status(500).json({ error: 'Error processing task: ' });
    }
}

const validateIdAndReturnTask = async (req: NextApiRequest, userId: string) => {
    const id = req.query?.id as string;

    if (!id || id.trim() === '') {
        return null;
    }

    const taskFound = await TaskModel.findById(id);

    if (!taskFound || taskFound.userId !== userId) {
        return null
    }

    return taskFound;
}

const deleteTasks = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>, userId: string) => {
    const taskFound = await validateIdAndReturnTask(req, userId) as Task;

    if (!taskFound) {
        return res.status(400).json({ error: 'Task not found' });
    }

    await TaskModel.findByIdAndDelete({ _id: taskFound._id });
    return res.status(200).json({ error: 'Task deleted successfully' });
}

const updateTask = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>, userId: string) => {
    const taskFound = await validateIdAndReturnTask(req, userId) as Task;

    if (!taskFound) {
        return res.status(400).json({ error: 'Task not found' });
    }

    if (req.body) {
        const task = req.body as Task;

        if (task.name && task.name.trim() !== '') {
            taskFound.name = task.name
        }

        if (task.finishPrevisionDate) {
            taskFound.finishPrevisionDate = task.finishPrevisionDate
        }

        if (task.finishDate) {
            taskFound.finishDate = task.finishDate
        }

        await TaskModel.findByIdAndUpdate(taskFound._id, taskFound);
        return res.status(200).json({ error: 'Task updated successfully' });
    }

    return res.status(400).json({ error: 'Params not found' });
}

const getTasks = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage | Task[]>, userId: string) => {

    const params = req.query as GetTasksQueryParams;

    const query = {
        userId
    } as any;

    if (params?.finishPrevisionStart) {
        const inputDate = new Date(params?.finishPrevisionStart);
        query.finishPrevisionDate = { $gte: inputDate };
    }

    if (params?.finishPrevisionEnd) {
        const endDate = new Date(params?.finishPrevisionEnd);
        if (!query.finishPrevisionDate) {
            query.finishPrevisionDate = {};
        }
        query.finishPrevisionDate.$lte = endDate;
    }

    if (params?.status) {
        const status = parseInt(params?.status);

        switch (status) {
            case 1:
                query.finishDate = null;
                break;
            case 2:
                query.finishDate = { $ne: null };
                break;
            default:
                break;
        }
    }

    const result = await TaskModel.find(query);
    return res.status(200).json(result);
}

const saveTask = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>, userId: string) => {
    if (req.body) {
        const userFound = await UserModel.findById(userId);

        if (!userFound) {
            return res.status(400).json({ error: 'User not found' });
        }

        const task = req.body as Task;

        if (!isValidTask(task, res)) {
            return res.status(400).json({ error: 'Invalid task' });
        }

        const final = {
            ...task,
            userId,
            finishDate: undefined
        } as Task;

        await TaskModel.create(final);
        return res.status(200).json({ message: 'Task created successfully' });
    }

    return res.status(400).json({ error: 'Invalid params' });
}

const validateUser = async (userId: string) => {
    if (!userId) {
        return "User not informed";
    }

    const userFound = await UserModel.findById(userId);

    if (!userFound) {
        return 'User not found';
    }
}

export default connectDB(jwtValidator(handler));

function getUserId(req: NextApiRequest) {
    return req?.body?.userId ? req?.body?.userId : req?.query?.userId as string;
}

function isValidTask(task: Task, res: NextApiResponse<DefaultResponseMessage>) {
    if (!isValidTaskName(task.name)) {
        res.status(400).json({ error: 'Invalid task name' });
        return false;
    }

    if (!hasValidPrevisionDate(task.finishPrevisionDate)) {
        res.status(400).json({ error: 'Invalid prevision date' });
        return false;
    }

    return true;
}

function isValidTaskName(name: string) {
    return name && name.length > 2;
}

function hasValidPrevisionDate(date: Date) {
    return date && !moment(date).isBefore(new Date());
}