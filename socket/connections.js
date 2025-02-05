const connection = new Map();

module.exports = {
  connection, 
  addConnection: (address, id) => connection.set(address, id),
  getConnections: () => Array.from(connection.entries()),
  removeConnection: (address) => connection.delete(address)
};
