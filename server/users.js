// manage users, joining in, signing out, add users,
// remove users, keeping track of what rooms each user in.

let users = []

// id of user or socket instance
const addUser = ({ id, name, room }) => {
    if (!name || !room) {
        return { error: "username and room are required" }
    };

    const existingUser = users.find((user) => user.room === room && user.name === name);
    if (existingUser) {
        return { error: "username already exists!" }
    }
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const user = { id, name, room }
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const idx = users.findIndex((user) => user.id === id);
    if (idx !== -1) {
        return users.splice(idx, 1)[0];
    }

};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => {
    users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, users };