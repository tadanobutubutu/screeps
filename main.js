// Task management and dependency handling for the Screeps bot
// ------------------------------------------------------------
let _tasks = [];
let _nextId = 1;

// ---------- Logging Utilities ----------
const logging = {
	info: console.log.bind(console, '[INFO] %s'),
	warn: console.warn.bind(console, '[WARN] %s'),
	error: console.error.bind(console, '[ERROR] %s'),
	debug: console.debug.bind(console, '[DEBUG] %s'),
	formatLogEntry: (level, message) => `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`,
	log: (level, message, data) => {
		const entry = logging.formatLogEntry(level, message);
		if (data !== undefined) console.log(entry, data);
		else console.log(entry);
	}
};

// ---------- Task CRUD ----------
function addTask(title, priority = 'medium') {
	const task = {
		id: _nextId++,
		title: title,
		completed: false,
		createdAt: Date.now(),
		tags: [],
		priority: priority,
		dependencies: {}
	};
	_tasks.push(task);
	return task.id;
}

function updateTaskPriority(taskId, newPriority) {
	const task = _tasks.find(t => t.id === taskId);
	if (task === null) return false;
	task.priority = newPriority;
	return true;
}

function completeTask(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	task.completed = true;
	return true;
}

function removeTask(taskId) {
	const index = _tasks.findIndex(t => t.id === taskId);
	if (index === -1) return false;
	_tasks.splice(index, 1);
	return true;
}

function findTasks(searchTerm) {
	return _tasks.filter(task =>
		task.title.toLowerCase().includes(searchTerm.toLowerCase())
	);
}

function getTaskById(taskId) {
	return _tasks.find(t => t.id === taskId) || null;
}

function listTasks() {
	return _tasks.slice();
}

// ---------- Dependency Utilities ----------
function updateDependencyVersion(taskId, dependencyName, newVersion) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	if (!task.dependencies) task.dependencies = {};
	task.dependencies[dependencyName] = newVersion;
	return true;
}

function getAllUniqueDependencies() {
	const dependencies = new Set();
	_tasks.forEach(task => {
		if (task.dependencies) {
			Object.keys(task.dependencies).forEach(name => {
				dependencies.add(name);
			});
		}
	});
	return Array.from(dependencies);
}

function getDependencyUpdateTasksWithVersions(dependencyName) {
	return _tasks
		.filter(task =>
			task.tags?.includes('dependency-update') &&
			task.dependencies &&
			task.dependencies[dependencyName]
		)
		.map(task => {
			const depInfo = task.dependencies[dependencyName];
			return {
				id: task.id,
				title: task.title,
				completed: task.completed,
				createdAt: task.createdAt,
				currentVersion: typeof depInfo === 'string' ? depInfo : depInfo.current,
				targetVersion: typeof depInfo === 'string' ? depInfo : depInfo.target,
				priority: task.priority
			};
		});
}

// ---------- Tag Operations ----------
function addTag(taskId, tag) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	if (!task.tags.includes(tag)) {
		task.tags.push(tag);
	}
	return true;
}

function removeTag(taskId, tag) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	const index = task.tags.indexOf(tag);
	if (index !== -1) {
		task.tags.splice(index, 1);
		return true;
	}
	return false;
}

// ---------- Filtering & Analyses ----------
function getDependencyUpdateTasksByStatus() {
	const result = { completed: [], pending: [] };
	const now = Date.now();
	const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	_tasks.forEach(task => {
		if (task.tags?.includes('dependency-update')) {
			const taskInfo = {
				id: task.id,
				title: task.title,
				createdAt: task.createdAt,
				dependencies: task.dependencies || {},
				priority: task.priority
			};
			if (task.completed) {
				result.completed.push(taskInfo);
			} else if (now - task.createdAt > overdueTime) {
				result.pending.push(taskInfo);
			}
		}
	});
	return result;
}

// ---------- Additional Dependency Functions ----------
function getTasksCreatedAfter(timestamp) {
	return _tasks.filter(task => (task.createdAt || 0) > timestamp);
}

function getTasksMissingDependencyAndNotCompleted(dependencyName) {
	return _tasks.filter(task =>
		!task.completed &&
		(!task.dependencies || !task.dependencies[dependencyName])
	);
}

function getDependencyUpdateProgress(dependencyName) {
	const tasks = getDependencyVersionTasks(dependencyName);
	if (tasks.length === 0) return 0;
	const completed = tasks.filter(t => t.completed).length;
	return (completed / tasks.length) * 100;
}

function getDependencyUpdateTaskCounts() {
	const counts = {
		total: 0,
		completed: 0,
		pending: 0,
		overdue: 0
	};
	const now = Date.now();
	const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	_tasks.forEach(task => {
		if (task.tags?.includes('dependency-update')) {
			counts.total++;
			if (task.completed) counts.completed++;
			else if (now - task.createdAt > overdueTime) counts.overdue++;
			else counts.pending++;
		}
	});
	return counts;
}

module.exports = {
	addTask,
	updateTaskPriority,
	getTasksByPriorityAndDependencies,
	listTasks,
	completeTask,
	removeTask,
	findTasks,
	getTaskById,
	getAllUniqueDependencies,
	getDependencyUpdateTasksWithVersions,
	getDependencyUpdateTasksByStatus,
	getTasksCreatedAfter,
	getTasksMissingDependencyAndNotCompleted,
	getDependencyUpdateProgress,
	getDependencyUpdateTaskCounts,
	addTag,
	removeTag
};