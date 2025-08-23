/* eslint-disable react/prop-types */
import { createContext, useState,useEffect,useMemo,useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext =createContext()


const AdminContextProvider=(props)=>{
    const [token, setToken] = useState(() => {
        // Get token from localStorage or cookies, prefer localStorage
        return localStorage.getItem('aToken') || Cookies.get('token') || "";
    });
    const[doctors,setDoctors]=useState([])
    const [adminAppointments, setAdminAppointments] = useState([]);
    const [adminData, setAdminData] = useState(null);
    const [dashData,setdashData]=useState(false)
    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    // Update checkAuth to handle both token sources
    const checkAuth = async () => {
        try {
            const storedToken = localStorage.getItem('aToken');
            const cookieToken = Cookies.get('token');
            const activeToken = storedToken || cookieToken;

            console.log("Checking auth with token:", activeToken);

            if (activeToken) {
                setToken(activeToken);
                // Also store in localStorage if it came from cookie
                if (!storedToken && cookieToken) {
                    localStorage.setItem('aToken', cookieToken);
                }
                await fetchAdminData(activeToken);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            toast.error("Authentication failed");
        }
    };

    const fetchAdminData = async (token) => {
        try {
          const response = await axios.get(`${backendUrl}/admin-profile`, {
            headers: {token}});
          if (response.data.success) {
            setAdminData(response.data.admindata);
          } else {
            console.error(response.data.message);
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error);
        }
      };
    

    useEffect(() => {
        if (!token) {
            checkAuth();
        }
    }, [backendUrl, token]);

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/doctors', { headers: { token } });
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const changeAvailability = async (doctorId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/change-availability`, { doctorId },
                { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getAdminAppointments = useCallback(async () => {
        // Prevent duplicate calls with a loading flag
        if (getAdminAppointments.isLoading) return;
        
        try {
            getAdminAppointments.isLoading = true;
            const response = await axios.get(`${backendUrl}/admin-appointments`, {
                headers: { 'Token': token },
                withCredentials: true
            });

            if (response.data.success) {
                setAdminAppointments(response.data.appointments || []);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setAdminAppointments([]); 
        } finally {
            getAdminAppointments.isLoading = false;
        }
    }, [backendUrl, token]);

    const getAdminDashboard = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/admin-dashboard`, {
                headers: { token }
            });
            if (data.success) {
                setdashData(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch appointments only when token changes
    useEffect(() => {
        if (token) {
            getAdminAppointments();
        }
    }, [token]); // Remove getAdminAppointments from dependencies

    // Update value memo to include all dependencies
    const value = useMemo(() => ({
        token,
        setToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        adminData,
        adminAppointments,
        dashData,
        getAdminDashboard,
        getAdminAppointments
    }), [
        token,
        backendUrl,
        doctors,
        adminData,
        adminAppointments,
        dashData,
        getAdminDashboard,
        // Note: Functions don't need to be dependencies unless they're passed down
    ]);
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;