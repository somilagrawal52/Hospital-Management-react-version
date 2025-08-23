const mongoose = require("mongoose");

const appointmentschema = new mongoose.Schema(
  {
    userid:{
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    docId: {
      type: String,
      required: true,
    },
    userdata: {
      type: Object,
      required: true,
    },
    doctordata: {
      type: Object,
      required: true,
    },
    slotDate: {
      type: String,
      required: true,
    },
    slottime: {
      type: String,
      required: true,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    address: {
    line1: {
      type: String,
      default: "Address not provided"
    },
    line2: {
      type: String,
      default: "Address not provided"
    }
  },
    payment: {
      type: Boolean,
      default: false,
    },
    iscompleted: {
      type: Boolean,
      default: false,
    },
  },
);

const Appointment = mongoose.model("appointment", appointmentschema);
module.exports = Appointment;
