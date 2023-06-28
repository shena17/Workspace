import React, { useState, useEffect } from "react";
import EmployeeForm from "../EmployeeForm";
import EmployeeList from "../EmployeeList";
import "./css/EmployeePanel.css";

function EmployeePanel() {
  // Define state variables using the useState hook
  const [employees, setEmployees] = useState([]);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);

  // Use the useEffect hook to fetch data from the API on mount
  useEffect(() => {
    fetch("http://localhost:8070/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data.employees))
      .catch((error) => console.error(error));
  }, []);

  // Define a function to handle adding a new employee
  const handleAddEmployee = (name, salary, bonus, targets) => {
    // Send a POST request to the API with the new employee data
    fetch("http://localhost:8070/api/employees/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, salary, bonus, targets }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);
        // Fetch the updated employee list
        fetchEmployees();
      })
      .catch((error) => console.error(error));
  };

  // Define a function to fetch employees from the API
  const fetchEmployees = () => {
    fetch("http://localhost:8070/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data.employees))
      .catch((error) => console.error(error));
  };

  // Use the fetchEmployees function in another useEffect hook to fetch data whenever an employee is updated or deleted
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Define a function to handle updating an employee
  const handleUpdateEmployee = (employeeId, name, salary, bonus, targets) => {
    // Send a PUT request to the API with the updated employee data
    fetch(`http://localhost:8070/api/employees/${employeeId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, salary, bonus, targets }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Map over the employees array and replace the updated employee with the new data
        const updatedEmployees = employees.map((employee) => {
          if (employee._id === data.employee._id) {
            return data.employee;
          } else {
            return employee;
          }
        });
        // Update the state variables with the new employee data and reset the employeeToUpdate variable
        setEmployees(updatedEmployees);
        setEmployeeToUpdate(null);
      })
      .catch((error) => console.error(error));
  };

  // Define a function to handle deleting an employee
  const handleDeleteEmployee = (employeeId) => {
    // Send a DELETE request to the API to delete the employee
    fetch(`http://localhost:8070/api/employees/${employeeId}`, {
      method: "DELETE",
    })
      .then(() => {
        // Filter the employees array to remove the deleted employee
        const updatedEmployees = employees.filter(
          (employee) => employee._id !== employeeId
        );
        // Update the state variable with the new employee data
        setEmployees(updatedEmployees);
      })
      .catch((error) => console.error(error));
  };
  return (
    <div>
      <h1>Employee Panel</h1>
      <EmployeeForm
        onAddEmployee={handleAddEmployee}
        onUpdateEmployee={handleUpdateEmployee}
        employeeToUpdate={employeeToUpdate}
      />
      <EmployeeList
        employees={employees}
        onUpdateEmployee={setEmployeeToUpdate}
        onDeleteEmployee={handleDeleteEmployee}
      />
    </div>
  );
}

export default EmployeePanel;
