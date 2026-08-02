/**
 * Main application entry point
 * Handles task management and utility functions
 */

// Import necessary modules
const fs = require('fs')
const path = require('path')

// Constants
const TASKS_FILE = path.join(__dirname, 'tasks.json')
const DEFAULT_TASKS = []

/**
 * Load tasks from the tasks file
 * @returns {Array} Array of task objects
 */
function loadTasks () {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      return DEFAULT_TASKS
    }
    const data = fs.readFileSync(TASKS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading tasks:', error.message)
    return DEFAULT_TASKS
  }
}

/**
 * Save tasks to the tasks file
 * @param {Array} tasks - Array of task objects to save
 */
function saveTasks (tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving tasks:', error.message)
  }
}

/**
 * Add a new task
 * @param {string} title - The title of the task
 * @param {string} description - The description of the task
 * @returns {Object} The newly created task
 */
function addTask (title, description) {
  const tasks = loadTasks()
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString()
  }
  tasks.push(newTask)
  saveTasks(tasks)
  return newTask
}

/**
 * Complete a task by ID
 * @param {number} id - The ID of the task to complete
 * @returns {Object|null} The completed task or null if not found
 */
function completeTask (id) {
  const tasks = loadTasks()
  const task = tasks.find((t) => t.id === id)
  if (task) {
    task.completed = true
    task.completedAt = new Date().toISOString()
    saveTasks(tasks)
  }
  return task || null
}

/**
 * Delete a task by ID
 * @param {number} id - The ID of the task to delete
 * @returns {boolean} Whether the task was successfully deleted
 */
function deleteTask (id) {
  const tasks = loadTasks()
  const filteredTasks = tasks.filter((t) => t.id !== id)
  if (filteredTasks.length !== tasks.length) {
    saveTasks(filteredTasks)
    return true
  }
  return false
}

/**
 * Get all tasks, optionally filtered by completion status
 * @param {boolean} [completed] - Filter by completion status
 * @returns {Array} Array of task objects
 */
function getTasks (completed) {
  const tasks = loadTasks()
  if (completed === undefined) {
    return tasks
  }
  return tasks.filter((t) => t.completed === completed)
}

/**
 * Update a task by ID
 * @param {number} id - The ID of the task to update
 * @param {Object} updates - The fields to update
 * @returns {Object|null} The updated task or null if not found
 */
function updateTask (id, updates) {
  const tasks = loadTasks()
  const task = tasks.find((t) => t.id === id)
  if (task) {
    Object.assign(task, updates)
    saveTasks(tasks)
  }
  return task || null
}

// Export all functions
module.exports = {
  loadTasks,
  saveTasks,
  addTask,
  completeTask,
  deleteTask,
  getTasks,
  updateTask
}
