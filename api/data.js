
let users = [];
let nextId = 1;

function getAllUsers() {
  return users;
}

function getUserById(id) {
  return users.find(user => user.id === id);
}

function addUser({ name, email, role }) {
  const newUser = {
    id: nextId++,
    name,
    email,
    role,
    created: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
}

function updateUser(id, updatedData) {
  const user = getUserById(id);
  if (!user) return null;

  Object.assign(user, updatedData);
  return user;
}

function deleteUser(id) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser
};
