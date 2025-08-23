import React from 'react'
import { useContext, useEffect } from 'react'
import { assets } from '../../assets_admin/assets'
import { DoctorContext } from '../../context/DoctorContext'
const DoctorAppointments = () => {

    const { dToken, appointments, fetchAppointments } = useContext(DoctorContext);

    useEffect(() => {
        if(dToken) {
            fetchAppointments();
        }
    }, [dToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='text-sm bg-white border rounded max-h-[80vh] overflow-y-scroll min-h-[50vh]'>
        <div className='grid max-sm:hidden grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fee</p>
            <p>Action</p>
        </div>
        {
            appointments.map((item,index)=>{
                <div key={index}>
                    <p>{index+1}</p>
                    <div>
                        <img src={item.userData.image} alt="" /><p>{item.userData.name}</p>
                    </div>
                    <div>
                        <p>
                            {item.payment?'Online':'Cash'}
                        </p>
                    </div>
                    <p>{item.age}</p>
                    <p>{item.slotDate},{item.slotTime}</p>
                    <p>{item.fee}</p>
                    <div>
                        <img src={assets.cancel_icon} alt="" />
                        <img src={assets.tick_icon} alt="" />
                    </div>
                </div>
            })
        }
      </div>
    </div>
  )
}

export default DoctorAppointments
