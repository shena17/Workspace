import React from "react";
import { useFormikContext } from "formik";
import { Button } from "@mui/material";

const SubmitButton = ({ children, ...otherProps }) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configBtn = {
    ...otherProps,
    variant: "contained",
    onClick: handleSubmit,
  };

  return (
    <Button
      {...configBtn}
      sx={{
        padding: "6px 20px",
        borderRadius: "10px",
        backgroundColor: "var(--light-blue)",
        border: "1px solid var(--light-blue)",
        color: "var(--white)",
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": {
          backgroundColor: "var(--transparent)",
          color: "var(--light-blue)",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
