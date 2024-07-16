import React, { useState, useRef, useEffect } from 'react';
import { db } from './firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore'; 
import { FaPlus, FaTrash, FaPencilAlt, FaCheck } from 'react-icons/fa';
import "./SalesTodoList.css";
import ChatBot from "./ChatBot.jsx";

const SalesTaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    customer: '',
    employee: '',
    status: 'Upcoming',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dragTask = useRef(null);
  const dragOverTask = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ ...doc.data(), id: doc.id });
      });
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({ ...prev, [name]: value }));
  };

  const addOrUpdateTask = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const taskRef = doc(db, 'tasks', currentTask.id);
      await updateDoc(taskRef, currentTask);
    } else {
      const docRef = await addDoc(collection(db, 'tasks'), currentTask);
      setTasks(prev => [...prev, { ...currentTask, id: docRef.id }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setCurrentTask({
      id: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      customer: '',
      employee: '',
      status: 'Upcoming',
    });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const startEditing = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDragStart = (e, taskId, status) => {
    dragTask.current = taskId;
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('status', status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, targetTaskId) => {
    dragOverTask.current = targetTaskId;
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('status');

    setTasks(prev => {
      const updatedTasks = prev.map(task => 
        task.id === taskId ? { ...task, status: targetStatus } : task
      );

      if (sourceStatus === targetStatus && dragTask.current !== null && dragOverTask.current !== null) {
        const draggedTaskIndex = updatedTasks.findIndex(task => task.id === dragTask.current);
        const dragOverTaskIndex = updatedTasks.findIndex(task => task.id === dragOverTask.current);
        
        if (draggedTaskIndex !== -1 && dragOverTaskIndex !== -1) {
          const tasksInStatus = updatedTasks.filter(task => task.status === targetStatus);
          const [draggedTask] = tasksInStatus.splice(draggedTaskIndex, 1);
          tasksInStatus.splice(dragOverTaskIndex, 0, draggedTask);
          
          return updatedTasks.filter(task => task.status !== targetStatus).concat(tasksInStatus);
        }
      }

      return updatedTasks;
    });

    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { status: targetStatus });

    dragTask.current = null;
    dragOverTask.current = null;
  };

  const TaskList = ({ status, title }) => (
    <div 
      className={`task-list ${status.toLowerCase()}`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <h2>{title}</h2>
      {tasks.filter(task => task.status === status).map(task => (
        <div 
          key={task.id} 
          className={`task-item priority-${task.priority.toLowerCase()} status-${task.status.toLowerCase()}`}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id, status)}
          onDragEnter={(e) => handleDragEnter(e, task.id)}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Due: {task.dueDate}</p>
          <p>Priority: {task.priority}</p>
          <p>Customer: {task.customer}</p>
          <p>Employee: {task.employee}</p>
          <button onClick={() => startEditing(task)} className="edit-button"><FaPencilAlt /></button>
          <button onClick={() => deleteTask(task.id)} className="delete-button"><FaTrash /></button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="sales-task-board">
      <h1>Sales Task Board</h1>
      
      <button className="add-task-button" onClick={() => { resetForm(); setIsModalOpen(true); }}>
        <FaPlus />
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={addOrUpdateTask} className="task-form">
              <input
                type="text"
                name="title"
                value={currentTask.title}
                onChange={handleInputChange}
                placeholder="Task Title"
                required
              />
              <textarea
                name="description"
                value={currentTask.description}
                onChange={handleInputChange}
                placeholder="Task Description"
              ></textarea>
              <input
                type="date"
                name="dueDate"
                value={currentTask.dueDate}
                onChange={handleInputChange}
                required
              />
              <select
                name="priority"
                value={currentTask.priority}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="text"
                name="customer"
                value={currentTask.customer}
                onChange={handleInputChange}
                placeholder="Associated Customer"
              />
              <input
                type="text"
                name="employee"
                value={currentTask.employee}
                onChange={handleInputChange}
                placeholder="Associated Employee"
              />
              <select
                name="status"
                value={currentTask.status}
                onChange={handleInputChange}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Changes">Changes Required</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">{isEditing ? 'Update Task' : 'Add Task'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="task-board">
        <TaskList status="Upcoming" title="Upcoming Tasks" />
        <TaskList status="InProgress" title="Work in Progress" />
        <TaskList status="Completed" title="Completed Tasks" />
        <TaskList status="Changes" title="Tasks with Changes" />
      </div>

      <ChatBot/>
    </div>
  );
};

export default SalesTaskBoard;