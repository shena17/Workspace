import "./TodoPanel.css";
import Todo from "./Todo";
import React, { useState, useEffect } from "react";

const TodoPanel = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8070/api/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  }, []);

//backend valdation
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      setDescription(inputValue);
    } else {
      alert(
        "Maximum character limit exceeded. Please limit your description to 50 characters."
      );
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    // Frontend validation for empty title or description
    if (!title || !description) {
      alert("Please enter a title and description.");
      return;
    }

    fetch(`http://localhost:8070/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data]);
        setTitle("");
        setDescription("");
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateTodo = (e) => {
    e.preventDefault();
    if (!selectedTodo) {
      return;
    }
    
    // Frontend validation for empty title or description
    if (!title || !description) {
      alert("Please enter a title and description.");
      return;
    }

    fetch(`http://localhost:8070/api/todos/${selectedTodo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        completed: selectedTodo.completed,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTodos = todos.map((todo) => {
          if (todo._id === data._id) {
            return data;
          } else {
            return todo;
          }
        });
        setTodos(updatedTodos);
        setTitle("");
        setDescription("");

        setSelectedTodo(null);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTodo = (id) => {
    if (!id) {
      return;
    }
    fetch(`http://localhost:8070/api/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch((err) => console.log(err));
  };

  const handleCompleteTodo = (id) => {
    const updatedTodo = todos.find((todo) => todo._id === id);
    updatedTodo.completed = true;
    fetch(`http://localhost:8070/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
    .then(() => {
      const updatedTodos = todos.map((todo) => {
        if (todo._id === id) {
          return updatedTodo;
        } else {
          return todo;
        }
      });
      setTodos(updatedTodos);
    })
    .catch((err) => console.log(err));
};

const handleEditTodo = (todo) => {
  setTitle(todo.title);
  setDescription(todo.description);
  setSelectedTodo(todo);
};

return (
  <div className="todo-panel">
    <form onSubmit={selectedTodo ? handleUpdateTodo : handleAddTodo}>
      <div className="todo-inputs-container">
        <div className="todo-inputs">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
          <button type="submit">
            {selectedTodo ? "Update Todo" : "Add Todo"}
          </button>
        </div>
      </div>
    </form>
    <div className="todo-list">
      {Array.isArray(todos) &&
        todos.map((todo) => (
          <Todo
            key={todo._id}
            todo={todo}
            onDelete={handleDeleteTodo}
            onComplete={handleCompleteTodo}
            onEdit={handleEditTodo}
          />
        ))}
    </div>
  </div>
);
};

export default TodoPanel;