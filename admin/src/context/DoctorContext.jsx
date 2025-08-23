import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
    const [appointments, setAppointments] = useState([])

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
        fetchAppointments
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider