import React from "react";
import Button from "@mui/material/Button";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import "../../styles/viewComponent.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, Formik,} from "formik";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import SelectField from "../FormsUI/SelectField";
import DatePicker from "../FormsUI/DatePicker";
import SubmitButton from "../FormsUI/SubmitButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddDocument(props) {
  const { openPopup, setOpenPopup } = props;
  const token = localStorage.getItem("token")
  const navigate = useNavigate();

  // FORMIK
  const INITIAL_FORM_STATE = {
    documentName: "",
    dueDate: "",
    category:"",
    description: "",
  };

  //YUP
  const FORM_VALIDATION = Yup.object().shape({
    documentName: Yup.string().required("Required!"),
    dueDate: Yup.date().required("Required!"),
    description: Yup.string().required("Required!"),
    category: Yup.string().required("Required!"),
  });

  return (
    <>
      <Dialog open={openPopup} maxWidth="sm">
        {/* ERROR MSG START*/}

        {/* ERROR MSG END*/}

        <div className="popup">
          <DialogTitle>
            <div className="d-flex justify-content-between">
              <p className="popupTitle">Add Document</p>
              <ClearIcon
                onClick={() => {
                  setOpenPopup(false);
                }}
                sx={{
                  cursor: "pointer",
                  color: "var(--blue)",
                  fontSize: "1.7rem",
                  marginTop: "6px",
                  marginRight: "10px",
                }}
              />
            </div>

            <Divider
              sx={{
                height: "1px",
                backgroundColor: "var(--dark)",
                marginTop: "10px",
              }}
            />
          </DialogTitle>

          <DialogContent>
            <Formik
              initialValues={{ ...INITIAL_FORM_STATE }}
              validationSchema={FORM_VALIDATION}
              onSubmit={ async (values)=>{

                await axios.post("http://localhost:8070/documents/add",{
                  docName: values.documentName,
                  category: values.category,
                  date:values.dueDate,
                  description:values.description,
                  createdEmp:"Test",
                  empTitle:"Test"
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res)=>{
                  navigate("/documents")
                  setOpenPopup(false);
                })
                .catch((err)=>{
                  console.log(err)
                })
              }}
            >
              <Form>
                <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                  {/* 1st row */}
                  <Grid item xs={6}>
                    <TextField name="documentName" label="Document Name" />
                  </Grid>

                  <Grid item xs={6}>
                    <DatePicker name="dueDate"  label="Date" />
                  </Grid>

                  {/* 2nd row */}

                  <Grid item xs={12}>
                    <SelectField
                      name="category"
                      label="Category"
                      options={{
                        Contracts: "Contracts",
                        Financial: "Financial",
                        Transactional: "Transactional",
                        Report: "Report"
                      }}
                    />
                  </Grid>

                  {/*<Grid item xs={6}>
                    <SelectField
                      name="priority"
                      label="Priority"
                      options={{
                        Low: "Low",
                        Medium: "Medium",
                        High: "High",
                      }}
                    />
                    </Grid>*/}

                  {/* 3rd row */}

                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Document Description"
                      multiline
                      minRows={4}
                      placeholder="This Document....."
                    />
                  </Grid>

                  <div className="d-flex addProjectButtons">
                    <Button
                      startIcon={<ClearIcon />}
                      variant="outlined"
                      sx={{
                        marginInline: "10px",
                        border: "1px solid var(--light-blue)",
                        color: "var(--light-blue)",
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          color: "red",
                          border: "1px solid red",
                        },
                      }}
                    >
                      Clear
                    </Button>

                    <SubmitButton startIcon={<AddIcon />}>Create</SubmitButton>
                  </div>
                </Grid>
              </Form>
            </Formik>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
