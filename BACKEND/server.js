const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

//Setting up the server
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(express.json());

//Setting up routing
app.use("/user", require("./routes/User"));
app.use("/project", require("./routes/Project"));
app.use("/team", require("./routes/Team"));
app.use("/chat", require("./routes/Chat"));
app.use("/tasks", require("./routes/Task"));
app.use("/meeting", require("./routes/Meeting"));
app.use("/leaves", require("./routes/Leaves"));
app.use("/api/todos", require("./routes/TodoRoutes"));
app.use("/api/salaries", require("./routes/SalaryRoutes"));
app.use("/api/employees", require("./routes/EmployeeRoutes"));
app.use("/documents", require("./routes/Document"));

app.listen(PORT, () => {
  console.log("Server up with port : " + PORT);
});

//Setting up the database connection
const URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(URL, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});
