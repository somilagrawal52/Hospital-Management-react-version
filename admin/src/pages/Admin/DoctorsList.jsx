import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, token, getAllDoctors,changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (token) {
      getAllDoctors();
    }
  });
  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
        {
          doctors.map((item,index)=>( 
            <div className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group" key={index}>

              <img className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500" src={item.image} alt="" />
              <div className="p-4">
                <p className="text-[#262626] text-lg font-medium">Dr. {item.fullname}</p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available}/>
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default DoctorsList;
