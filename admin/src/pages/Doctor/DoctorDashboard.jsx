import React from "react";
import { useContext, useEffect } from "react";
import {assets} from "../../assets_admin/assets.js";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
const DoctorDashboard = () => {
  const { dToken, Dashdata, getDashData, setDashdata, cancelAppointment, completeAppointment } =
    useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
     (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 p-4 transition-all bg-white border-2 rounded cursor-pointer item-center min-w-52 border-grey-100 hover:scale-105">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {Dashdata?.earnings || 0}
              </p>
              <p className="text-gray-400">Earning</p>
            </div>
          </div>
          <div className="flex gap-2 p-4 transition-all bg-white border-2 rounded cursor-pointer item-center min-w-52 border-grey-100 hover:scale-105">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {Dashdata?.totalAppointments || 0}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex gap-2 p-4 transition-all bg-white border-2 rounded cursor-pointer item-center min-w-52 border-grey-100 hover:scale-105">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {Dashdata?.totalUsers || 0}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0">
            {Dashdata.latestAppointments &&
            Dashdata.latestAppointments.length > 0 ? (
              Dashdata.latestAppointments.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center gap-3 px-4 py-3 border-b"
                >
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={item.docData?.image}
                    alt=""
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.docData?.name || "Unknown Doctor"}
                    </p>
                    <p className="text-sm text-gray-500">{item.slotDate}</p>
                  </div>
                  {
                        item.cancelled?<p>Cancelled</p>:
                        item.completed?<p>Completed</p>:<div>
                        <img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} alt="" />
                        <img onClick={() => completeAppointment(item._id)} src={assets.tick_icon} alt="" />
                    </div>
                    }
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No recent appointments
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
