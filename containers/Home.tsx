import type { NextPage } from 'next';
import { AccessTokenProps } from '../types/AccessTokenProps';
import Header from './Header';

const Home: NextPage<AccessTokenProps> = ({ setAccessToken }) => {
 
    const exit = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setAccessToken('');
    }

    return (
        <Header exit={ exit }/>
    )
}

export default Home;