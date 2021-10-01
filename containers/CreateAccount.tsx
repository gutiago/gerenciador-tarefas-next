import type { NextPage } from 'next'
import { useState } from 'react';
import { executeRequest } from '../services/api';

type CreateProps = {
    setLoginView(b: boolean): void,
    setAccessToken(e: string) : void
}

const CreateAccount: NextPage<CreateProps> = ({ setLoginView, setAccessToken }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [msgErro, setMsgError] = useState('');
    const [isLoading, setLoading] = useState(false);
  
    const doCreate = async (e: any) => {
      try {
        setLoading(true);
        e.preventDefault();
  
        if (!email || !email || !password) {
          setMsgError('Parâmetros inválidos');
          setLoading(false);
          return;
        }
  
        const body = {
          email,
          name,
          password
        }
  
        const result = await executeRequest('user', 'POST', body);
  
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
      <div className="container-create">
        <img src="/logo.svg" alt="Logo Fiap" className="logo" />
        <form>
          {msgErro && <p>{msgErro}</p>}
          <div className="input">
            <img src="/mail.svg" alt="Email" />
            <input type="text" placeholder="Informe seu email" value={ email } onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input">
            <img src="/name.png" alt="Nome" />
            <input type="text" placeholder="Informe seu nome" value={ name } onChange={e => setName(e.target.value)} />
          </div>
          <div className="input">
            <img src="/lock.svg" alt="Cadeado" />
            <input type="password" placeholder="Informe sua senha" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="button" className={isLoading ? "disabled" : "button"} onClick={doCreate} disabled={isLoading}>{isLoading ? "Carregando" : "Criar conta"}</button>
          <span onClick={ e => setLoginView(true) }>Já possui uma conta? Faça login.</span>
        </form>
      </div>
    )
  }
  
  export default CreateAccount