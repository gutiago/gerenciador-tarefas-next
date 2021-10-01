import moment from 'moment';
import type { NextPage } from 'next';

type FooterProps = {
    setShowModal(b: boolean): void
}
const Footer: NextPage<FooterProps> = ({ setShowModal }) => {
    return (
        <div className="container-footer">
            <button onClick={() => setShowModal(true)} ><img src="./add.svg"></img> Adicionar Tarefa</button>
            <span>© Copyright {new Date().getFullYear()}. Todos os direitos reservados.</span>
        </div>
    )
}

export default Footer;