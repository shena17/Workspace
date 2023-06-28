import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";



const TeamMoniter = () => {
    const navigate = useNavigate();

    const changeBgColor = (isStarted)=> {

        if(isStarted === true){
          return "Green"
        }
        else{
          return "Red"
        }
    }

    const changeActivity = (isStarted)=> {

        if(isStarted === true){
          return "Online"
        }
        else{
          return "Offline"
        }
    }

    const [rows, setRows] = useState([])

    const columns = [
        {
            field: 'projectName',
            headerName: 'Project',
            width: 200,
            
        },
        {
            field: 'taskname',
            headerName: 'Task',
            width: 220,
            editable: true,
        },
        {
            headerName: 'Profile',
            width: 150,
            renderCell: (params)=><Avatar sx={{ width: 40, height: 40 }} />   
        },

        {
            field: 'assignee',
            headerName: 'Employee',
            width: 200,
            editable: true,
        },
        
        {
            field: 'isStarted',
            headerName: 'Status',
            width: 150,
            type:'boolean',
            editable: true,
            renderCell: (params)=><CircleIcon sx={{ color: changeBgColor(params.row.isStarted) }} />   
        },
        {
          field: '',
          headerName: 'Activity',
          width: 150,
          renderCell: (params)=><p>{changeActivity(params.row.isStarted)}</p>  
      },
        
       
      ];

    useEffect(() => {
        axios
          .get("http://localhost:8070/team/trackEmployee/")
          .then((res)=>{
            setRows(res.data)
          })
          .catch((err)=>{
            console.log(err)
          })
      }, []);

      console.log(rows)
     

    return (<>

    <Box sx={{ height: 600, width: '100%' }}>
    
        <div className='d-flex justify-content-start'>
            <IconButton
                    onClick={() => {
                    navigate("/teams");
                    }}
                    className="iconbtn"
                >
                    <KeyboardBackspaceIcon />
            </IconButton>
        </div>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 10,
                },
            },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            getRowId={(rows) => rows.taskId }
        />
    </Box>
    
    </>);
}


export default TeamMoniter;