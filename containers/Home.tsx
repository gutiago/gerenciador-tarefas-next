import type { NextPage } from 'next';
import { useState } from 'react';
import { TaskModel } from '../models/TaskModel';
import { AccessTokenProps } from '../types/AccessTokenProps';
import { Task } from '../types/Task';
import Filter from './Filter';
import Footer from './Footer';
import Header from './Header';
import List from './List';

const Home: NextPage<AccessTokenProps> = ({ setAccessToken }) => {
 
    const [tasks, setTasks] = useState<Task[]>([
        // { _id: 'teste', userId: 'teste', name: 'teste', finishPrevisionDate : new Date()},
    ]);
    const exit = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setAccessToken('');
    }

    return (
        <div>
            <Header exit={ exit }/>
            <Filter />
            <List tasks={tasks}/>
            <Footer/>
        </div>
    )
}

export default Home;