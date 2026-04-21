import React, { useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import "./style/Tasks.css";

export default function Tasks() {
  const { user, tasks, setTasks, showToast, awardDailyTaskCoin, searchQuery } = useApp();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("High");
  const [date, setDate] = useState("");
  const dateInputRef = useRef(null);

  const userTasks = tasks.filter((task) => task.userId === user.id);

  function addTask(event) {
    event.preventDefault();

    // Input trim kar raha hu taki blank ya extra-space wali task save na ho.
    const value = input.trim();

    if (value === "") {
      showToast("Empty task", "error");
      return;
    }

    const newTask = {
      id: Date.now(),
      userId: user.id,
      title: value,
      priority,
      deadline: date,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setInput("");
    setDate("");
    showToast("Task added", "success");
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    showToast("Task deleted", "success");
  }

  function toggleComplete(id) {
    const todayKey = getLocalDateKey(new Date());
    // Update the task completion status
    const updated = [];
    let targetTask = null;
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.id === id) {
        const newDone = !task.done;
        const newTask = {
          ...task,
          done: newDone,
          completedAt: newDone ? new Date().toISOString() : null,
        };
        updated.push(newTask);
        targetTask = newTask;
      } else {
        updated.push(task);
      }
    }

    setTasks(updated);

    if (targetTask && targetTask.done) {
      showToast("Task completed", "success");

      // Count today completed tasks for daily reward
      const updatedUserTasks = [];
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].userId === user.id) {
          updatedUserTasks.push(updated[i]);
        }
      }

      let todayCompleted = 0;
      for (let i = 0; i < updatedUserTasks.length; i++) {
        const task = updatedUserTasks[i];
        if (task.done && task.completedAt) {
          const taskDate = getLocalDateKey(new Date(task.completedAt));
          if (taskDate === todayKey) {
            todayCompleted++;
          }
        }
      }

      if (todayCompleted >= 15) {
        const awarded = awardDailyTaskCoin(todayKey);
        if (awarded) {
          showToast("Daily goal reached! +2 coins awarded", "success");
        }
      }
    }
  }

  const completedCount = userTasks.filter((task) => task.done).length;
  const totalTasks = userTasks.length;
  const pendingCount = totalTasks - completedCount;
  const percentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);
  const todayKey = getLocalDateKey(new Date());
  
  // Count completed tasks by day
  const taskPointsByDay = {};
  for (let i = 0; i < userTasks.length; i++) {
    const task = userTasks[i];
    if (task.done && task.completedAt) {
      const key = getLocalDateKey(new Date(task.completedAt));
      if (taskPointsByDay[key]) {
        taskPointsByDay[key] = taskPointsByDay[key] + 1;
      } else {
        taskPointsByDay[key] = 1;
      }
    }
  }

  const todayTaskPoints = taskPointsByDay[todayKey] || 0;
  const dailyTarget = 15;
  const dailyRemaining = Math.max(dailyTarget - todayTaskPoints, 0);
  const dailyBonusEarned = (user?.taskDailyRewardDates || []).includes(todayKey);

  // Simple search by title
  const normalizedQuery = searchQuery.trim().toLowerCase();
  let visibleTasks = [];
  if (normalizedQuery) {
    for (let i = 0; i < userTasks.length; i++) {
      const task = userTasks[i];
      if (task.title.toLowerCase().includes(normalizedQuery)) {
        visibleTasks.push(task);
      }
    }
  } else {
    visibleTasks = userTasks;
  }

  const sortedTasks = [...visibleTasks].sort((a, b) => {
    // Pehle pending tasks, fir nearest deadline, fir latest created task order me show ho.
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }

    if (a.deadline && b.deadline) {
      return new Date(a.deadline) - new Date(b.deadline);
    }

    if (a.deadline) return -1;
    if (b.deadline) return 1;

    return b.id - a.id;
  });

  return (
    <section className="tasks-page">
      <div className="tasks-shell">
        <div className="tasks-header">
          <div>
            <h2>Task Manager</h2>
            <p>Plan your day, complete tasks, and track progress clearly.</p>
            {normalizedQuery ? (
              <p className="tasks-coins-muted">Showing results for "{searchQuery}"</p>
            ) : null}
            <p className="tasks-coins">Tasks done today: {todayTaskPoints} / {dailyTarget}</p>
            <p className="tasks-coins-muted">
              {dailyBonusEarned
                ? "Daily bonus claimed: +2 coins"
                : `${dailyRemaining} tasks left to earn +2 coins`}
            </p>
          </div>

          <div className="tasks-metrics">
            <div className="tasks-metric-pill">
              <span>Total</span>
              <strong>{totalTasks}</strong>
            </div>
            <div className="tasks-metric-pill">
              <span>Done</span>
              <strong>{completedCount}</strong>
            </div>
            <div className="tasks-metric-pill">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-info">
            <span>Completion</span>
            <span>{percentage}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <form className="task-input" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Write a new task..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <div className="date-input-container">
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <span
              className="date-icon"
              onClick={() =>
                dateInputRef.current?.showPicker?.() ||
                dateInputRef.current?.click()
              }
            >
              Pick Date
            </span>
          </div>

          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button type="submit">Add Task</button>
        </form>

        <div className="tasks-list">
          {sortedTasks.length === 0 ? (
            <div className="tasks-empty">
              <h3>No tasks yet</h3>
              <p>Create your first task to start tracking progress.</p>
            </div>
          ) : (
            sortedTasks.map((item) => (
              <div className={`task ${item.done ? "task-done" : ""}`} key={item.id}>
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleComplete(item.id)}
                  />

                  <div>
                    <span className={item.done ? "completed" : ""}>{item.title}</span>
                    <p className="date">
                      {item.deadline ? new Date(item.deadline).toLocaleDateString() : "No deadline"}
                    </p>
                  </div>
                </div>

                <div className="task-right">
                  <span className={`badge ${item.priority.toLowerCase()}`}>{item.priority}</span>
                  <button type="button" className="delete" onClick={() => deleteTask(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="tasks-daywise">
          <h3>Day-wise Task Points</h3>
          {Object.keys(taskPointsByDay).length === 0 ? (
            <p>No day-wise points yet.</p>
          ) : (
            <ul>
              {Object.entries(taskPointsByDay)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([day, points]) => (
                  <li key={day}>
                    <span>{new Date(day).toLocaleDateString()}</span>
                    <strong>{points} task points</strong>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function getLocalDateKey(date) {
  // Local date key use ki hai taki timezone ki wajah se daily tracking mismatch na ho.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
