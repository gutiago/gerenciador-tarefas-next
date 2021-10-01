import moment from 'moment';
import type { NextPage } from 'next';
import { Task } from '../types/Task';

type ItemProps = {
    task: Task
}
const Item: NextPage<ItemProps> = ({ task }) => {
    const getDateText = (finishDate: Date | undefined, finishPrevisionDate: Date) => {
        if (finishDate) {
            return `Concluído em: ${moment(finishDate).format('DD/MM/yyyy')}`
        }
        return `Previsão de conclusão em: ${moment(finishPrevisionDate).format('DD/MM/yyyy')}`;
    }
    return (
        <div className={ "container-item" + (task.finishDate ? " activated" : "")}>
            <img src={task.finishDate ? "/finished.svg" : "/unfinished.svg"} alt={task.finishDate ? "Tarefa concluída" : "Tarefa não concluída"}/>
            <div>
                <p className={task.finishDate ? "finished" : ""}>{task.name}</p>
                <span>{ getDateText(task.finishDate, task.finishPrevisionDate) }</span>
            </div>
        </div>
    )
}

export default Item;