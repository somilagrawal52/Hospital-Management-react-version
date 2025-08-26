import React from "react";
import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
const DoctorProfile = () => {
  const { dToken, profileData, setprofileData, getprofileData } =
    useContext(DoctorContext);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getprofileData();
    }
  }, [getprofileData, dToken]);

  return (
    <div>
      <div>
        <div>
          <img src={profileData?.image} alt="" />
        </div>
        <div>
          <p>{profileData?.name}</p>
          <div>
            <p>{profileData?.degree}-{profileData?.specialization}</p>
            <button>{profileData?.experience}</button>
          </div>
          <div>
            <p>About:</p>
            <p>{profileData?.about}</p>
          </div>
          <p>Appointment Fee: <span>${profileData?.appointmentFee}</span></p>
          <div>
            <p>Address:</p>
            <p>{profileData?.address.line1}
              <br />
            {profileData?.address.line2}</p>
          </div>
          <div>
            <input type="checkbox" name="availability" id="availability" />
            <label htmlFor="availability">Available</label>
          </div>
          <button>Edit</button>
          
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
