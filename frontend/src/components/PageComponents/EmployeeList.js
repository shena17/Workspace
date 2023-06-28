import React from "react";
import "./css/EmployeeList.css";

function EmployeeList({ employees, onUpdateEmployee, onDeleteEmployee }) {
  return (
    <ul className="employeeList">
      {employees &&
        employees.map((employee) =>
          employee ? (
            <li key={employee._id}>
              <span>Name : {employee.name ? employee.name : ""}</span>
              <span>Salary : {employee.salary ? employee.salary : ""}</span>
              <span>Bonus:{employee.bonus ? employee.bonus : ""}</span>
              <span>Targets : {employee.targets ? employee.targets : ""}</span>
              <span>
                Payment Status:{" "}
                {employee.paymentStatus === true ? "Paid" : "Not Paid"}
              </span>
              <button onClick={() => onUpdateEmployee(employee)}>Update</button>
              <button onClick={() => onDeleteEmployee(employee._id)}>
                Delete
              </button>
            </li>
          ) : null
        )}
    </ul>
  );
}

export default EmployeeList;
