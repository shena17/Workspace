import React, { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
// import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material";
import {
  TableContainer,

  Paper,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Table,
  Typography,
  Grid,
} from "@mui/material";

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
  datePickers: {
    padding: 10,
    backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  evenRow: {
    backgroundColor: theme.palette.grey[100],
  },

  oddRow: {
    backgroundColor: theme.palette.common.white,
  },
}));

function SalaryTable() {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [searchTerm, setSearchTerm] = useState("");
  const [salaries, setSalaries] = useState([]);

  // Fetch salary data from the API and update the state
  useEffect(() => {
    fetch(
      `http://localhost:8070/api/salaries?startDate=${startDate}&endDate=${endDate}`
    )
      .then((response) => response.json())
      .then((data) => setSalaries(data))
      .catch((error) => console.error(error));
  }, [startDate, endDate]);

  // Handle changes to the date pickers
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  //cant select previous dates from the start date
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    if (selectedEndDate >= startDate) {
      setEndDate(selectedEndDate);
    }
  };

  function getDefaultStartDate() {
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 7);
    return formatDate(defaultStartDate);
  }

  function getDefaultEndDate() {
    const defaultEndDate = new Date();
    return formatDate(defaultEndDate);
  }

  function formatDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  const filteredSalaries = salaries.filter((salary) =>
    salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        className="projectTitle"
        style={{ margin: "40px 0px" }}
      >
        Salary History
      </Typography>
      <Grid container spacing={2} className={classes.datePickers}>
        <Grid item xs={6}>
          <TextField
            id="start-date-picker"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="end-date-picker"
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Salary Amount</TableCell>
              <TableCell>Bonus Amount</TableCell>
              <TableCell>Payment Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSalaries.map((salary, index) => (
              <TableRow
                key={salary._id}
                className={index % 2 === 0 ? classes.evenRow : classes.oddRow}
              >
                <TableCell>{salary.employeeName}</TableCell>
                <TableCell>{salary.amount}</TableCell>
                <TableCell>{salary.bonusAmount}</TableCell>
                <TableCell>{formatDateTime(salary.paymentDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SalaryTable;
