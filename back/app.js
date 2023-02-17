const express = require('express');
const app = express();
const readSheet = require('./api/read-sheet');
const updateSheetRow = require('./api/update-shee-row');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/api/try', async (req, res) => {
  const url =
    'https://docs.google.com/uc?export=download&id=117JLBKrF82jMKzhqe1RZczKokw4aoJPk';
  const redirect_url = await get_redirect_url(url).catch((err) => {
    console.log(err);
  });

  // リダイレクト先URLを出力
  if (redirect_url) {
    console.log(redirect_url);
  }
});

function get_redirect_url(src_url) {
  return new Promise((resolve, reject) => {
    try {
      // https と http で使うモジュールを変える
      const client = src_url.startsWith('https') ? https : http;
      // 4xx や 5xx ではエラーが発生しないので注意
      client
        .get(src_url, (res) => {
          // HTTP レスポンスから Location ヘッダを取得 (ヘッダ名は小文字)
          resolve(res.headers['location']);
        })
        .on('error', (err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

app.get('/api/read-sheet', (req, res) => {
  readSheet.main(req, res);
});

app.post('/api/update-sheet-row', (req, res) => {
  updateSheetRow.main(req, res);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
