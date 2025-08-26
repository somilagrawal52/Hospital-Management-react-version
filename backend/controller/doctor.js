const User = require("../models/user");
const path = require("path");
const { mailsender } = require("./mail");
const Appointment=require("../models/appointment");
const frontendPath = path.resolve(__dirname, "..", "..", "admin","public");
// const frontendDoctor = path.resolve(
//   __dirname,
//   "..",
//   "..",
//   "frontend",
//   "doctor"
// );

const multer = require("multer");
const { messages } = require("./patient");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve(frontendPath, "img"));
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

async function doctorsregistration(req, res) {
  return res.sendFile(path.join(frontendPath, "doctors-registration.html"));
}

// async function doctorsloginpage(req, res) {
//   return res.sendFile(path.join(frontendDoctor, "doctors-login.html"));
// }
async function Doctorappointmentdetailtable(req, res) {
  try {
    const userid = req.user._id; // Use req.user._id from the authentication middleware
    console.log("User ID:", userid);
    const appointments = await Appointment.find({ userid });
    console.log("Appointments:", appointments);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function doctorDashboard(req, res) {
  try {
    const userId = req.user._id;
    const doctor = await User.findById(userId);
    const appointments = await Appointment.find({ docId: userId });
    let earnings=0;
    appointments.map((item) => {
      earnings += item.fees;
    });
    let patients=[]
    appointments.map((item)=>{
      patients.push(item.patientId);
    });

    const dashData={
      earnings,
      patients:patients.length,
      appointments:appointments.length,
      latestAppointments:appointments.slice(-5)
    }
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Error fetching doctor dashboard:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function doctorsdetailtable(req, res) {
  try {
    const doctors = await User.find({ role: "DOCTOR" }).select('-password');
    res.json({success:true,doctors});
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Server error");
  }
}

async function doctorsdashboard(req, res) {
  return res.sendFile(path.join(frontendDoctor, "doctor-dashboard.html"));
}

async function doctorsregistrationtodb(req, res) {
  const {
    fullname,
    email,
    password,
    degree,
    experience,
    about,
    fees,
    address,
    speciality,
  } = req.body;
  try {
    // Ensure req.file is logged for debugging
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).send("Image file is required");
    }

    const newDoctor = await User.create({
      fullname,
      email,
      password,
      degree,
      experience,
      about,
      fees,
      date:Date.now(),
      address:JSON.parse(address),
      speciality,
      image: `/img/${req.file.filename}`,
      role: "DOCTOR",
    });
    console.log("Doctor created successfully");
    res.status(201).json({ success: true, message: "Doctor registered successfully" });
    const obj = {
      to: email,
      subject: "Welcome Message!",
      text: `Welcome to OneLife, ${fullname}!`,
    };
    await mailsender(obj);
    return res.status(200).json({
      success: true,
      message: "Doctor registered successfully",
    });
  } catch (error) {
    console.error("Error during doctor registration:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function doctorloginfromdb(req, res) {
  const { email, password } = req.body;
  console.log("doctor email:", email);
  
  try {
    const doctor = await User.findOne({ email: email });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    const doctorname = doctor.fullname;
    const token = await User.matchpassword(email, password);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    console.log("Created Token:", token);
    
    // Set cookie
    res.cookie("doctorname", doctorname);
    
    return res.status(200).json({
      success: true,
      token: token,
      message: "Doctor login successful",
      doctorname: doctorname
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
}

const appointmentComplete = async (req, res) => {
  const { appointmentId } = req.body;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    appointment.isCompleted = true;
    await appointment.save();
    res.json({ success: true, message: "Appointment marked as completed" });
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const appointmentCancel = async (req, res) => {
  const { appointmentId } = req.body;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    appointment.cancelled = true;
    await appointment.save();
    res.json({ success: true, message: "Appointment marked as cancelled" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

async function doctorsdetailpage(req, res) {
  return res.sendFile(path.join(frontendPath, "doctors-detail.html"));
}

async function doctorlogout(req, res) {
  res.clearCookie("token").redirect("/doctorlogin");
}

async function changeAvailability(req,res) {
  try {
    const{doctorId}=req.body
    const docData=await User.findById(doctorId)
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    await User.findByIdAndUpdate(doctorId,{available:!docData.available})
    res.json({success:true,message:'availability changed'})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

async function DoctorProfile(req, res) {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = validatetoken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    const doctorData = await User.findById(decoded._id).select("-password");
    if (!doctorData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, doctorData, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching doctor data" });
  }
}

async function UpdateDoctorProfile(req, res) {
  try {
    const token = req.headers.token;
    const decoded = validatetoken(token);
    const { fullname, email, number, address, dob, gender } = req.body;
    console.log("Address value:", address);
    let parsedAddress;
    if (address) {
      try {
        parsedAddress = JSON.parse(address);
      } catch (parseError) {
        console.error("Error parsing address:", parseError);
        return res.status(400).json({ success: false, message: "Invalid address format" });
      }
    }
    const updateData = {
      fullname,
      number,
      address: parsedAddress,
      email,
      image: req.file ? `/img/${req.file.filename}` : undefined,
      dob,
      gender
    };
    console.log("Update data:", updateData);

    const result = await User.findByIdAndUpdate(
      { _id: decoded._id },
      updateData,
      { new: true } // Return the updated document
    );

    // Log the result of the update operation
    console.log("Update result:", result);

    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({success:true,message:"Profile updated successfully",token})
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating" });
  }
}


module.exports = {
  doctorsregistration,
  doctorsdetailtable,
  doctorsregistrationtodb,
  doctorsdetailpage,
  doctorsdashboard,
  Doctorappointmentdetailtable,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  DoctorProfile,
  UpdateDoctorProfile,
  // doctorsloginpage,
  doctorloginfromdb,
  changeAvailability,
  doctorlogout,
};
