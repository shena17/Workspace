import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import ProjectTask from "./ProjectTask";
import { ControlledBoard } from "../DispayComponents/Kanban";
import AddTask from "./AddTask";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: "30px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#00009c",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: "500",
    fontSize: "1.1rem",
    color: "var(--blue)",
    marginLeft: "20px",

    "&.Mui-selected": {
      color: "#00009c",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

export default function TaskViewTabbed(props) {
  const [openPopup, setOpenPopup] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="styled tabs example"
          >
            <StyledTab label="Your tasks" />
            <StyledTab label="Kanban board" />
            {props.role === "leader" || props.role === "admin" ? (
              <div className="d-flex justify-content-end w-100">
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  sx={{
                    border: "1px solid var(--light-blue)",
                    color: "var(--light-blue)",
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "var(--light-blue)",
                      color: "var(--white)",
                      border: "1px solid var(--white)",
                    },
                    marginBottom: "10px",
                    marginRight: "10px",
                  }}
                  onClick={() => {
                    setOpenPopup(true);
                  }}
                >
                  New Task
                </Button>
              </div>
            ) : null}
          </StyledTabs>
          <TabPanel value={value} index={0}>
            <ProjectTask projectId={props.projectId} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="kanban ">
              <ControlledBoard projectId={props.projectId} />
            </div>
          </TabPanel>
        </Box>
      </Box>
      <AddTask
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        projectId={props.projectId}
      ></AddTask>
    </>
  );
}
