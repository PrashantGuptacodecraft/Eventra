import { useState } from "react";
import "./Tasks.css";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");
    const [priority, setPriority] = useState("low");
    const [date, setDate] = useState("");

    function addTask(e) {
        e.preventDefault();

        const value = input.trim();

        if (value === "") {
            alert("Cannot add empty task");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: value,
            priority: priority,
            date: date,
            completed: false
        };

        setTasks([...tasks, newTask]);
        setInput("");
        setDate("");
    }

    function deleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id));
    }

    function toggleComplete(id) {
        setTasks(tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        ));
    }

    // ✅ Progress Calculation
    const completedCount = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    const percentage = totalTasks === 0
        ? 0
        : Math.round((completedCount / totalTasks) * 100);

    return (
        <div className="container">
            <div className="header">
                <h2>Tasks</h2>
            </div>

            {/* ✅ Progress Bar */}
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

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                <button type="submit">Add Task</button>
            </form>

            {tasks.map((item) => (
                <div className="task" key={item.id}>
                    <div className="task-left">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleComplete(item.id)}
                        />

                        <div>
                            <span className={item.completed ? "completed" : ""}>
                                {item.text}
                            </span>

                            <p className="date">
                                {item.date
                                    ? new Date(item.date).toLocaleDateString()
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div className="task-right">
                        <span className={`badge ${item.priority}`}>
                            {item.priority}
                        </span>

                        <span
                            className="delete"
                            onClick={() => deleteTask(item.id)}
                        >
                            🗑️
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
