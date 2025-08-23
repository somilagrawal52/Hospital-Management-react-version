import  { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData, setUserData, backendUrl } = useContext(AppContext);
  
  const fetchUserProfile = async () => {
    if (!token) return;
    console.log('Fetching user profile with token:', token);

    try {
      const response = await axios.get(`${backendUrl}/patient-profile`, {headers:{Token:token},withCredentials: true});
      console.log('Response from server:', response); // Debugging line
      if (response.data.success) {
        setUserData(response.data.patientdata);
        console.log('User data set:', response.data.patientdata); // Debugging line
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const tokenFromCookies = localStorage.getItem('Token');
    console.log('Token from cookies:', tokenFromCookies); // Debugging line
    if (tokenFromCookies) {
      setToken(tokenFromCookies);
    }else {
      console.warn('No token found in cookies.');
  }
  }, [setToken]);
  
  useEffect(() => {
    if (token) {
        fetchUserProfile();
    }else{
      setUserData(null);
    }
}, [token,setUserData]);

  const logout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  

  return (
    <div className='flex items-center justify-between py-4 mb-5 text-sm font-bold border-b border-b-gray-400'>
      <img onClick={() => navigate('/')} className='cursor-pointer w-44' src={assets.logo} alt="" />
      <ul className='flex items-start gap-5'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-4'>
        {token ? (
          <div className='relative flex items-center gap-2 cursor-pointer group'>
            <img className='w-10 rounded-full' src={userData?.image ? `${backendUrl}/images/${userData.image.replace(/^\/img\//, '')}` : assets.default_profile_image} alt="profile_pic" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
            <div className='absolute top-0 right-0 z-20 hidden text-base font-medium text-gray-600 pt-14 group-hover:block'>
              <div className='flex flex-col gap-4 p-4 rounded min-w-48 bg-stone-100'>
                <p onClick={() => navigate('/patient-profile')} className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => navigate('/my-appointment')} className='cursor-pointer hover:text-black'>My Appointments</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='px-8 py-3 font-light text-white rounded-full bg-primary'>Create Account</button>
        )}
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
        {/* mobile menu */}
        <div className={`${showMenu ? 'fixed-w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 px-5 mt-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to={'/'}>Home</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={'/doctors'}>All Doctors</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={'/about'}>About</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={'/contact'}>Contact</NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;