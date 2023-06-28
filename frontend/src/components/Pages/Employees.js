import React from "react";
import { useNavigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonWrapper from "../FormsUI/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import "../../styles/dashboard.css";
import AddEmployee from "../PageComponents/AddEmployee";
import axios from "axios";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteEmployee from '../PageComponents/DeleteEmployee'
import UpdateEmployee from "../PageComponents/UpdateEmployee";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


export default function Employees() {
  const navigate = useNavigate();

  const[fetEmp, fetchedEmps] = React.useState([]); //All employees array 


//Get all employees
useEffect(() => {
  setTimeout(() => {
    axios
      .get("http://localhost:8070/user/getAllUsers", {
      })
      .then((res) => {
        fetchedEmps(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 500);
}, []);

//UPDATE USER DETAILS
//the popuo2
const [openPopup2, setOpenPopup2] = useState(false);

  //getting new token each time
  async function getToken(UID){
    console.log(UID);
    await axios
      .post(`http://localhost:8070/user/token/${UID}`)
      .then((res) =>{

        getUserDetails(res.data);
      })
  }

//user data array
  const [details, setDetails] = useState([]);
  
  


//Getting user details
  function getUserDetails(tok){
    axios
      .get(`http://localhost:8070/user/get`,{
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      })
      .then((res) =>{
        setDetails(res.data);
        console.log(res)
      })
      .catch((err) =>{
        console.log(err);
      });
  }


    //Getting the User Id when user clicked the update button
    function EmpIdFetchupd(UID){
      getToken(UID);
      setOpenPopup2(true);
    }
   //Getting the User Id when user clicked the update button(end)

   useEffect(() => {
    console.log(details.username);
  }, [details]);

 

  //store userId for delete function
  const [feUID, setFeUID] = useState(null);

  //Getting the User Id when user clicked the delete button
  function empIdFetch(UID){
     const userfetch = () =>{
      setFeUID(UID);
     }
     userfetch();
     handleClickOpen();
   }
  //Getting the User Id when user clicked the delete button(end)

//UPDATE USER DETAILS(END)

   //The popup
  const [openPopup, setOpenPopup] = useState(false);
  

  //POPUP FOR DELETE
  const [openn, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose2 = () => {
    setOpen(false);
  };

  //Employee filter
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmps = fetEmp.filter((emp) => 
    emp.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return(
    <>
      <div className="d-flex justify-content-end">
        {/*Search field*/}
      <TextField
        id="outlined-basic"
        label="Search by Employee Username"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchTermChange}
        fullWidth
        margin="dense"
        style={{width: "30%", marginInlineEnd:"10px", marginTop:"-5px" }}
        inputProps={{ style: { textAlign: "left", padding: "12px" } }}
      />

        {/*Leaves button*/}
        <Button
          startIcon={<ExitToAppIcon />}
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
            marginBottom: "25px",
            marginRight: "10px",
          }}
          onClick={() => {
            navigate("/leaveManage");
          }}
        >
          Leaves
        </Button>
        
        {/*Add employee button*/}
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
            marginBottom: "25px",
          }}
          onClick={() => {
            setOpenPopup(true); // open the popup
          }}
        >
          Add Employee
        </Button>
      </div>

      <div></div>
      
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
            <TableCell className="col-md-1">
                <p className="tbHeading"> </p>
              </TableCell> 
              <TableCell className="col-md-3" align="left">
                <p className="tbHeading">Employee Name</p>
              </TableCell>
              <TableCell className="col-md-1" align="left">
                <p className="tbHeading">Username</p>
              </TableCell>
              <TableCell className="col-md-1" align="left">
                <p className="tbHeading">Email</p>
              </TableCell>
              <TableCell className="col-md-1" align="left">
                <p className="tbHeading">Designation</p>
              </TableCell>
              <TableCell className="col-md-1" align="left">
                <p className="tbHeading">Role</p>
              </TableCell>
              <TableCell className="col-md-1" align="left">
                <p className="tbHeading">Settings</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmps.map((row) =>(
              <TableRow
              key={row.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { backgroundColor: "var(--tb-hover)" },
                cursor: "pointer",
              }}
            >
              <TableCell align="left" sx={{ padding: 0 }}>
                  <AvatarGroup sx={{ justifyContent: "center" }}>
                    <Avatar
                      alt={row.username}
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 40, height: 40 }}
                    />
                  </AvatarGroup>
                </TableCell>
              <TableCell component="th" scope="row" className="col-md-1">
                  <div className="text2">
                    <p className="tableCommon tableData">{row.fullName}</p>
                    </div>
                </TableCell>
                <TableCell component="th" scope="row" className="col-md-1">
                  <div className="text2">
                    <p className="tableCommon tableData">{row.username}</p>
                    </div>
                </TableCell>
                <TableCell component="th" scope="row" className="col-md-1">
                  <div className="text2">
                    <p className="tableCommon tableData">{row.email}</p>
                    </div>
                </TableCell>
                <TableCell component="th" scope="row" className="col-md-1">
                  <div className="text2">
                    <p className="tableCommon tableData">{row.designation}</p>
                    </div>
                </TableCell>
                <TableCell component="th" scope="row" className="col-md-1">
                  <div className="text2">
                    <p className="tableCommon tableData">{row.role}</p>
                    </div>
                </TableCell>
                <TableCell component="th" scope="row" className="col-md-1">
                  <div className="text2">

                    {/*Edit BTN*/}
                    <ButtonWrapper onClick={()=>{EmpIdFetchupd(row._id)}} style={{ marginBottom: "5px"}} fullWidth={true} startIcon={<EditIcon />}>Edit  </ButtonWrapper>
                    
                    {/*Delete BTN*/}
                    <ButtonWrapper onClick={()=>{empIdFetch(row._id);}} fullWidth={true} startIcon={<DeleteIcon />}>Delete</ButtonWrapper>
                    
                    <Dialog
                          fullScreen={fullScreen}
                          open={openn}
                          onClose={handleClose2}
                          aria-labelledby="responsive-dialog-title"
                        >
                          <DialogTitle id="responsive-dialog-title">
                            {"Do you want to delete the Employee ?"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              This will delete all the details of the employee.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <ButtonWrapper autoFocus onClick={()=>{handleClose2();}}>
                              CANCEL
                            </ButtonWrapper>
                            <ButtonWrapper onClick={()=>{DeleteEmployee(feUID);}} autoFocus>
                              DELETE
                            </ButtonWrapper>
                          </DialogActions>
                        </Dialog>
                    </div>
                </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <AddEmployee openPopup={openPopup} setOpenPopup={setOpenPopup}></AddEmployee>
      <UpdateEmployee openPopup2={openPopup2} setOpenPopup2={setOpenPopup2} employeeDetails = {details}></UpdateEmployee>
    </>
    
  )
}
