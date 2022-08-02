console.log(process.env);

const express = require('express');
const app = express();
const readSheet = require('./api/read-sheet');

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
