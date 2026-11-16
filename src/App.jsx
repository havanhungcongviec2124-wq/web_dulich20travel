import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Foodter from './components/Foodter'

const App = () => {
  return (
    <div >
      <Header />
      <Outlet />
      <Foodter />
    </div>
  )
}

export default App