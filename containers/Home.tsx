import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { TaskModel } from '../models/TaskModel';
import { executeRequest } from '../services/api';
import { AccessTokenProps } from '../types/AccessTokenProps';
import { Task } from '../types/Task';
import Filter from './Filter';
import Footer from './Footer';
import Header from './Header';
import List from './List';

const Home: NextPage<AccessTokenProps> = ({ setAccessToken }) => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [periodFrom, setPeriodFrom] = useState('');
    const [periodTo, setPeriodTo] = useState('');
    const [status, setStatus] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [name, setName] = useState('');
    const [finishPrevisionDate, setFinishPrevisionDate] = useState('');
    const [isLoading, setLoading] = useState(false);

    const getFilteredList = async () => {
        try {
            let filters = '?status=' + status;

            if (periodFrom) {
                filters += '&finishPrevisionStart=' + periodFrom
            }

            if (periodTo) {
                filters += '&finishPrevisionEnd=' + periodTo
            }

            const result = await executeRequest('task' + filters, 'GET');

            if (result && result.data) {
                setTasks(result.data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const doSave = async (e: any) => {
        try {
            setLoading(true);
            e.preventDefault();

            if (!name || !finishPrevisionDate) {
                setMsgError('Please, enter the name and finish date');
                setLoading(false);
                return;
            }

            const body = {
                name,
                finishPrevisionDate
            }

            await executeRequest('task', 'POST', body);
            await getFilteredList();
            closeModal();

        } catch (e: any) {
            setLoading(false);

            if (e?.response?.data?.error) {
                setMsgError(e?.response?.data?.error);
                return;
            }

            setMsgError('Error, please try again');
        }
    }

    useEffect(() => {
        getFilteredList()
    }, []);

    const exit = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setAccessToken('');
    }

    const closeModal = () => {
        setName('');
        setFinishPrevisionDate('');
        setLoading(false);
        setMsgError('');
        setShowModal(false);
    }

    return (
        <>
            <Header exit={exit} setShowModal={setShowModal} />
            <Filter
                periodFrom={periodFrom}
                periodTo={periodTo}
                status={status}
                setPeriodFrom={setPeriodFrom}
                setPeriodTo={setPeriodTo}
                setStatus={setStatus}
            />
            <List tasks={tasks} />
            <Footer setShowModal={setShowModal} />
            <Modal show={showModal}
                onHide={() => closeModal()}
                className="container-modal">
                <Modal.Body>
                    <p>Adicionar uma tarefa</p>
                    {msgError && <p className="error">{msgError}</p>}
                    <input type="text"
                        placeholder="Nome da tarefa"
                        value={name}
                        onChange={e => setName(e.target.value)} />
                    <input type="text"
                        placeholder="Data de previsão de conclusão"
                        value={finishPrevisionDate}
                        onChange={e => setFinishPrevisionDate(e.target.value)}
                        onFocus={e => e.target.type = "date"}
                        onBlur={e => finishPrevisionDate ? e.target.type = "date" : e.target.type = "text"} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <button
                            onClick={doSave}
                            disabled={isLoading}
                        >{isLoading ? "...Enviando dados" : "Salvar"}</button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Home;