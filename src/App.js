import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');

  // Fetch tasks from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/tasks').then((res) => setTasks(res.data));
  }, []);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const newTask = { name: taskName, description: taskDescription, date: taskDate, };
    const res = await axios.post('http://localhost:5000/tasks', newTask);
    setTasks([...tasks, res.data]);
    setTaskName('');
    setTaskDescription('');
    setTaskDate('');
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  // Mark a task as completed
  const handleCompleteTask = async (id) => {
    const updatedTask = tasks.find((task) => task._id === id);
    updatedTask.completed = !updatedTask.completed;
    await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask);
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>To-Do List</h1>
        {/* add taskName and taskDescription*/}
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
          <textarea
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          ></textarea>
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            required
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
      <div className="task-list-container">
        <h1>Task List</h1>
        {tasks.length === 0 ? (
          <p>Today there is no task assigned.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.name}
                </strong>
                <p>{task.description}</p>
                <p><em>Due Date: {new Date(task.date).toLocaleDateString()}</em></p>
                <button
                  onClick={() => handleCompleteTask(task._id)}
                  data-completed={task.completed}
                  className="completeBtn"
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default App;
