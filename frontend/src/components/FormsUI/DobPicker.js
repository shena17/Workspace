import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const DobPicker = (name, ...otherProps) => {
  const [field, meta] = useField(name);

  const configDatePicker = {
    ...field,
    ...otherProps,
    type: "date",
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: {
      shrink: true,
    },
    label: "Date-Of-Birth",
  };

  if (meta && meta.touched && meta.error) {
    configDatePicker.error = true;
    configDatePicker.helperText = meta.error;
  }

  return <TextField {...configDatePicker} />;
};

export default DobPicker;
