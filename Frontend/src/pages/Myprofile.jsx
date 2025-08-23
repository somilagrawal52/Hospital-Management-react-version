import { useState,useEffect } from 'react'
import { useContext } from 'react'
import { assets } from '../assets/assets'
import{AppContext} from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
function Myprofile() {
  const{userData,setUserData,token,loaduserprofile,backendUrl}=useContext(AppContext)

  const [isEdit,setIsEdit]=useState(false)
  const[image,setImage]=useState(false)

  const updateUserProfile=async()=>{
    try {
      const formData=new FormData()
      formData.append('fullname',userData.fullname)
      formData.append('email',userData.email)
      formData.append('number',userData.number)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('dob',userData.dob)
      formData.append('gender',userData)
      
      image && formData.append('image',image)
      const{data}= await axios.post(backendUrl +'/update-profile',formData,{withCredentials:true,headers:{token}});

      if(data.success){
        toast.success(data.message)
        setIsEdit(false)
        await loaduserprofile()
        setImage(false)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    // console.log('User data in Myprofile:', userData); // Debugging line
    loaduserprofile();
  }, [loaduserprofile]);

  return userData &&(
    <div className='flex flex-col max-w-lg gap-2 text-sm'>
      {
        isEdit
        ? <label htmlFor="image">
          <div className='relative inline-block cursor-pointer'>
          <img className='rounded opacity-75 w-36' 
                  src={image ? URL.createObjectURL(image) : (userData.image ? `${import.meta.env.VITE_BACKEND_URL}/images/${userData.image.replace(/^\/img\//, '')}` : assets.default_profile_image)} 
                  alt="" 
                />
          <img className='absolute w-10 bottom-12 right-12' src={image?'':assets.upload_icon} alt="" />
          </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden/>
        </label>
        :<img 
        className='rounded w-36' 
        src={userData.image ? `${import.meta.env.VITE_BACKEND_URL}/images/${userData.image.replace(/^\/img\//, '')}` : assets.default_profile_image} 
        alt="" 
      />
      }
      
      {
        isEdit?<input className='mt-4 text-3xl font-medium bg-gray-50 max-w-60' type="text" value={userData.fullname} onChange={e=>setUserData(prev=>({...prev,fullname:e.target.value}))}/>: <p className='mt-4 text-3xl font-medium text-neutral-800'>{userData.fullname}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none'/>
      <div>
        <p className='mt-3 underline text-neutral-500'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          {
        isEdit?<input className='bg-gray-100 max-w-52' type="email" value={userData.email} onChange={e=>setUserData(prev=>({...prev,email:e.target.value}))}/>: <p className='text-blue-500'>{userData.email}</p>
      }
          <p className='font-medium'>Phone:</p>
          {
        isEdit?<input className='bg-gray-100 max-w-52' type="number" value={userData.number} onChange={e=>setUserData(prev=>({...prev,number:e.target.value}))}/>: <p className='text-blue-400'>{userData.number}</p>
      }
      <p className='font-medium'>Address:</p>
      {
        isEdit?<p>
          <input className='bg-gray-50'  type="text" value={userData.address.line1} onChange={e=>setUserData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}/>
        <br />
        <input className='bg-gray-50' type="text" value={userData.address.line2} onChange={e=>setUserData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}/></p>: <p className='text-gray-500'>{userData.address.line1} <br />
        {userData.address.line2}</p>
      }
        </div>
      </div>
      <div>
        <p className='mt-3 underline text-neutral-500'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
        isEdit?<select className='bg-gray-200 max-w-20' onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))} value={userData.gender}><option value="Male">Male</option>
        <option value="Female">Female</option></select>: <p className='text-gray-400'>{userData.gender}</p>
      }
      <p className='font-medium'>Birthday:</p>
      {
        isEdit
        ? <input className='bg-gray-200 max-w-20' type="date" onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))} value={userData.dob}/>
        : <p className='text-gray-400'>{userData.dob}</p>
      }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit
          ?<button className='px-8 py-2 transition-all border rounded-full border-primary hover:bg-primary hover:text-white' onClick={updateUserProfile}>Save Information</button>
          : <button className='px-8 py-2 transition-all border rounded-full border-primary hover:bg-primary hover:text-white' onClick={()=>setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}
export default Myprofile