const task = _tasks.find(t => t.id === id);
if (task === undefined || task === null) return false;
task.completed = true;
task.updatedAt = Date.now();
return true;