import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import "./Tasks.css";

export default function Tasks() {
  const { user, tasks, setTasks, showToast, addPoints } = useApp();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("low");
  const [date, setDate] = useState("");
  const dateInputRef = useRef(null);

  const userTasks = tasks.filter((task) => task.userId === user.id);

  function addTask(e) {
    e.preventDefault();

    const value = input.trim();

    if (value === "") {
      showToast("Empty task", "error");
      return;
    }

    const newTask = {
      id: Date.now(),
      userId: user.id,
      title: value,
      priority: priority,
      deadline: date,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setInput("");
    setDate("");
    showToast("Task added", "success");
    addPoints(5);
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    showToast("Task deleted", "success");
  }

  function toggleComplete(id) {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task,
    );
    setTasks(updated);
    const task = updated.find((t) => t.id === id);
    if (task.done) {
      showToast("Task done", "success");
      addPoints(10);
    }
  }

  // Progress Calculation
  const completedCount = userTasks.filter((task) => task.done).length;
  const totalTasks = userTasks.length;

  const percentage =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="container">
      <div className="header">
        <h2>Tasks</h2>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-info">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <form className="task-input" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Add New Task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="date-input-container">
          <input
            ref={dateInputRef}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <span
            className="date-icon"
            onClick={() =>
              dateInputRef.current?.showPicker?.() ||
              dateInputRef.current?.click()
            }
          >
            📅
          </span>
        </div>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button type="submit">Add Task</button>
      </form>

      {userTasks.map((item) => (
        <div className="task" key={item.id}>
          <div className="task-left">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleComplete(item.id)}
            />

            <div>
              <span className={item.done ? "completed" : ""}>{item.title}</span>

              <p className="date">
                {item.deadline
                  ? new Date(item.deadline).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>

          <div className="task-right">
            <span className={`badge ${item.priority.toLowerCase()}`}>
              {item.priority}
            </span>

            <span className="delete" onClick={() => deleteTask(item.id)}>
              🗑️
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
