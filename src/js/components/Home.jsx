import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import "../../styles/index.css";

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "magjtodo";

const Home = () => {
  const [tasks, setTasks] = useState([]); 
  const [task, setTask] = useState("");

  useEffect(() => {
    initUserAndLoad();
  }, []);

  const initUserAndLoad = async () => {
    try {
      await fetch(`${API_URL}/users/${USERNAME}`, { method: "POST" });
    } catch (e) {
    }
    await getTasks();
  };

  const getTasks = async () => {
    try {
      const resp = await fetch(`${API_URL}/users/${USERNAME}`);
      const data = await resp.json();
      setTasks(Array.isArray(data.todos) ? data.todos : []);
    } catch (e) {
      console.log("getTasks error:", e);
      setTasks([]);
    }
  };

  const addTask = async () => {
    const text = task.trim();
    if (!text) return;

    try {
      const resp = await fetch(`${API_URL}/todos/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: text, is_done: false })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        console.log("addTask failed:", resp.status, err);
        return;
      }

      setTask("");
      await getTasks();
    } catch (e) {
      console.log("addTask error:", e);
    }
  };

  const deleteTask = async (todoId) => {
    try {
      const resp = await fetch(`${API_URL}/todos/${todoId}`, {
        method: "DELETE"
      });

      if (!resp.ok && resp.status !== 204) {
        console.log("deleteTask failed:", resp.status);
        return;
      }

      await getTasks();
    } catch (e) {
      console.log("deleteTask error:", e);
    }
  };

  const clearAllTasks = async () => {
    try {
      await fetch(`${API_URL}/users/${USERNAME}`, { method: "DELETE" });
    } catch (e) {
    }
    setTasks([]);
    await initUserAndLoad();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="todo-page">
      <div className="todo-card">
        <h1 className="todo-title">Tu Lista de Tareas</h1>

        <input
          className="todo-input"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <ul className="todo-list">
          {tasks.length === 0 ? (
            <li className="todo-empty">No hay tareas, añadir tareas</li>
          ) : (
            tasks.map((t) => (
              <TaskItem
                key={t.id}
                text={t.label}
                onDelete={() => deleteTask(t.id)}
              />
            ))
          )}
        </ul>

        <div className="todo-footer">
          {tasks.length} item{tasks.length !== 1 ? "s" : ""} left
        </div>

        <button onClick={clearAllTasks} style={{ margin: "10px" }}>
          Clear All Tasks
        </button>
      </div>
    </div>
  );
};

export default Home;
