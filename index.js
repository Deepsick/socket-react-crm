const { join } = require('path');

const app = require(join(__dirname, 'server'));
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

require('dotenv').config({
  path: join(__dirname, '.env'),
});
const env = process.env.NODE_ENV || 'development';
const dbConfig = require(join(__dirname, 'db', 'config'))[env];

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server is up and running on port ${PORT}`);
  try {
    const { username, password, database, port, host} = dbConfig;
    await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true ,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`Connection to db was established`);
  } catch (error) {
    console.log(error);
  }
});

const activeUsers = {};
const messages = [];

const addUser = ({ socketId, activeRoom = null, userId, username }) => {
  activeUsers[socketId] = {
    socketId,
    username,
    userId,
    activeRoom,
  }
};

const isMessageInHistory = (message, recipientId, userId) => {
  return (message.recipientId === recipientId  && message.senderId === userId) ||
  (message.senderId === recipientId && message.recipientId === userId);
}

io.on('connection', (socket) => {
  const socketId = socket.id;

  socket.on('users:connect', ({ userId, username }) => {
    const newUser = {
      socketId,
      userId,
      username,
    };

    socket.emit('users:list', Object.values(activeUsers));
    addUser(newUser);
    socket.broadcast.emit('users:add', newUser);
  });

  socket.on('disconnect', () => {
    delete activeUsers[socketId];
    socket.broadcast.emit('users:leave', socketId);
  });


  socket.on('message:add', ({ senderId, recipientId, roomId, text }) => {
    messages.push({ senderId, recipientId, roomId, text });
    const recipient = Object.values(activeUsers).find(user => user.userId === recipientId);
    const recipientSocketId = recipient.socketId;;
    const recipientSocket = io.sockets.sockets[recipientSocketId];
    recipientSocket.emit('message:add', { senderId, recipientId, text });
    socket.emit('message:add', { senderId, recipientId, text });
  });

  socket.on('message:history', ({ recipientId, userId }) => {
    const history = messages.filter((message) => isMessageInHistory(message, recipientId, userId));
    socket.emit('message:history', history);
  });
});

