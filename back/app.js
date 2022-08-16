const express = require('express');
const app = express();
const readSheet = require('./api/read-sheet');

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

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/read-sheet', (req, res) => {
  readSheet.main(req, res);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
