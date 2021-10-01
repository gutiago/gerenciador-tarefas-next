import type { NextPage } from 'next';
import { useState } from 'react';

type FilterProps = {
    periodFrom: string,
    setPeriodFrom(s: string): void,
    periodTo: string,
    setPeriodTo(s: string): void,
    status: number,
    setStatus(n: number): void
}

const Filter: NextPage<FilterProps> = ({
    periodFrom,
    periodTo,
    status,
    setPeriodFrom,
    setPeriodTo,
    setStatus
}) => {
    const [showFilters, setShowFilter] = useState(false);
    return (
        <div className="container-filters">
            <div className="title">
                <span>Tarefas</span>
                <img src="/filter.svg" alt="Filter tasks" onClick={e => setShowFilter(!showFilters)} />
                <div className="form">
                    <div>
                        <label>Data prevista de conclusão:</label>
                        <input type="date" value={periodFrom} onChange={e => setPeriodFrom(e.target.value)} />
                    </div>
                    <div>
                        <label>até:</label>
                        <input type="date" value={periodTo} onChange={e => setPeriodTo(e.target.value)} />
                    </div>
                    <div>
                        <label>Status:</label>
                        <select value={status} onChange={e => setStatus(parseInt(e.target.value))} >
                            <option value={0}>Todas</option>
                            <option value={1}>Ativas</option>
                            <option value={2}>Concluídas</option>
                        </select>
                    </div>
                </div>
            </div>
            {showFilters && <div className="mobile-filters">
                <div>
                    <label>Periodo de:</label>
                    <input type="date" value={periodFrom} onChange={e => setPeriodFrom(e.target.value)} />
                </div>
                <div>
                    <label>Periodo até:</label>
                    <input type="date" value={periodTo} onChange={e => setPeriodTo(e.target.value)} />
                </div>
                <div>
                    <label>Status:</label>
                    <select value={status} onChange={e => setStatus(parseInt(e.target.value))}>
                        <option value={0}>Todas</option>
                        <option value={1}>Ativas</option>
                        <option value={2}>Concluídas</option>
                    </select>
                </div>
            </div>}
        </div>
    )
}

export default Filter;