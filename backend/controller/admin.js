const User = require("../models/user");
const path = require("path");
const Appointment = require("../models/appointment");
const frontendPath = path.resolve(__dirname, "..", "..", "frontend", "Admin");


async function adminloginfromdb(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchpassword(email, password);
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });
  }
}

async function adminlogout(req, res) {
  res.clearCookie("token").redirect("/admin/login");
}

async function showallmsg(req, res) {
  return res.sendFile(path.join(frontendPath, "messages.html"));
}

async function adminAppointment(req, res) {
  const requestId = Date.now();
  
  try {
    // Get appointments with populated user and doctor data
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate('userid', 'fullname email')
      .populate('docId', 'fullname speciality')
      .lean();

    // Log only essential information
    console.log(`[${requestId}] Fetched ${appointments.length} appointments for admin`);

    // Set cache control headers
    res.set('Cache-Control', 'private, max-age=30');
    res.set('ETag', `W/"appointment-${appointments.length}"`);
    
    return res.status(200).json({ 
      success: true, 
      appointments,
      total: appointments.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`[${requestId}] Appointment fetch error:`, error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Error fetching appointments",
      error: error.message
    });
  }
}

const adminDashboard=async (req, res) => {
  try {
    // Fetch necessary data for the dashboard
    const totalAppointments = await Appointment.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });

    return res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        totalDoctors,
        totalUsers,
        latestAppointments: await Appointment.find().sort({ createdAt: -1 }).limit(5).lean()
      }
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};

module.exports = {
  adminloginfromdb,
  adminlogout,
  adminAppointment,
  showallmsg,
  adminDashboard
};
