const SENTRY_BROWSER_VERSION = '10.70.0';
const POSTHOG_JS_VERSION = '1.417.1';
const TYPESCRIPT_VERSION = '7.0.0';
const NODE_VERSION = '24';

function getDependencyVersions() {
	return {
		sentryBrowser: SENTRY_BROWSER_VERSION,
		posthogJs: POSTHOG_JS_VERSION,
		typescript: TYPESCRIPT_VERSION,
		node: NODE_VERSION
	};
}

if (room === undefined || room === null) {
	throw new Error(`Room ${roomId} not found`);
}
if (room.users.length >= room.capacity) {
	throw new Error(`Room ${roomId} is full`);
}
if (room.users.some(u => u.id === userId)) {
	throw new Error(`User ${userId} is already in room ${roomId}`);
}
const user = {
	id: userId,
	joinedAt: new Date(),
	...userData
};
room.users.push(user);
this.users.set(userId, roomId);
return {
	room,
	user
};
}

leaveRoom(roomId, userId) {
	const room = this.rooms.get(roomId);
	if (room === undefined || room === null) {
		throw new Error(`Room ${roomId} not found`);
	}
	const userIndex = room.users.findIndex(u => u.id === userId);
	if (userIndex === -1) {
		throw new Error(`User ${userId} not found in room ${roomId}`);
	}
	room.users.splice(userIndex, 1);
	this.users.delete(userId);
	if (room.users.length === 0) {
		room.isActive = false;
	}
	return true;
}

deleteRoom(roomId) {
	const room = this.rooms.get(roomId);
	if (room === undefined || room === null) {
		throw new Error(`Room ${roomId} not found`);
	}
	room.users.forEach(user => {
		this.users.delete(user.id);
	});
	this.rooms.delete(roomId);
	return true;
}

getRoomUsers(roomId) {
	const room = this.rooms.get(roomId);
	return room ? room.users : [];
}

getUserRoom(userId) {
	const roomId = this.users.get(userId);
	return roomId ? this.rooms.get(roomId) : null;
}

getAllRooms() {
	return [...this.rooms.values()];
}

getActiveRooms() {
	return this.getAllRooms().filter(room => room.isActive);
}

updateRoom(roomId, updates) {
	const room = this.rooms.get(roomId);
	if (room === undefined || room === null) {
		throw new Error(`Room ${roomId} not found`);
	}
	const allowedUpdates = ['name', 'capacity', 'isActive'];
	for (const key of Object.keys(updates)) {
		if (allowedUpdates.includes(key)) {
			room[key] = updates[key];
		}
	}
	return room;
}

processEmotion(emotion) {
	const message = 'This is a properly terminated string';
}

updateDependencies(dependencies) {
}

fixGitstreamConfig() {
}