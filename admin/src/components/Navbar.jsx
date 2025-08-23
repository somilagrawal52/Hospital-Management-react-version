import  { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import{assets} from '../assets_admin/assets'
const Navbar = () => {
    const {token,setToken}=useContext(AdminContext)
    const  logout = () =>{
        token && setToken('')
    }
  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-b sm:px-10'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='cursor-pointer w-36 sm:w-40' src={assets.admin_logo} alt="" />  
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{token ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logout} className='px-10 py-2 text-sm text-white rounded-full bg-primary'>Logout</button>
    </div>
  )
}

export default Navbar
