import { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Get contexts for both admin and doctor
    const { token: aToken, setToken: setAToken, backendUrl: adminBackendUrl } = useContext(AdminContext);
    const { dToken, setDToken, backendUrl: doctorBackendUrl } = useContext(DoctorContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log('Form submitted', { email, password, state });
        
        try {
            const endpoint = state === 'Admin' ? '/admin/login' : '/doctorlogin';
            const backendUrl = state === 'Admin' ? adminBackendUrl : doctorBackendUrl;
            const currentToken = state === 'Admin' ? aToken : dToken;

            const { data } = await axios.post(
                `${backendUrl}${endpoint}`,
                { email, password },
                { 
                    withCredentials: true,
                    headers: currentToken ? { token: currentToken } : {}
                }
            );

            if (data.success) {
                const tokenKey = state === 'Admin' ? 'aToken' : 'dToken';
                console.log(`Setting ${tokenKey}: ${data.token}`);
                
                // Store token in localStorage with correct key
                localStorage.setItem(tokenKey, data.token);
                
                // Update the correct context state
                if (state === 'Admin') {
                    setAToken(data.token);
                } else {
                    setDToken(data.token);
                }
                
                toast.success(`${state} Login Successful!`);
                // navigator('/admin-dashboard') or navigate to appropriate dashboard
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='m-auto text-2xl font-semibold'>
                    <span className='text-primary'>{state} </span> Login
                </p>
                <div className='w-full '>
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                        type="email" 
                        required
                    />
                </div>
                <div className='w-full '>
                    <p>Password</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                        type="password" 
                        required
                    />
                </div>
                <button className='w-full py-2 text-base text-white rounded-md bg-primary'>
                    Login
                </button>
                {
                    state === 'Admin' ? 
                    <p>Doctor Login? <span className='underline cursor-pointer text-primary' onClick={() => setState('Doctor')}>Click here</span></p> : 
                    <p>Admin Login? <span className='underline cursor-pointer text-primary' onClick={() => setState('Admin')}>Click here</span></p>
                }
            </div>
        </form>
    )
}

export default Login