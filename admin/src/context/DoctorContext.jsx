import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
    const [appointments, setAppointments] = useState([])
    const [Dashdata, setDashdata] = useState(false)
    const [profileData,setprofileData]=useState(false)
    // Fetch appointments for the logged-in doctor
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${backendUrl}/doctor-appointments`, {
                headers: {
                    'Authorization': `Bearer ${dToken}`
                }
            });
            const data = response.data;
            if (data.success) {
                setAppointments(data.appointments);
            } else {
                console.error("Failed to fetch appointments");
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const response = await axios.post(`${backendUrl}/appointment-complete`, { appointmentId }, {
                headers: {
                    'Authorization': `Bearer ${dToken}`
                }
            });
            const data = response.data;
            if (data.success) {
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment._id === appointmentId ? { ...appointment, status: "completed" } : appointment
                    )
                );
            } else {
                console.error("Failed to complete appointment");
            }
        } catch (error) {
            console.error("Error completing appointment:", error);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await axios.post(`${backendUrl}/appointment-cancel`, { appointmentId }, {
                headers: {
                    'Authorization': `Bearer ${dToken}`
                }
            });
            const data = response.data;
            if (data.success) {
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment._id === appointmentId ? { ...appointment, status: "cancelled" } : appointment
                    )
                );
            } else {
                console.error("Failed to cancel appointment");
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
        }
    };

    const getDashData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/doctor-dashboard`, {
                headers: {
                    'Authorization': `Bearer ${dToken}`
                }
            });
            const data = response.data;
            if (data.success) {
                setDashdata(data.Dashdata)
                console.log("DashData:", data.Dashdata)
            } else {
                console.error("Failed to fetch dashboard data");
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const getprofileData=async () => {
        try {
            const response = await axios.get(`${backendUrl}/doctor-profile`, {
                headers: {
                    'Authorization': `Bearer ${dToken}`
                }
            });
            const data = response.data;
            if (data.success) {
                setprofileData(data.doctorData);
                console.log("Profile Data:", data.doctorData);
            } else {
                console.error("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    }

    // Sync token with localStorage whenever it changes
    useEffect(() => {
        if (dToken) {
            localStorage.setItem('dToken', dToken)
        } else {
            localStorage.removeItem('dToken')
        }
    }, [dToken])

    const value = {
        dToken,
        setDToken,
        backendUrl,
        appointments,
        setAppointments,
        fetchAppointments,
        profileData,
        getprofileData,
        setprofileData,
        completeAppointment,
        cancelAppointment,
        Dashdata,
        getDashData,
        setDashdata
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider