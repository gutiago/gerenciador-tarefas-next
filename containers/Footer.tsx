import moment from 'moment';
import type { NextPage } from 'next';

type FooterProps = {
}
const Footer: NextPage<FooterProps> = ({  }) => {
    return (
        <div className="container-footer">
            <button><img src="./add.svg"></img> Adicionar Tarefa</button>
            <span>© Copyright {new Date().getFullYear()}. Todos os direitos reservados.</span>
        </div>
    )
}

export default Footer;