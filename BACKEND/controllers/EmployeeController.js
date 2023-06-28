const Employee = require("../models/Employee.model");

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createEmployee = async (req, res) => {
  const { name, salary, bonus, targets } = req.body;
  try {
    const newEmployee = new Employee({
      name,
      salary,
      bonus,
      targets,
      paymentStatus: false,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee Created Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, salary, bonus, targets, paymentStatus } = req.body;
  console.log(paymentStatus);
  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        salary,
        bonus,
        targets,
        paymentStatus: paymentStatus === "true" ? true : false,
      },
      { new: true }
    );

    res.status(200).json({ employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// function to update all employees' payment status, amount, and bonus
exports.updateEmployeePaymentStatus = async () => {
  try {
    // check if the current month is different from the last stored month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastMonth = app.locals.lastMonth || currentMonth;

    if (currentMonth !== lastMonth) {
      // update payment status to false, amount and bonus to zero for all employees
      await Employee.updateMany(
        {},
        { paymentStatus: false, amount: 0, bonus: 0 }
      );

      // update the last stored month
      app.locals.lastMonth = currentMonth;
    }
  } catch (error) {
    console.error(error.message);
  }
};
