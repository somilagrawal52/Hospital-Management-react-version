import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/login'
import Myappointment from './pages/Myappointment'
import Myprofile from './pages/Myprofile'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Fotter from './components/Fotter'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/doctors' element={<Doctors/>}/>
         <Route path='/doctors/:speciality' element={<Doctors/>}/>
         <Route path='/about' element={<About/>}/>
         <Route path='/contact' element={<Contact/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/my-appointment' element={<Myappointment/>}/>
         <Route path='/appointment/:docId' element={<Appointment/>}/>
         <Route path='/patient-profile' element={<Myprofile/>}/>
      </Routes>
      <Fotter/>
    </div>
  )
}

export default App
