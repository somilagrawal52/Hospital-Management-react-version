/* eslint-disable react/prop-types */
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const [backendUrl] = useState(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000");
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem('Token') || null
  );
  const [userData, setUserData] = useState(null);

  // Set up axios defaults when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('Token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('Token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/doctors`, {
        headers: { token },
      });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, token]);

  const loaduserprofile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/patient-profile`, {
        headers: { token },
        withCredentials: true,
      });
      if (response.data.success) {
        setUserData(response.data.patientdata);
        console.log('User data sent to frontend:', response.data.patientdata); // Debugging line
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    if (token) {
      loaduserprofile();
    } else {
      setUserData(null);
    }
  }, [loaduserprofile, token]);

  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  const value = useMemo(
    () => ({
      doctors,
      currencySymbol,
      getDoctorsData,
      token,
      setToken,
      backendUrl,
      userData,
      setUserData,
      loaduserprofile,
    }),
    [backendUrl, doctors, getDoctorsData, loaduserprofile, token, userData]
  );

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
