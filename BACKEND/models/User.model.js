const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newUser = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      requied: true,
    },
    role: {
      type: String,
    },
    isOnline: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
    etfNo: {
      type: Number,
      required: true,
    },
    epfNo: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    leaveDates: {
      type: Number,
    },
    creditPoints: {
      type: Array,
    },
    grade: {
      type: String,
    },
    baseSalary: {
      type: Number,
    },
    totCP: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", newUser);

module.exports = User;
