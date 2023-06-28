// todoRoutes.js

const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// GET all todos
router.get("/", todoController.getTodosByUserId);

// GET a single todo by id
router.get("/:id", todoController.getTodoById);

// CREATE a new todo
router.post("/", todoController.createTodo);

// UPDATE a todo by id
router.put("/:id", todoController.updateTodoById);

// DELETE a todo by id
router.delete("/:id", todoController.deleteTodoById);

module.exports = router;
