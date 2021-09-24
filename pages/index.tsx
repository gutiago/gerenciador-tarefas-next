import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="container-login">
      <img src="/logo.svg" alt="Logo Fiap"/>
      <form>
        <div className="input">
          <img src="/mail.svg" alt="Logo Fiap"/>
          <input type="text" />
        </div>
        <div className="input">
          <img src="/lock.svg" alt="Logo Fiap"/>
          <input type="password" />
        </div>
        <button type="button">Login</button>
      </form>
    </div>
  )
}

export default Home
