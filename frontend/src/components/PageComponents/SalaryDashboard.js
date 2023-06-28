import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";

const useStyles = styled((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: "#F2F2F2",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: theme.spacing(4),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    minWidth: "200px",
    textAlign: "center",
    padding: theme.spacing(2),
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.16)",
  },
  cardHeader: {
    color: "#424242",
    marginBottom: theme.spacing(2),
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: theme.spacing(2),
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.16)",
  },
}));

const SalaryDashboard = () => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    // Set default date range to start of current month to current date
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    setStartDate(formatDate(firstDayOfMonth));
    setEndDate(formatDate(currentDate));
  }, []);

  useEffect(() => {
    const getTotalAmountAndBonus = async () => {
      const response = await fetch(
        `http://localhost:8070/api/salaries/total-amount-and-bonus?startDate=${startDate}&endDate=${endDate}`
      );

      if (response.ok) {
        const data = await response.json();
        setTotalAmount(data.totalAmount);
        setTotalBonus(data.totalBonus);
        setTotalPayment(data.totalAmount + data.totalBonus);
      } else {
        console.log("Error retrieving totals");
      }
    };

    // Update totals whenever date range changes
    if (startDate && endDate) {
      getTotalAmountAndBonus();
    }
  }, [startDate, endDate]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

//can't select previous dates from the start date 
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    if (selectedEndDate >= startDate) {
      setEndDate(selectedEndDate);
    }
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={4} className={classes.cardContainer}>
        <Grid item xs={12} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.cardHeader}>
                Basic Salaries
              </Typography>
              <Typography variant="h4">{totalAmount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.cardHeader}>
                Total Bonus
              </Typography>
              <Typography variant="h4">{totalBonus}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.cardHeader}>
                Total Payment
              </Typography>
              <Typography variant="h4">{totalPayment}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div className={classes.formContainer} style={{ marginTop: "40px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="startDate"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="endDate"
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default SalaryDashboard;