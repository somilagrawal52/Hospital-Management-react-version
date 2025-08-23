import React from 'react'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify';
import {assets} from '../../assets_admin/assets.js';

const Appointments = () => {
  const { token, adminAppointments, getAdminAppointments, backendUrl } = useContext(AdminContext);
  const [localAppointments, setLocalAppointments] = useState(adminAppointments);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.get(`${backendUrl}/cancel-appointment`, {
        params: { appointmentId },
        headers: { Token: token },
      });

      if (response.data.success) {
        // Update local state immediately
        setLocalAppointments(prev => 
          prev.map(apt => 
            apt._id === appointmentId 
              ? { ...apt, cancelled: true }
              : apt
          )
        );
        toast.success('Appointment cancelled successfully');
        // Refresh the full list
        await getAdminAppointments();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Error cancelling appointment');
    }
  };
  
  // Update local appointments when adminAppointments changes
  useEffect(() => {
    setLocalAppointments(adminAppointments);
  }, [adminAppointments]);

  // Initial fetch
  useEffect(() => {
    if (token) {
      getAdminAppointments();
    } else {
      toast.error("Please login first");
    }
  }, [token, getAdminAppointments]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <h2 className='mb-3 text-lg font-medium'>All Appointments ({localAppointments.length})</h2>
      <div className='text-sm bg-white border rounded max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='grid hidden sm:grid-cols-[0.5fr_1fr_1fr_1.5fr_1fr_1fr_0.5fr] gap-3 p-3 font-medium border-b sm:grid'>
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fee</p>
          <p>Actions</p>
        </div>
        {localAppointments.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p>No appointments found</p>
          </div>
        ) : (
          localAppointments.map((appointment, index) => (
            <div key={appointment._id} className="grid sm:grid-cols-[0.5fr_1fr_1fr_1.5fr_1fr_1fr_0.5fr] gap-3 p-3 border-b hover:bg-gray-50">
              <p>{index + 1}</p>
              <div>
                <img src={appointment.userdata?.profilePicture || ''} alt="" />
                <p>{appointment.userdata?.fullname || 'N/A'}</p>
              </div>
              <p>{appointment.userdata?.age || 'N/A'}</p>
              <p>{`${appointment.slotDate} | ${appointment.slottime}`}</p>
              <p>{appointment.doctordata?.fullname || 'N/A'}</p>
              <p>₹{appointment.amount}</p>
              <div className="flex justify-center">
                {appointment.cancelled ? (
                  <p className="text-xs font-medium text-red-400">Cancelled</p>
                ) : (
                  <button 
                    onClick={() => handleCancelAppointment(appointment._id)}
                    className="flex items-center justify-center hover:opacity-70"
                  >
                    <img 
                      className='w-10 cursor-pointer' 
                      src={assets.cancel_icon} 
                      alt="Cancel appointment" 
                    />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Appointments
