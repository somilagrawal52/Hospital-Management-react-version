import React from 'react'
import axios from 'axios'
import {AdminContext} from '../../context/AdminContext'
import {toast} from 'react-toastify'
import {assets} from '../../assets_admin/assets.js'
import{useContext,useEffect,useState} from 'react'

const Dashboard = () => {
  const {token,adminAppointments,getAdminDashboard,getAdminAppointments,dashData,backendUrl}=useContext(AdminContext)
  const [localAppointments, setLocalAppointments] = useState(adminAppointments);
  const [isLoading, setIsLoading] = useState(false);

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
  
  useEffect(() => {
    const fetchData = async () => {
      if (token && !isLoading) {
        setIsLoading(true);
        try {
          await getAdminDashboard();
        } catch (error) {
          toast.error("Failed to load dashboard data");
        } finally {
          setIsLoading(false);
        }
      } else if (!token) {
        toast.error("Please login first");
      }
    };

    fetchData();
  }, [token]); // Only depend on token

  // Show loading state while data is being fetched
  if (isLoading || !dashData) {
    return (
      <div className='m-5'>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex gap-2 p-4 transition-all bg-white border-2 rounded cursor-pointer item-center min-w-52 border-grey-100 hover:scale-105'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.totalDoctors || 0}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>
        <div className='flex gap-2 p-4 transition-all bg-white border-2 rounded cursor-pointer item-center min-w-52 border-grey-100 hover:scale-105'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.totalAppointments || 0}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex gap-2 p-4 transition-all bg-white border-2 rounded cursor-pointer item-center min-w-52 border-grey-100 hover:scale-105'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.totalUsers || 0}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div key={item._id || index} className='flex items-center gap-3 px-4 py-3 border-b'>
                  <img 
                    className='object-cover w-12 h-12 rounded-full' 
                    src={item.docData?.image} 
                    alt="" 
                  />
                  <div className='flex-1'>
                    <p className='font-medium'>{item.docData?.name || 'Unknown Doctor'}</p>
                    <p className='text-sm text-gray-500'>{item.slotDate}</p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-xs font-medium text-red-400">Cancelled</p>
                  ) : (
                    <button 
                      onClick={() => handleCancelAppointment(item._id)}
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
              ))
            ) : (
              <div className='p-4 text-center text-gray-500'>
                No recent appointments
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard