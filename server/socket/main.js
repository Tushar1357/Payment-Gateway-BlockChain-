const { Server } = require("socket.io");
const {
  addConnection,
  removeConnection,
  getConnections,
} = require("./connections");

let io;

const setupServer = (server) => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`🟢 New client connected: ${socket.id}`);

      socket.on("register_order", (data) => {
        try {
          if (data.address) {
            addConnection(data.address, socket.id);
            socket.join(data.address);
          }
        } catch (error) {
          console.error("Invalid registration data:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [address, socketId] of getConnections()) {
          if (socketId === socket.id) {
            removeConnection(address);
          }
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const broadCastMessage = (address) => {
  try {
    if (io) {
      io.to(address).emit("payment_update", "success");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { setupServer, broadCastMessage };
