const _tasks = [...m_tasks];
const _state = { ...m_state, ..._state };

let m_tasks = [..._tasks];
let m_state = { ..._state };

// ======= BEGIN // Update dependency version
function updateDependencyVersion(taskId, dependencyName, newVersion) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	if (!task.dependencies) task.dependencies = {};
	task.dependencies[dependencyName] = newVersion;
	return true;
}

// BEGIN // Add task update functionality
function getTasksByDependency(dependencyName) {
	return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

function addDependencyUpdateTask(dependencyName, currentVersion, targetVersion) {
	const title = `Update ${dependencyName} from ${currentVersion} to ${targetVersion}`;
	const taskId = addTask(title);
	const task = _tasks.find(t => t.id === taskId);
	if (task) {
		if (!task.dependencies) task.dependencies = {};
		task.dependencies[dependencyName] = { current: currentVersion, target: targetVersion };
		task.tags = task.tags || [];
		task.tags.push('dependency-update');
	}
	return taskId;
}

function getAllDependencies() {
	const dependencies = {};
	_tasks.forEach(task => {
		if (task.dependencies) {
			Object.entries(task.dependencies).forEach(([name, info]) => {
				let version = typeof info === 'string' ? info : info.target;
				if (version && !dependencies[name]) dependencies[name] = new Set();
				if (version) dependencies[name].add(version);
			});
		}
	});
	Object.keys(dependencies).forEach(name => {
		dependencies[name] = Array.from(dependencies[name]);
	});
	return dependencies;
}

function getDependencyUpdateTasks() {
	return _tasks.filter(task => 
		task.tags?.includes('dependency-update') && 
		Object.keys(task.dependencies || {}).length > 0
	);
}

function completeDependencyUpdateTask(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task || !task.tags?.includes('dependency-update')) return false;
	task.completed = true;
	return true;
}

function getDependencyVersionTasks(dependencyName, version) {
	return _tasks.filter(task => 
		task.dependencies?.[dependencyName] && 
		(task.dependencies[dependencyName] === version || 
		task.dependencies[dependencyName]?.target === version)
	);
}

function getDependencyVersions(dependencyName) {
	const versions = new Set();
	_tasks.forEach(task => {
		const dep = task.dependencies?.[dependencyName];
		if (dep && dep !== undefined) {
			const ver = typeof dep === 'string' ? dep : dep.target;
			if (ver) versions.add(ver);
		}
	});
	return Array.from(versions);
}
// ======= END // Update functionality