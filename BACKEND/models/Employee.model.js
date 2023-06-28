const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  salary: { type: Number, required: true },
  bonus: { type: Number, required: true },
  targets: { type: Number, required: true },
  paymentStatus: { type: Boolean, default: false },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
