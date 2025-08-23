import { useContext, useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
function Appointment() {
  const {docId}=useParams()
  const{doctors,currencySymbol,backendUrl,token,getDoctorsData}=useContext(AppContext)
  const daysofweek=['SUN','MON','TUE','WED','THU','FRI','SAT']
  const[docInfo,setDocInfo]=useState(null)
  const[docslots,setdocslots]=useState([])
  const[slotindex,setSlotindex]=useState(0)
  const[slottime,setSlottime]=useState('')
  const navigate=useNavigate()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDocInfo=async()=>{
    const docInfo=doctors.find(doc=>doc._id===docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }
  
  const getAvailableSlots = async () => {
    setdocslots([]);
    let today = new Date();
    const bookedSlots = docInfo?.slots_booked || {};

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endtime = new Date(currentDate);
      endtime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endtime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const slotDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        
        // Only add if slot is not booked
        if (!bookedSlots[slotDate]?.includes(formattedTime)) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        setdocslots(prev => [...prev, timeSlots]);
      }
    }
  }

  const bookAppointment=async()=>{
    if(!token){
      toast.warn('Please login to book an appointment')
      return navigate('/login')
    }
    try {
      const date=docslots[slotindex][0].datetime
      let day=date.getDate()
      let month=date.getMonth()+1
      let year=date.getFullYear()

      const slotDate=`${year}-${month}-${day}`
      console.log(slotDate)
      const response=await axios.post(`${backendUrl}/appointment`,{docId,slotDate,slottime},{
        headers: { Token: token }, // Pass token in headers
        withCredentials:true
      })
      if(response.data.success){
        toast.success(response.data.message)
        getDoctorsData()
        navigate('/my-appointment')
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  
  useEffect(()=>{
    fetchDocInfo()
  },[doctors, docId, fetchDocInfo])
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);
  useEffect(()=>{
    console.log(docslots)
  },[docslots])

  return docInfo && (
    <div>
      {/* doctor details */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div>
          
          <img className="w-full rounded-lg bg-primary sm:max-w-72" src={`${import.meta.env.VITE_BACKEND_URL}/images/${docInfo.image.replace(/^\/img\//, '')}`} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* docinfo */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.fullname} <img className='w-5' src={assets.verified_icon} alt="" /></p>
          <div className='flex items-center gap-2 mt-1 text-sm text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/* doctor about */}
          <div>
            <p className='flex items-center gap-1 mt-3 text-sm font-medium text-gray-900'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1 '>{docInfo.about}</p>
          </div>
          <p className='mt-4 font-medium text-gray-500'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>
      {/* BOOKING SLOTS */}
      <div className='mt-4 font-medium text-gray-700 sm:ml-72 sm:pl-4'>
        <p>Booking Slots</p>
        {docslots.length === 0 ? (
          <p className="mt-4 text-gray-500">No available slots for the next 7 days</p>
        ) : (
          <>
            <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
              {docslots.map((item, index) => (
                <div 
                  onClick={() => setSlotindex(index)} 
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotindex === index ? 'bg-primary text-white' : 'border border-gray-200'
                  }`} 
                  key={index}
                > 
                  <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
            </div>
            <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
              {docslots[slotindex]?.map((item, index) => (
                <p 
                  onClick={() => setSlottime(item.time)} 
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slottime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'
                  }`} 
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
            </div>
            <button 
              onClick={bookAppointment} 
              disabled={!slottime}
              className={`py-3 my-6 text-sm font-light rounded-full px-14 ${
                slottime ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Book an appointment
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default Appointment