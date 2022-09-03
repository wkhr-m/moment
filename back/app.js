const express = require('express');
const app = express();
const readSheet = require('./api/read-sheet');
const socket_io = require('socket.io')(8081, { cors: { origin: '*' } });

const fs = require('fs');

socket_io.on('connection', (socket) => {
  console.log(socket);
  const result = JSON.parse(fs.readFileSync('./result.json'));

  socket.on('disconnect', function () {
    console.log('disconnect');
  });

  socket.on('on_pronunciation', (data) => {
    console.log(data);
    socket_io.emit('emit_pronunciation', result);
  });
});

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token, mode, credentials, access-control-allow-origin'
  );

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

app.get('/api', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/api/read-sheet', (req, res) => {
  readSheet.main(req, res);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
