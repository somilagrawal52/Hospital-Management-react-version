import React, { useContext } from 'react'
import Login from './pages/login'
import { ToastContainer } from 'react-toastify';
import {AdminContext} from './context/AdminContext'
import {DoctorContext} from './context/DoctorContext'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import {Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Admin/DAshboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import Appointments from './pages/Admin/Appointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
const App = () => {
  const {token}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)
  return token || dToken ?(
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/all-appointments' element={<Appointments/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorsList/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
        </Routes>
      </div>
    </div>
  ):(
    <>
    <Login/>
    <ToastContainer/>
    </>
  )
}

export default App
