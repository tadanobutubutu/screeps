const executeTask = (options, callback) => {
  const config = Object.assign({}, DEFAULT_CONFIG, options);
  
  try {
    const result = callback(config);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const createTask = (name, params) => ({
  id: Date.now(),
  name,
  params,
  status: 'pending',
  createdAt: new Date().toISOString()
});

const updateTask = (task, updates) => Object.assign({}, task, updates, {
  updatedAt: new Date().toISOString()
});

const deleteTask = (tasks, taskId) => tasks.filter(task => task.id !== taskId);

const DEFAULT_CONFIG = {
  timeout: 5000,
  retries: 3,
  priority: 'normal'
};

module.exports = {
  executeTask,
  createTask,
  updateTask,
  deleteTask,
  DEFAULT_CONFIG
};

// ... (rest of main.js code)