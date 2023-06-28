import React from "react";
import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ButtonWrapper from "../FormsUI/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddDocument from "../PageComponents/AddDocument";
import EditDocument from "../PageComponents/EditDocument";
import ConfirmationBox from "../DispayComponents/ConfirmationBox";
import axios from "axios";
import jsPDF from 'jspdf'

export default function Documents() {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
  const [documentList, setdocumentList] = useState([]);

  //PDF export feature start
 const exportDocument = () => {
    console.log("Exporting PDF")
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    const title = "Document List Report";
    const headers = [["Document Name", "Category", "Date", "Description", "Created Employee Name", "Employee Title"]];
    const document = documentList.map(
        Document => [
            Document.docName,
            Document.category,
            Document.date.substring(0, 10),
            Document.description,
            Document.createdEmp,
            Document.empTitle,
        ]
    );
    let content = {
        startY: 50,
        head: headers,
        body: document
    };
    doc.setFontSize(20);
    doc.text(title, marginLeft, 40);
    require('jspdf-autotable');
    doc.autoTable(content);
    doc.save("Document-list.pdf")
}
//PDF export feature en

  function deleteDocument(docId){

    axios.delete("http://localhost:8070/documents/" + docId)
    .then((res)=>{
      console.log("Deleted")
      navigate("/documents")
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{

    axios.get("http://localhost:8070/documents/")
    .then((res)=>{
      setdocumentList(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])


    //CONFIRMATION DIALOG BOX
    const [confirmDialog, setConfirmDialog] = useState({
      isOpen: false,
      type: "",
      title: "",
      subTitle: "",
    });

  return (
    <>

     {/* CONFIRM DIALOG */}
     <ConfirmationBox
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Stack
        direction="row"
        spacing={4}
        sx={{ justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={4} justify-Content={"space-between"}>
          <h5>Document List</h5>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "space-between" }}
        >
          <ButtonWrapper
            onClick={() => {
              setOpenPopup(true);
            }}
            startIcon={<AddIcon />}
            style={{ marginBottom: "25px" }}
          >
            Add Document
          </ButtonWrapper>
          <ButtonWrapper
            onClick={() => {
              exportDocument()
            }}
            startIcon={<AddIcon />}
            style={{ marginBottom: "25px" }}
          >
            Download Report
          </ButtonWrapper>
        </Stack>
      </Stack>

      <Grid container>
        <TableContainer
          sx={{
            borderRadius: "10px",
            boxShadow: "0px 0px 15px lightgray",
          }}
          component={Paper}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <p className="tbHeading">Document Name</p>
                </TableCell>
                <TableCell align="center">
                  <p className="tbHeading">Category</p>
                </TableCell>
                <TableCell align="center">
                  <p className="tbHeading">Created Date</p>
                </TableCell>
                <TableCell align="center" className="col-md-3">
                  <p className="tbHeading">Description</p>
                </TableCell>

                {/*<TableCell align="center">
                  <p className="tbHeading">Created By</p>
                </TableCell>
                <TableCell align="center">
                  <p className="tbHeading">Employee Title</p>
                </TableCell>*/}

                <TableCell align="center" className="col-md-2">
                  <p className="tbHeading">Action</p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentList.map((row)=>(

              
              <TableRow
                //key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "var(--tb-hover)" },
                  cursor: "pointer",
                }}
              >
                <TableCell component="th" scope="row">
                  <div className="text2">
                    <p className="tableCommon tableData">{row.docName}</p>
                    {/*<p className="tableCommon tableSubData">ABC</p>*/}
                  </div>
                </TableCell>

                <TableCell align="center">
                  <div className="text2">
                    <p className="tableCommon tableData ">{row.category}</p>
                    {/*<p className="tableCommon tableSubData ">ABC</p>*/}
                  </div>
                </TableCell>
                <TableCell align="center" sx={{ padding: 0 }} onClick={()=>{
                  navigate("/viewDocument/" + row._id)
                }}>
                  <div className="tableCommon tableData ">{row.date}</div>
                </TableCell>
                <TableCell align="center" className="col-md-3">
                  <div className="tableCommon tableData ">{row.description}</div>
                </TableCell>
                
                {/*<TableCell align="center">
                  <div className="tableCommon tableData ">{row.createdEmp}</div>
                </TableCell>
                <TableCell align="center">
                  <div className="tableCommon tableData ">{row.empTitle}</div>
              </TableCell>*/}

                <TableCell align="center" className="col-md-2">
                  <div className="tableCommon tableData ">
                    {/*<Stack
                      direction="row"
                      spacing={1}
                      sx={{ justifyContent: "space-between" }}
                      >*/}
                      {/*<ButtonWrapper
                        startIcon={<EditIcon />}
                        style={{ width: "6rem" }}
                        onClick={() => {
                          setOpenPopupEdit(true);
                        }}
                      >
                        Edit
                      </ButtonWrapper>
                      */}
                      <ButtonWrapper
                        startIcon={<DeleteIcon />}
                        style={{ width: "6rem" }}
                        onClick={() => {
                          //handleClose();
                          setConfirmDialog({
                            isOpen: true,
                            type: "warning",
                            title: "Delete Team?",
                            subTitle:
                              "Do you really want to delete this Team? This cannot be undone",
                            onConfirm: () => {
                              deleteDocument(row._id)
                            },
                          });
                        }}
                      >
                        Delete
                      </ButtonWrapper>
                    {/*</Stack>*/}
                  </div>
                </TableCell>
              </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <AddDocument
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      ></AddDocument>
    </>
  );
}
