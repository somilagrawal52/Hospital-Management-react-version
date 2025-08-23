import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Myappointment() {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointment] = useState([]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.get(`${backendUrl}/cancel-appointment`, {
        params: { appointmentId }, // Ensure this is being passed correctly
        headers: { Token: token },
      });

      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        getAppointment(); // Refresh the appointments list
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Error cancelling appointment');
    }
  };
  const handlePayOnline = async (appointmentId) => {
    try {
      const response = await axios.post(`${backendUrl}/pay-online`, { appointmentId }, {
        headers: { Token: token },
      });

      if (response.data.success) {
        toast.success('Payment successful');
        getAppointment();
      }
    } catch (error) {
      console.error(error);
      toast.error('Error processing payment', error.message);
    }
  };
  const getAppointment = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/appointments`, {
        headers: { Token: token },
        withCredentials: true,
      });

      if (response.data.success) {
        setAppointment(response.data.appointments.reverse());
        console.log(response.data.appointments); // Debugging log
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching appointments', error.message);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    if (token) {
      getAppointment();
    }
  }, [getAppointment, token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">My appointments ({appointments.length})</p>
      <div>
        {appointments.map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b" key={index}>
            <div>
              <img
                className="w-36 bg-[#EAEFFF]"
                src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.doctordata.image.replace(/^\/img\//, '')}`}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">Dr. {item.doctordata.fullname}</p>
              <p>{item.doctordata.speciality}</p>
              <p className="text-[#464646] font-medium mt-1">Address:</p>
              <p>{item.address.line1}</p>
              <p>{item.address.line2}</p>
              <p className="mt-1 ">
                <span className="text-sm text-[#faadad] font-medium">Date & Time: </span>
                25,July,2024 | 8:30 PM
              </p>
            </div>
            <div></div>
            <div className="flex flex-col justify-end gap-2 text-sm text-center">
              {!item.cancelled && !item.paid && <button onClick={() => handlePayOnline(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                Pay Online
              </button>}
              {!item.cancelled && item.paid && <button disabled className="py-2 text-green-600 border border-green-600 rounded cursor-not-allowed sm:min-w-48">Paid</button>}
              {!item.cancelled && <button onClick={() => handleCancelAppointment(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                Cancel Appointment
              </button>}
              {item.cancelled && <button disabled className="py-2 text-red-600 border border-red-600 rounded cursor-not-allowed sm:min-w-48">Appointment Cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Myappointment;