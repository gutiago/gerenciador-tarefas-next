import type { NextPage } from 'next';
import { AccessTokenProps } from '../types/AccessTokenProps';

type HeaderProps = {
    exit() : void
}

const Header: NextPage<HeaderProps> = ({ exit }) => {
    const fullName = localStorage.getItem('userName');
    const userName = fullName?.split(' ')[0] || ''

    return (
        <div className="container-header">
          <img src="/logo.svg" alt="Logo Fiap" className="logo"/>
          <button><span>+</span> Adicionar Tarefa</button>
          <div className="mobile">
            <span>Olá, {userName}</span>
            <img src="/exit-mobile.svg" alt="Logout" onClick={ exit }/>
          </div>
          <div className="desktop">
            <span>Olá, {userName}</span>
            <img src="/exit-desktop.svg" alt="Logout" onClick={ exit }/>
          </div>
        </div>
      )
}

export default Header;