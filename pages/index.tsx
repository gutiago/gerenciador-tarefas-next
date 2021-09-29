import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="container-login">
      <img src="/logo.svg" alt="Logo Fiap" className="logo"/>
      <form>
        <div className="input">
          <img src="/mail.svg" alt="Logo Fiap"/>
          <input type="text" placeholder="Informe seu email"/>
        </div>
        <div className="input">
          <img src="/lock.svg" alt="Logo Fiap"/>
          <input type="password" placeholder="Informe sua senha"/>
        </div>
        <button type="button" className="button">Login</button>
      </form>
    </div>
  )
}

export default Home
