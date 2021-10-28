import React from "react";
import "./InfoBoxes.css";
import { Card, CardContent, Typography } from "@material-ui/core";
// ...Props mean any other props
// We pass a variable called onCLick is a prop
function InfoBoxes({ title, cases, total, active, isRed, ...props }) {
  return (
    <div
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <Card onClick={props.onClick}>
        <CardContent>
          <Typography className="infoBox__title" color="textSecondary">
            {title}
          </Typography>
          <h2 className={`infoBox__cases ${!isRed && "infoBox--textGreen"}`}>
            {cases}
          </h2>
          <Typography className="infoBox__total" color="textSecondary">
            {total} Total
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoBoxes;
