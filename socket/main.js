const {Server} = require('socket.io')
const {addConnection,removeConnection} = require('./connections');

let io;
const setupServer = (server) => {
  io = new Server(server);
  io.on("connection", (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    socket.on("register_order", (data) => {
      try {
        if (data.address) {
          addConnection(address, socket.id);
          socket.join(data.address); 
          console.log(`Registered orderId: ${data.orderId}`);
        }
      } catch (error) {
        console.error("Invalid registration data:", error);
      }
    });


    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      for (const [address, socketId] of orderClients.entries()) {
        if (socketId === socket.id) {
          removeConnection(address)
        }
      }
    });
  })
  
}

const broadCastMessage = (address) => {
  if (io){
    io.to(address).emit("payment_update", "success")
  }
}

module.exports = {setupServer, broadCastMessage}