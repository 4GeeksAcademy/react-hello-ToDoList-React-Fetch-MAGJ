import React from "react";

const TaskItem = ({ text, onDelete }) => {
  return (
    <li className="todo-item">
      <span>{text}</span>
      <button className="todo-delete" onClick={onDelete}>
        ×
      </button>
    </li>
  );
};

export default TaskItem;
