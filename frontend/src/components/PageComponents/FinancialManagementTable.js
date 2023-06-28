import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  TableContainer,
  Paper,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Table,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import jsPDF from "jspdf";
import ButtonWrapper from "../FormsUI/Button";
import PrintIcon from "@mui/icons-material/Print";

const useStyles = styled((theme) => ({
  root: {
    maxWidth: 1300,
    margin: "0 auto",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    display: "inline-block",
    width: "100%",
    marginLeft: 20,
    marginRight: 20,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
  },
  title: {
    color: theme.palette.common.grey,
    margin: "20px 0",
    marginLeft: 20,
  },
  table: {
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  evenRow: {
    backgroundColor: theme.palette.grey[100],
  },
  oddRow: {
    backgroundColor: theme.palette.common.white,
  },
  paidRow: {
    backgroundColor: theme.palette.success.light,
  },
  pendingRow: {
    backgroundColor: theme.palette.warning.light,
  },
}));

function FinancialManagementTable() {
  const classes = useStyles();
  const [employees, setEmployees] = useState([]);

  // Fetch employee data from the API and update the state
  useEffect(() => {
    fetch("http://localhost:8070/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data.employees))
      .catch((error) => console.error(error));
  }, []);

  // Send employee ID to the API when "Pay Now" button is clicked
  const handlePayNowClick = (employeeId) => {
    if (window.confirm("Are you sure you want to pay now?")) {
      fetch(
        "http://localhost:8070/api/salaries/create-and-update-payment-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const { updatedEmployee } = data;
          // Show success alert and update table row
          alert(`Payment successful for ${updatedEmployee.name}`);
          setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
              employee._id === employeeId
                ? { ...employee, paymentStatus: true }
                : employee
            )
          );
        })
        .catch((error) => {
          console.error(error);
          // Show error alert
          alert("Payment failed. Please try again later.");
        });
    }
  };

  const downloadPdf = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    const title = "Employee Report";
    const headers = [["Name", "Salary", "Bonus", "Targets", "Payment Status"]];
    const document = employees.map((Document) => [
      Document.name,
      Document.salary,
      Document.bonus,
      Document.targets,
      Document.paymentStatus ? "Paid" : "Not Paid",
    ]);
    let content = {
      startY: 50,
      theme: "grid",
      head: headers,
      body: document,
    };
    doc.setFontSize(20);
    doc.text(title, marginLeft, 40);
    require("jspdf-autotable");
    doc.autoTable(content);

    doc.save("EmployeeReport.pdf");
  };

  //Employee filter
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };
//search employee by name
  const filteredEmps = employees.filter(
    (emp) => emp.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        className="projectTitle mb-3"
        style={{ margin: "40px 0px 0px 0px" }}
      >
        Employee Details
      </Typography>
      <div className="d-flex justify-content-between mb-3">
        <TextField
          id="outlined-basic"
          label="Search by Employee"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchTermChange}
          fullWidth
          margin="dense"
          style={{ width: "30%", marginInlineEnd: "10px", marginTop: "-5px" }}
          inputProps={{ style: { textAlign: "left", padding: "12px" } }}
        />
        <ButtonWrapper
          startIcon={<PrintIcon />}
          onClick={() => {
            downloadPdf();
          }}
          className="mb-3"
        >
          Report
        </ButtonWrapper>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Bonus</TableCell>
              <TableCell>Targets</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Action</TableCell>
           
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmps.map((employee) => (
              <TableRow
                key={employee._id}
                className={
                  employee.paymentStatus ? classes.paidRow : classes.pendingRow
                }
              >
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.salary}</TableCell>
                <TableCell>{employee.bonus}</TableCell>
                <TableCell>{employee.targets}</TableCell>
                <TableCell>
                  {employee.paymentStatus ? "Paid" : "Pending"}
                </TableCell>
                <TableCell>
                  {employee.paymentStatus ? (
                    "Paid"
                  ) : (
                    <Button
                      disabled={employee.paymentStatus}
                      onClick={() => handlePayNowClick(employee._id)}
                      variant="contained"
                      color="primary"
                      className={classes.payNowButton}
                    >
                      Pay Now
                    </Button>
                  )}
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default FinancialManagementTable;
