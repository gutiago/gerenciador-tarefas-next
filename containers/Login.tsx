import type { NextPage } from 'next'
import { useState } from 'react';
import { executeRequest } from '../services/api';

type LoginProps = {
  setLoginView(b: boolean): void,
  setAccessToken(e: string) : void
}

const Login: NextPage<LoginProps> = ({ setLoginView, setAccessToken }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [msgErro, setMsgError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const doLogin = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();

      if (!login || !password) {
        setMsgError('Parâmetros inválidos');
        setLoading(false);
        return;
      }

      const body = {
        login,
        password
      }

      const result = await executeRequest('login', 'POST', body);

      setMsgError('');

      if (result && result.data) {
        localStorage.setItem('accessToken', result.data.token);
        localStorage.setItem('userName', result.data.name);
        localStorage.setItem('userEmail', result.data.email);
        setAccessToken(result.data.token);
      } else {
        setMsgError('Erro ao fazer o parse dos dados, tente novamente.');
      }

      setLoading(false);
    } catch (e: any) {
      setLoading(false);

      if (e?.response?.data?.error) {
        setMsgError(e?.response?.data?.error);
        return;
      }

      setMsgError('Erro, tente novamente.');
    }
  }

  return (
    <div className="container-login">
      <img src="/logo.svg" alt="Logo Fiap" className="logo" />
      <form>
        {msgErro && <p>{msgErro}</p>}
        <div className="input">
          <img src="/mail.svg" alt="Email" />
          <input type="text" placeholder="Informe seu email" value={login} onChange={e => setLogin(e.target.value)} />
        </div>
        <div className="input">
          <img src="/lock.svg" alt="Cadeado" />
          <input type="password" placeholder="Informe sua senha" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="button" className={isLoading ? "disabled" : "button"} onClick={doLogin} disabled={isLoading}>{isLoading ? "Carregando" : "Login"}</button>
        <span onClick={ e => setLoginView(false) }>Criar conta</span>
      </form>
    </div>
  )
}

export default Login
