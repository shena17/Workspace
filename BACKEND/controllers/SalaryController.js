const Salary = require("../models/Salary.model");
const Employee = require("../models/Employee.model");

//pay now option
exports.createSalaryAndUpdatePaymentStatus = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Find employee object
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Create new salary record with employee's salary and bonus amounts
    const newSalary = await Salary.create({
      employeeId,
      amount: employee.salary,
      bonusAmount: employee.bonus,
    });

    // Update employee's payment status to true
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { paymentStatus: true },
      { new: true }
    );

    return res.status(200).json({ newSalary, updatedEmployee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//salary table date picker option
exports.getSalariesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, employeeName } = req.query;

    let query = {
      paymentDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (employeeName) {
      const employees = await Employee.find({
        name: { $regex: new RegExp(employeeName, "i") },
      });
      const employeeIds = employees.map((employee) => employee._id);
      query.employeeId = { $in: employeeIds };
    }

    const salaries = await Salary.find(query).populate("employeeId", "name");

    const salariesWithEmployeeDetails = salaries.map((salary) => ({
      _id: salary._id,
      employeeId: salary.employeeId._id,
      employeeName: salary.employeeId.name,
      amount: salary.amount,
      bonusAmount: salary.bonusAmount,
      paymentDate: salary.paymentDate,
    }));

    res.status(200).json(salariesWithEmployeeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTotalAmountAndBonus = async (req, res) => {
  const { startDate, endDate } = req.query;

  const result = await Salary.aggregate([
    {
      $match: {
        paymentDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        totalBonus: { $sum: "$bonusAmount" },
      },
    },
  ]);

  if (result.length > 0) {
    res.json({
      totalAmount: result[0].totalAmount,
      totalBonus: result[0].totalBonus,
    });
  } else {
    res.json({
      totalAmount: 0,
      totalBonus: 0,
    });
  }
};
