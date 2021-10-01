import type { NextPage } from 'next'
import { useState } from 'react';
import { executeRequest } from '../services/api';
import { AccessTokenProps } from '../types/AccessTokenProps';

const Login: NextPage<AccessTokenProps> = ({ setAccessToken }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [msgErro, setMsgError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const doLogin = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();

      if (!login || !password) {
        setMsgError('Invalid params');
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
        setMsgError('Error parsing data, please try again');
      }

      setLoading(false);
    } catch (e: any) {
      setLoading(false);

      if (e?.response?.data?.error) {
        setMsgError(e?.response?.data?.error);
        return;
      }

      setMsgError('Error, please try again');
    }
  }

  return (
    <div className="container-login">
      <img src="/logo.svg" alt="Logo Fiap" className="logo" />
      <form>
        {msgErro && <p>{msgErro}</p>}
        <div className="input">
          <img src="/mail.svg" alt="Logo Fiap" />
          <input type="text" placeholder="Informe seu email" value={login} onChange={e => setLogin(e.target.value)} />
        </div>
        <div className="input">
          <img src="/lock.svg" alt="Logo Fiap" />
          <input type="password" placeholder="Informe sua senha" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="button" className={isLoading ? "disabled" : "button"} onClick={doLogin} disabled={isLoading}>{isLoading ? "Carregando" : "Login"}</button>
      </form>
    </div>
  )
}

export default Login
