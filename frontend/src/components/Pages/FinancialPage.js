import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material";
import { Container, Typography } from "@mui/material";
import FinancialManagementTable from "../PageComponents/FinancialManagementTable";
import SalaryTable from "../PageComponents/SalaryTable";
import ErrorBoundary from "../PageComponents/ErrorBoundary";
import SalaryDashboard from "../PageComponents/SalaryDashboard";
import "../../styles/viewComponent.css";

const useStyles = styled((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
}));

function FinancialPage() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography
        variant="h4"
        className="projectTitle"
        style={{ marginBottom: "30px" }}
      >
        Financial Page
      </Typography>
      <SalaryDashboard />
      <FinancialManagementTable />
      <ErrorBoundary>
        <SalaryTable />
      </ErrorBoundary>
    </Container>
  );
}

export default FinancialPage;
