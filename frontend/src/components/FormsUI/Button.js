import React from "react";
import { Button } from "@mui/material";

const ButtonWrapper = ({ children, ...otherProps }) => {
  const configBtn = {
    ...otherProps,
    variant: "outlined",
  };

  return (
    <Button
      {...configBtn}
      sx={{
        padding: "6px 20px",
        borderRadius: "10px",
        border: "1px solid var(--light-blue)",
        color: "var(--light-blue)",
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": {
          backgroundColor: "var(--light-blue)",
          color: "var(--white)",
          border: "1px solid var(--white)",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonWrapper;
