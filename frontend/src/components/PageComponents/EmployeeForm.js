import React, { useState, useEffect } from "react";
import "./css/EmployeeForm.css";

function EmployeeForm({ employeeToUpdate }) {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [targets, setTargets] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("false");

  useEffect(() => {
    if (employeeToUpdate) {
      setName(employeeToUpdate.name);
      setSalary(employeeToUpdate.salary);
      setBonus(employeeToUpdate.bonus);
      setTargets(employeeToUpdate.targets);
      setPaymentStatus(employeeToUpdate.paymentStatus ? "true" : "false");
    }
  }, [employeeToUpdate]);

  const onAddEmployee = async (name, salary, bonus, targets, paymentStatus) => {
    try {
      const response = await fetch("http://localhost:8070/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, salary, bonus, targets, paymentStatus }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onUpdateEmployee = async (
    id,
    name,
    salary,
    bonus,
    targets,
    paymentStatus
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8070/api/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, salary, bonus, targets, paymentStatus }),
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (employeeToUpdate) {
      onUpdateEmployee(
        employeeToUpdate._id,
        name,
        salary,
        bonus,
        targets,
        paymentStatus
      );
    } else {
      onAddEmployee(name, salary, bonus, targets, paymentStatus);
    }

    // Reset form
    setName("");
    setSalary("");
    setBonus("");
    setTargets("");
    setPaymentStatus("false");
  };

  return (
    <form className="employeeForm" onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <label htmlFor="salary">Salary:</label>
      <input
        type="number"
        id="salary"
        name="salary"
        value={salary}
        onChange={(event) => setSalary(event.target.value)}
        required
      />
      <label htmlFor="bonus">Bonus:</label>
      <input
        type="number"
        id="bonus"
        name="bonus"
        value={bonus}
        onChange={(event) => setBonus(event.target.value)}
        required
      />
      <label htmlFor="targets">Targets:</label>
      <input
        type="number"
        id="targets"
        name="targets"
        value={targets}
        onChange={(event) => setTargets(event.target.value)}
        required
      />
      <label htmlFor="paymentStatus">Payment Status:</label>
      <select
        id="paymentStatus"
        name="paymentStatus"
        value={paymentStatus}
        onChange={(event) => setPaymentStatus(event.target.value)}
      >
        <option value="true">Paid</option>
        <option value="false">Unpaid</option>
      </select>

      <button type="submit">
        {employeeToUpdate ? "Update Employee" : "Add Employee"}
      </button>
    </form>
  );
}

export default EmployeeForm;
