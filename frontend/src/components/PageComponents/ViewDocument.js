import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditDocument from "../PageComponents/EditDocument";
import ButtonWrapper from '../FormsUI/Button';
import DashboardCard from "../DispayComponents/DashboardCard";
import {Grid, CardContent } from "@mui/material";

const ViewDocument = ()=> {

    const { docId } = useParams();
    const [docDetails, setdocDetails] = useState({})
    const [openPopupEdit, setOpenPopupEdit] = useState(false);


    useEffect(()=>{
         axios.get("http://localhost:8070/documents/" + docId)
         .then((res)=>{
            setdocDetails(res.data)
         })
         .catch((err)=>{
            console.log(err)
         })
    })

  return(<>
  
  <div className='d-flex justify-content-center'>

  <DashboardCard className="p-3 mb-2" style={{width:"30rem"}}>

         <DashboardCard className="p-3 mb-4">
            <h3>Document Name</h3>
            <p>{docDetails.docName}</p>
         </DashboardCard>

         <DashboardCard className="p-3 mb-4">
            <h3>Document Category</h3>
            <p>{docDetails.category}</p>
         </DashboardCard>

         <DashboardCard className="p-3 mb-4">
            <h3>Date</h3>
            <p>{docDetails.date}</p>
         </DashboardCard>

         <DashboardCard className="p-3 mb-4">
            <h3>Document Description</h3>
            <p>{docDetails.description}</p>
         </DashboardCard>
       
   </DashboardCard>

</div>


   <ButtonWrapper
    onClick={() => {
        setOpenPopupEdit(true);
      }}>
    Edit
   </ButtonWrapper>


    
      <EditDocument
        openPopupEdit={openPopupEdit}
        setOpenPopupEdit={setOpenPopupEdit}
        documentDetails = {docDetails}
      ></EditDocument>
  
  
  </>)
}
export default ViewDocument