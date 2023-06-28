import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, IconButton } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  textField: {
    flex: 1,
  },
  iconButton: {
    marginLeft: theme.spacing(1),
  },
}));

const ChatInput = ({ groupId, onSendMessage }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/groupChats/${groupId}/messages`, { content: message })
      .then((res) => {
        onSendMessage(res.data);
        setMessage("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        className={classes.textField}
        label="Type your message here"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <IconButton type="submit" className={classes.iconButton}>
        <Send />
      </IconButton>
    </form>
  );
};

export default ChatInput;
