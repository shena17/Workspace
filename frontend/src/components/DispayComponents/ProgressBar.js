import React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Grid } from "@mui/material";

const ProgressBar = ({ progress, status }) => {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor:
        theme.palette.mode === "light" ? changeBgColor(status) : "#308fe8",
    },
  }));

  function changeBgColor(status) {
    if (status === "Early") {
      return "#ffc500";
    } else if (status === "Late") {
      return "#dc3545";
    } else if (status === "Started") {
      return "#1976d2";
    } else if (status === "Completed") {
      return "#1976d2";
    } else if (status === "Not Started") {
      return "#1976d2";
    } else {
      return "#1976d2";
    }
  }

  const [newProgress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 3;
        return Math.min(oldProgress + diff, progress);
      });
    }, 5);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid container item xs={12} className="pt-0">
      <Grid item xs={11} style={{ marginTop: "5px" }}>
        <BorderLinearProgress variant="determinate" value={newProgress} />
      </Grid>
      <Grid item xs={1}>
        <p className="text-secondary ms-2" style={{ fontSize: "0.8rem" }}>
          {progress}%
        </p>
      </Grid>
    </Grid>
  );
};

export default ProgressBar;
