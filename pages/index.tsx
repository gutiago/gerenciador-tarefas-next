import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Home from '../containers/Home';
import Login from '../containers/Login'
import CreateAccount from '../containers/CreateAccount';

const Index: NextPage = () => {
  const [accessToken, setAccessToken] = useState('');
  const [isLoginView, setLoginView] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('accessToken');

      if (token) {
        setAccessToken(token);
      }
    }
  })

  return (
    !accessToken ? (isLoginView ? <Login setAccessToken={setAccessToken} setLoginView={setLoginView} /> : <CreateAccount setAccessToken={setAccessToken} setLoginView={setLoginView} /> ): 
    <Home setAccessToken={setAccessToken}/>
  )
}

export default Index
