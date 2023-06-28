import React, { useState, useEffect } from "react";
import axios from "axios";

// AUTHENTICATION HEADER
const token = localStorage.getItem("token");

function GetRole() {
  const [role, setRole] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8070/user/getRole", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRole(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
}

export { GetRole };
