'use client'
import React, { useState, useEffect, KeyboardEvent } from 'react';
import styles from './todo.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';


// base Task Interface
interface Task { 
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}


// Subtype for Recurring Tasks (Implementation of LSP - Liskov Substitution Principle)
interface RecurringTask extends Task {
  recurrenceInterval: 'daily' | 'weekly' | 'monthly';
}

// Union Type for Tasks
type TaskType = Task | RecurringTask;

export default function TodoPage() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Safely retrieve userId only on client-side
    const storedUserId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;
    
    if (storedUserId) {
      setUserId(storedUserId);
      loadTasksFromServer(storedUserId);
    } else {
      router.push('/pages/Login');
    }
  }, [router]);



  const handleLogout = () => {
    // Remove userId from sessionStorage
    sessionStorage.removeItem('userId');
    
    // Redirect to login page
    router.push('/pages/Login');
  };

  // const createXMLString = (tasks: Task[]) => { 
  //   const serializer = new XMLSerializer(); 
  //   const xmlDoc = document.implementation.createDocument(null, 'tasks', null);

  //   tasks.forEach(task => {
  //     const taskElement = xmlDoc.createElement('task');

  //     const id = xmlDoc.createElement('id');
  //     id.textContent = task.id;

  //     const text = xmlDoc.createElement('text');
  //     text.textContent = task.text;

  //     const completed = xmlDoc.createElement('completed');
  //     completed.textContent = task.completed.toString();

  //     const createdAt = xmlDoc.createElement('createdAt');
  //     createdAt.textContent = task.createdAt.toISOString();

  //     taskElement.appendChild(id);
  //     taskElement.appendChild(text);
  //     taskElement.appendChild(completed);
  //     taskElement.appendChild(createdAt);

  //     xmlDoc.documentElement.appendChild(taskElement);
  //   });

  //   return serializer.serializeToString(xmlDoc);
  // };

  // const parseXMLString = (xmlString: string): Task[] => {
  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  //   const taskElements = Array.from(xmlDoc.getElementsByTagName('task'));

  //   return taskElements.map(task => ({
  //     id: task.querySelector('id')?.textContent ?? '',
  //     text: task.querySelector('text')?.textContent ?? '',
  //     completed: task.querySelector('completed')?.textContent === 'true',
  //     createdAt: new Date(task.querySelector('createdAt')?.textContent ?? ''),
  //   }));
  // };
  const createXMLString = (tasks: TaskType[]) => {
    const serializer = new XMLSerializer();
    const xmlDoc = document.implementation.createDocument(null, 'tasks', null);
  
    tasks.forEach((task) => {
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
  
      if ('recurrenceInterval' in task) {
        const recurrenceInterval = xmlDoc.createElement('recurrenceInterval');
        recurrenceInterval.textContent = task.recurrenceInterval;
        taskElement.appendChild(recurrenceInterval);
      }
  
      xmlDoc.documentElement.appendChild(taskElement);
    });
  
    return serializer.serializeToString(xmlDoc);
  };


  const parseXMLString = (xmlString: string): TaskType[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const taskElements = Array.from(xmlDoc.getElementsByTagName('task'));
  
    return taskElements.map((task) => {
      const id = task.querySelector('id')?.textContent ?? '';
      const text = task.querySelector('text')?.textContent ?? '';
      const completed = task.querySelector('completed')?.textContent === 'true';
      const createdAt = new Date(task.querySelector('createdAt')?.textContent ?? '');
  
      const recurrenceInterval = task.querySelector('recurrenceInterval')?.textContent as
        | 'daily'
        | 'weekly'
        | 'monthly'
        | undefined;
  
      if (recurrenceInterval) {
        return { id, text, completed, createdAt, recurrenceInterval };
      } else {
        return { id, text, completed, createdAt };
      }
    });
  };

  const saveTasksToServer = async () => {
    console.log('Current tasks before saving:', tasks);
    
    const xmlString = createXMLString(tasks);
    console.log('XML String Length:', xmlString.length);
    console.log('Number of tasks in XML:', tasks.length);
  
    try {
      const response = await axios.post('http://localhost:5000/task-xml/save-xml', {
        userId, 
        xmlData: xmlString
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const loadTasksFromServer = async (currentUserId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/task-xml/get-xml/${currentUserId}`);
      
      const tasksFromXML = parseXMLString(response.data.xmlData);
      setTasks(tasksFromXML);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // No tasks found is not an error, just set empty tasks
        setTasks([]);
      } else {
        console.error('Error loading tasks from server:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  // const addTask = () => {
  //   if (newTask.trim()) {
  //     const task: Task = {
  //       id: Date.now().toString(),
  //       text: newTask,
  //       completed: false,
  //       createdAt: new Date(),
  //     };
  //     const updatedTasks = [...tasks, task];
  //     setTasks(updatedTasks);
  //     setNewTask('');
      
  //     // Use async/await and ensure the state is updated before saving
  //     const saveTasksAsync = async () => {
  //       await new Promise(resolve => setTimeout(resolve, 0)); // Slight delay to ensure state is updated
  //       await saveTasksToServer();
  //     };
  //     saveTasksAsync();
  //   }
  // };

  const addTask = (isRecurring: boolean = false, recurrenceInterval?: 'daily' | 'weekly' | 'monthly') => {
    if (newTask.trim()) {
      const task: TaskType = isRecurring && recurrenceInterval
        ? {
            id: Date.now().toString(),
            text: newTask,
            completed: false,
            createdAt: new Date(),
            recurrenceInterval,
          }
        : {
            id: Date.now().toString(),
            text: newTask,
            completed: false,
            createdAt: new Date(),
          };
  
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      setNewTask('');
  
      const saveTasksAsync = async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        await saveTasksToServer();
      };
      saveTasksAsync();
    }
  };

  

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newTask = { ...task, completed: !task.completed };
        console.log('Toggling task:', newTask); // Add logging
        return newTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasksToServer(); // Ensure this is called after state update
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToServer(); // This will update the XML with remaining tasks
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <>
      <title>TaskMaster - Organize Your Life, One Task at a Time</title>
      <meta name="description" content="TaskMaster helps you track, manage, and accomplish your goals with ease." />
      <main className={styles.todoContainer} role="main">
        <aside className={styles.sidebar}>
          <button 
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            className={styles.completedTasksButton}
            aria-expanded={showCompletedTasks}
            aria-controls="completed-tasks-modal"
          >
            <span className="sr-only">Show </span>
            Completed Tasks ({completedTasks.length})
          </button>

          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
            aria-label="Logout"
          >
            Logout
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
              
              onClick={() => addTask()} 
              className={styles.addTaskButton}
              aria-label="Add task"
              disabled={!newTask.trim()}
            >
              Add Task
            </button>

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
                  <label className={styles.taskLabel}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      toggleTaskCompletion(task.id);
                    }
                  }}
                  tabIndex={0}>
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className={styles.taskCheckbox}
                      aria-label={`Mark "${task.text}" as ${task.completed ? 'pending' : 'completed'}`}
                    />
                    <span className={styles.taskText}>{task.text}{'recurrenceInterval' in task && (
                    <span className={styles.recurrenceInfo}> (Repeats: {task.recurrenceInterval})</span>
                  )}</span>
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
      </main>
    </>
  );
}