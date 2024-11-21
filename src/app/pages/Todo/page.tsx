'use client'
import React, { useState, KeyboardEvent } from 'react';
import styles from './todo.module.css';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const createXMLFile = (tasks: Task[]) => {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();

    // Create root XML structure
    const xmlDoc = parser.parseFromString('<tasks></tasks>', 'application/xml');
    const root = xmlDoc.documentElement;

    // Add tasks to the XML structure
    tasks.forEach(task => {
      const taskElement = xmlDoc.createElement('task');

      const id = xmlDoc.createElement('id');
      id.textContent = task.id;

      const text = xmlDoc.createElement('text');
      text.textContent = task.text;

      const completed = xmlDoc.createElement('completed');
      completed.textContent = task.completed.toString();

      const createdAt = xmlDoc.createElement('createdAt');
      createdAt.textContent = task.createdAt.toISOString();

      taskElement.appendChild(id);
      taskElement.appendChild(text);
      taskElement.appendChild(completed);
      taskElement.appendChild(createdAt);

      root.appendChild(taskElement);
    });

    // Serialize XML
    const xmlString = serializer.serializeToString(xmlDoc);

    // Save XML to file (requires File System API or backend support)
    saveXMLFile(xmlString);
  };

  const saveXMLFile = (xmlContent: string) => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const fileURL = URL.createObjectURL(blob);

    // Download the file
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = 'tasks.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileURL); // Clean up memory
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        createdAt: new Date(),
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      setNewTask('');

      // Update XML file
      createXMLFile(updatedTasks);

      // Announce task addition to screen readers
      announceToScreenReader(`Task added: ${newTask}`);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        // Announce status change to screen readers
        announceToScreenReader(`Task ${task.text} marked as ${newStatus ? 'completed' : 'pending'}`);
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete) {
      announceToScreenReader(`Task deleted: ${taskToDelete.text}`);
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <>
      <title>TaskMaster - Organize Your Life, One Task at a Time</title>
      <meta name="description" content="TaskMaster helps you track, manage, and accomplish your goals with ease." />
      <div className={styles.todoContainer} role="main">
        <aside className={styles.sidebar} role="complementary">
          <button 
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            className={styles.completedTasksButton}
            aria-expanded={showCompletedTasks}
            aria-controls="completed-tasks-modal"
          >
            <span className="sr-only">Show </span>
            Completed Tasks ({completedTasks.length})
          </button>
        </aside>

        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle} tabIndex={-1}>TaskMaster Todo List</h1>

          <div 
            className={styles.addTaskContainer}
            role="form"
            aria-label="Add new task"
          >
            <label htmlFor="new-task" className="sr-only">Enter new task</label>
            <input 
              id="new-task"
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a new task"
              className={styles.taskInput}
              aria-label="New task text"
            />
            <button 
              onClick={addTask} 
              className={styles.addTaskButton}
              aria-label="Add task"
              disabled={!newTask.trim()}
            >Add Task</button>
          </div>

          <div 
            className={styles.taskList}
            role="region"
            aria-label="Pending tasks list"
          >
            {pendingTasks.length === 0 ? (
              <p className={styles.emptyState}>No pending tasks. Add a new task to get started!</p>
            ) : (
              pendingTasks.map(task => (
                <div 
                  key={task.id} 
                  className={styles.taskItem}
                  role="listitem"
                >
                  <label className={styles.taskLabel}>
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className={styles.taskCheckbox}
                      aria-label={`Mark "${task.text}" as ${task.completed ? 'pending' : 'completed'}`}
                    />
                    <span className={styles.taskText}>{task.text}</span>
                  </label>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className={styles.deleteTaskButton}
                    aria-label={`Delete task: ${task.text}`}
                  >
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {showCompletedTasks && (
          <div 
            id="completed-tasks-modal"
            className={styles.completedTasksModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="completed-tasks-title"
          >
            <div 
              className={styles.completedTasksContent}
              role="document"
            >
              <h2 id="completed-tasks-title" className={styles.modalTitle}>
                Completed Tasks
              </h2>
              <div 
                className={styles.completedTasksList}
                role="list"
                aria-label="List of completed tasks"
              >
                {completedTasks.length === 0 ? (
                  <p className={styles.emptyState}>No completed tasks yet.</p>
                ) : (
                  completedTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={styles.completedTaskItem}
                      role="listitem"
                    >
                      {task.text}
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => setShowCompletedTasks(false)}
                className={styles.closeModalButton}
                aria-label="Close completed tasks modal"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}