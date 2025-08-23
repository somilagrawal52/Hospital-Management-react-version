import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
  const { backendUrl, setToken, token } = useContext(AppContext);
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setName] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (state === 'Sign Up') {
        response = await axios.post(
          `${backendUrl}/register`,
          { fullname, email, password },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/login`,
          { email, password },
          { withCredentials: true }
        );
      }

      const { data } = response;
      if (data.success) {
        localStorage.setItem('Token', data.token); // Save the token
        setToken(data.token); // Update context
        toast.success(`${state} Successful!`);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p>Please {state === 'Sign Up' ? 'Sign Up' : 'Login'} to book an appointment</p>
        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="w-full p-2 mt-1 border rounded border-zinc-300"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={fullname}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="w-full p-2 mt-1 border rounded border-zinc-300"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="w-full p-2 mt-1 border rounded border-zinc-300"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button type="submit" className="w-full py-2 text-base text-white rounded-md bg-primary">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className="underline cursor-pointer text-primary"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className="underline cursor-pointer text-primary"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default Login;
