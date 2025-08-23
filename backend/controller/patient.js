const express = require("express");
const path = require("path");
const Appointment = require("../models/appointment");
const Message = require("../models/messages");
const { mailsender } = require("./mail");
const User = require("../models/user");
const frontendPath = path.resolve(__dirname, "..", "..", "frontend", "patient");

const Razorpay = require("razorpay");
const { validatetoken } = require("../services/auth");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function messages(req, res) {
  return res.sendFile(path.join(frontendPath, "messages.html"));
}

async function home(req, res) {
  return res.sendFile(path.join(frontendPath, "home.html"));
}

async function doctors(req, res) {
  return res.sendFile(path.join(frontendPath, "doctors-registered.html"));
}

async function bookappointment(req, res) {
  try {
    const {
      docId,
      slotDate,
      slottime,
    } = req.body;
    const userid = req.user._id;
    console.log("body",req.body);
    const doctordata = await User.findById(docId).select("-password");
    console.log("data",doctordata)
    if(!doctordata.available){
      return res.status(400).json({success:false,message:"Doctor is not available"})
    }
    const slots_booked=doctordata.slots_booked;
    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slottime)){
        return res.json({success:false,message:"Slot already booked"})
      }
      else{
        slots_booked[slotDate].push(slottime);
      }
     
    }else{
      slots_booked[slotDate]=[]
      slots_booked[slotDate].push(slottime);
    }
    doctordata.slots_booked = slots_booked;
    await doctordata.save();
    const userdata=await User.findById(userid).select("-password");
    const doctordataCopy = { ...doctordata._doc };
    delete doctordataCopy.slots_booked;
    const appointment = new Appointment({
      userid,
      docId,
      userdata,
      doctordata: doctordataCopy,
      amount: doctordata.fees,
      slotDate,
      slottime,
      date: Date.now(),
      address: {
        line1: doctordata.address?.line1 || "Address not provided",
        line2: doctordata.address?.line2 || "Address not provided"
      }
    });

    await appointment.save();
    console.log("Appointment created successfully");
    console.log("Patient Email:", userdata.email);

    await User.findByIdAndUpdate(docId, { slots_booked });
    res.json({success:true,message:"Appointment created successfully"})
    const patientmail = {
      to: userdata.email,
      subject: "Appointment Booked",
      text: `${userdata.fullname} your Appointment is booked`,
    };
    console.log("Doctor Email:", doctordata.email);
    const doctormail = {
      to: doctordata.email,
      subject: "Appointment Booked",
      text: `${doctordata.fullname} you have been booked for ${appointment.date} by ${userdata.fullname}`,
    };  
    mailsender(patientmail);
    mailsender(doctormail);

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking appointment." });
  }
}

async function appointmentdetailtable(req, res) {
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

async function sendmsg(req, res) {
  const { fullname, question, msgbody } = req.body;
  console.log(req.body);
  try {
    await Message.create({
      fullname,
      question,
      msgbody,
    });
    console.log("Message Send");
    return res.redirect("/messages");
  } catch (error) {
    console.log(error);
    return res.redirect("/messages");
  }
}

async function messagesdetailtable(req, res) {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Server error");
  }
}

async function savePayments(req, res) {
  const { appointmentId, paymentId } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.payment.paymentId = paymentId;
    appointment.payment.status = "success";

    await appointment.save();

    res.json({ message: "Payment saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving payment." });
  }
}

async function patientregistrationtodb(req, res) {
  const { fullname, email, password } = req.body;

  try {
    const newPatient = await User.create({
      fullname,
      email,
      password,
    });
    console.log("Patient created successfully");

    const obj = {
      to: email,
      subject: "Welcome Message!",
      text: `Welcome to OneLife, ${fullname}!`,
    };
    await mailsender(obj);
    return res.status(200).json({
      success: true,
      message: "Patient registered successfully",
    });
  } catch (error) {
    console.error("Error during patient registration:", error);
    res.status(500).send("Server error");
  }
}

async function patientloginfromdb(req, res) {
  const { email, password } = req.body;
  console.log("Patient email:", email);

  try {
    const token = await User.matchpassword(email, password); // Validate password and get token
    console.log("Token generated:", token);

    return res.status(200).json({ success: true,token, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(401).json({ success: false, message: error.message });
  }
}

async function PatientProfile(req, res) {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = validatetoken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    const patientdata = await User.findById(decoded._id).select("-password");
    if (!patientdata) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, patientdata,token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching patient data" });
  }
}

async function UpdateProfile(req, res) {
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
  messages,
  PatientProfile,
  home,
  doctors,
  bookappointment,
  appointmentdetailtable,
  messagesdetailtable,
  sendmsg,
  savePayments,
  patientregistrationtodb,
  patientloginfromdb,
  UpdateProfile,
};
