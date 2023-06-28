import "../../styles/dashboard.css";
import axios from "axios";


export default function DeleteLeaveReq(ID) {


    console.log(ID);
    axios
      .delete(`http://localhost:8070/leaves/deleteLeave/${ID}`, {
      })
      .then((res) => {
        window.location.reload(false);

      })
      .catch((err) => {
        console.log(err);
      });
  }

