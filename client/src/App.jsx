import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import SignUpPage from './pages/sign-up';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;