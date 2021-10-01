import type { NextPage } from 'next';
import { useState } from 'react';
import { Task } from '../types/Task';
import Item from './Item';

type ListProps = {
    tasks: Task[]
}
const List: NextPage<ListProps> = ({ tasks }) => {
    const [showFilters, setShowFilter] = useState(false);
    return (
        <div className={"container-list" + (tasks && tasks.length === 0 ? " empty" : "")}>
            {
                tasks && tasks.length > 0 ? 
                tasks.map(t => <Item task={t}/>)
                : 
                <>
                    <img src="/empty-list.svg" alt="List" onClick={ e => setShowFilter(!showFilters) }/>
                    <p>Você ainda não possui tarefas cadastradas!</p>
                </>
            }
        </div>
    )
}

export default List;