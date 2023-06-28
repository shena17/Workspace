import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../styles/viewComponent.css";

const DashboardCard = ({ children, ...otherProps }) => {
  return (
    <Card
      sx={{
        borderRadius: "10px",
        boxShadow: "0px 0px 15px lightgray",
      }}
      {...otherProps}
    >
      {children}
    </Card>
  );
};

export default DashboardCard;
