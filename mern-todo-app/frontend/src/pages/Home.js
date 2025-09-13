import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const normalizeTask = (task) => {
  if (!task) return null;
  return {
    _id: task._id,
    content: (task.content ?? task.title ?? "").toString(),
    completed: typeof task.completed !== "undefined" ? task.completed : !!task.done,
    raw: task,
    createdAt: task.createdAt,
  };
};

const Home = () => {
  const { user, logout, api } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState(new Set());

  useEffect(() => {
    if (!user) return;
    const loadTasks = async () => {
      try {
        const { data } = await api.get("/tasks");
        const normalized = Array.isArray(data) ? data.map(normalizeTask) : [];
        setTasks(normalized);
      } catch (err) {
        setError("Failed to load tasks");
      }
    };
    loadTasks();
  }, [user, api]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const payload = { title: newTask.trim(), content: newTask.trim(), done: false, completed: false };
      const { data } = await api.post("/tasks", payload);
      setTasks((prev) => [...prev, normalizeTask(data)]);
      setNewTask("");
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const toggleTask = async (task) => {
    const id = task._id;
    if (!id) return;
    setBusyIds((s) => new Set(s).add(id));
    try {
      const payload = {
        title: task.raw?.title ?? task.content,
        done: !task.completed,
        content: task.content,
        completed: !task.completed,
      };
      const { data } = await api.put(`/tasks/${id}`, payload);
      const updated = normalizeTask(data);
      setTasks((s) => s.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError("Failed to update task");
    } finally {
      setBusyIds((s) => {
        const copy = new Set(s);
        copy.delete(id);
        return copy;
      });
    }
  };

  const deleteTask = async (id) => {
    if (!id) return;
    setBusyIds((s) => new Set(s).add(id));
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((s) => s.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to delete task");
    } finally {
      setBusyIds((s) => {
        const copy = new Set(s);
        copy.delete(id);
        return copy;
      });
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h2>Welcome to the To-Do App</h2>
        <p>
          Please <a href="/login">Login</a> or <a href="/register">Register</a> to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Hello, {user.username} 👋</h2>
      <button onClick={logout}>Logout</button>

      <form onSubmit={addTask} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          required
          style={{ width: "100%", padding: ".75rem", borderRadius: 8, border: "1px solid #d1d5db" }}
        />
        <button type="submit" style={{ marginTop: 12 }}>
          Add Task
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              marginBottom: ".75rem",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              padding: "12px",
              borderRadius: 8,
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => toggleTask(task)}
              disabled={busyIds.has(task._id)}
            />
            <span style={{ color: "#111827", fontSize: "1rem", minWidth: 200 }}>
              {task.content || "<no content>"}
            </span>
            <small style={{ color: "#6b7280" }}>
              {task.createdAt ? new Date(task.createdAt).toLocaleString() : ""}
            </small>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={() => toggleTask(task)} disabled={busyIds.has(task._id)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => deleteTask(task._id)} disabled={busyIds.has(task._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
