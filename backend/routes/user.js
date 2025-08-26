const express = require("express");
const router = express.Router();
const path = require("path");
const {
  getallcities,
  getallcountries,
  getallstates,
} = require("../controller/address");
const {
  adminloginfromdb,
  adminlogout,
  adminAppointment,
  showallmsg,
  adminDashboard
} = require("../controller/admin");
const {
  doctorsregistration,
  doctorsdetailtable,
  doctorsregistrationtodb,
  doctorsdetailpage,
  doctorsdashboard,
  doctorsloginpage,
  doctorloginfromdb,
  doctorlogout,
  DoctorProfile,
  UpdateDoctorProfile,
  appointmentComplete,
  appointmentCancel,
  changeAvailability,
  Doctorappointmentdetailtable,
  doctorDashboard
} = require("../controller/doctor");
const {
  doctors,
  messages,
  home,
  bookappointment,
  appointmentdetailtable,
  sendmsg,
  messagesdetailtable,
  savePayments,
  patientregistrationtodb,
  patientloginfromdb,
  PatientProfile,
  UpdateProfile,
} = require("../controller/patient");
const { register } = require("../controller/patient");
const multer = require("multer");
const { restrictTo, checkforauthentication } = require("../middlewares/auth");
const {
  appointmentcreated,
  verifypayment,
  payemntsuccessfull,
} = require("../controller/razorpay");
const { checkAuth } = require("../services/auth");
const Appointment = require("../models/appointment");

const frontendPath = path.resolve(__dirname, "..", "..",  "admin","public");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve(frontendPath, 'img'));
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/admin/login", adminloginfromdb);

router.post("/doctor-profile", DoctorProfile);

router.post("/update-doctor-profile", upload.single('image'), checkforauthentication(), UpdateDoctorProfile);

router.get("/dashboard-doctor", doctorDashboard);

router.get("/logout", adminlogout);

router.get("/doctorlogout", doctorlogout);

router.get(
  "/doctors-registration",
  checkforauthentication(),
  restrictTo(["ADMIN"]),
  doctorsregistration
);

router.post("/appointment-complete", restrictTo(["DOCTOR"]), checkforauthentication(), appointmentComplete);

router.post("/appointment-cancel", restrictTo(["DOCTOR"]), checkforauthentication(), appointmentCancel);

router.get("/doctor-appointments", restrictTo(["DOCTOR"]), checkforauthentication(), Doctorappointmentdetailtable);

router.get("/doctors", doctorsdetailtable);

router.post(
  "/doctors-registration",
  upload.single("image"),
  doctorsregistrationtodb
);
router.get("/check-auth", checkAuth);
router.post("/doctorlogin", doctorloginfromdb);

router.post('/login',patientloginfromdb);

// router.get("/doctorlogin", doctorsloginpage);

router.get("/doctors-detail", doctorsdetailpage);

router.get('/patient-profile',checkforauthentication(),PatientProfile);

router.get("/registereddoctors", doctors);

router.get("/messages", messages);

router.get("/cancel-appointment", async (req, res) => {
  try {
    const { appointmentId } = req.query; // Ensure the appointment ID is being passed
    console.log("Appointment ID:", appointmentId);

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    // Update only the `cancelled` field and bypass validation for other fields
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { cancelled: true },
      { new: true, runValidators: false } // `runValidators: false` skips validation
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
})

router.get("/appointments", checkforauthentication(),appointmentdetailtable);

router.post("/appointment", checkforauthentication(),bookappointment);

router.post('/register',patientregistrationtodb);

router.get("/showmsg", showallmsg);

router.post('/update-profile',upload.single('image'),checkforauthentication(),UpdateProfile);

router.get("/admin-dashboard", checkforauthentication(), adminDashboard);

router.get("/admin-appointments", checkforauthentication(), adminAppointment);

router.get(
  "/doctor",
  checkforauthentication(),
  restrictTo(["DOCTOR"]),
  doctorsdashboard
);

router.post("/messages", sendmsg);

router.get("/message", messagesdetailtable);

router.get("/countries", getallcountries);

router.get("/states/:countryCode", getallstates);

router.get("/cities/:countryCode/:stateCode", getallcities);

router.post("/create-order", appointmentcreated);

router.post("/verify-payment", verifypayment);

router.get("/payment-success", payemntsuccessfull);

router.post("/save-payment", savePayments);

router.post('/change-availability',checkforauthentication(),(req, res, next) => {
  const doctorId = req.body.doctorId;
  req.doctorId = doctorId;
  next();
}, changeAvailability);

module.exports = router;
