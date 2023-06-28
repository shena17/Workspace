const Todo = require("../models/Todo.model");
const jwt = require("jsonwebtoken");

exports.getTodosByUserId = async (req, res) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;
    const userId = "6426b293961bc484a2c5dd56";
    const todos = await Todo.find({ user: userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: userId });
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTodo = async (req, res) => {
  console.log(req.body); // add this line to check the request body
  try {
    // const token = req.headers.authorization.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;
    const userId = "6426b293961bc484a2c5dd56";
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      user: userId,
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    if (todo) {
      todo.title = req.body.title || todo.title;
      todo.description = req.body.description || todo.description;
      todo.completed = req.body.completed || todo.completed;
      const updatedTodo = await todo.save();
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTodoById = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    if (req.params.id) {
      res.status(200).json({ message: "Todo deleted" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
