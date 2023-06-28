import "./Todo.css";

const Todo = ({ todo, onDelete, onComplete, onEdit }) => {
  const handleDelete = () => onDelete(todo._id);
  const handleComplete = () => onComplete(todo._id);
  const handleEdit = () => onEdit(todo);

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="content">
        <h3 className="title">{todo.title}</h3>
        <p className="description">{todo.description}</p>
      </div>
      <div className="buttons">
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
        {todo.completed ? (
          <button className="completed-button" disabled>
            Completed
          </button>
        ) : (
          <button className="complete-button" onClick={handleComplete}>
            Complete
          </button>
        )}  
      </div>
      <p className="created-at">
        Created: {new Date(todo.createdDate).toLocaleString()}
      </p>
    </div>
  );
};
export default Todo;
