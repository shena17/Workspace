import React from "react";
import "../../styles/dashboard.css";
import empty from "../../images/empty.png";

export const EmptyIcon = ({ title, subTitle }) => {
  return (
    <div>
      <img src={empty} alt="No Projects" className="noProjIcon" />
      <p className="noProjMain">{title}</p>
      <p className="noProjSec">{subTitle}</p>
    </div>
  );
};
