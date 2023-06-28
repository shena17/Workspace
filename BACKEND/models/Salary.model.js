const mongoose = require("mongoose");
const { Schema } = mongoose;

const salarySchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  amount: { type: Number, required: true },
  bonusAmount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
});

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
