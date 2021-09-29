import type { NextPage } from 'next';
import { AccessTokenProps } from '../types/AccessTokenProps';

const Home: NextPage<AccessTokenProps> = ({ setAccessToken }) => {
 
    const exit = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setAccessToken('');
    }

    return (
        <div className="container-login">
          <h1>Home</h1>
          <button value="Sair" onClick={ exit }/>
        </div>
    )
}

export default Home;