const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

// ヘッダーの種類
const HEADER = ['ja', 'en', 'pronanciation', 'section', 'audioUrl', 'note'];
// 最低限必要なヘッダー
const NEED_HEADER = ['ja', 'en', 'section'];

exports.main = async (req, res) => {
  var jwt = getJwt();
  var apiKey = getApiKey();
  var spreadsheetId = req.query.sheetId;
  var range = req.query.sheetName;
  const sheets = google.sheets({ version: 'v4' });

  const title = (
    await sheets.spreadsheets.get({
      includeGridData: false,
      spreadsheetId,
      auth: jwt,
      key: apiKey,
    })
  ).data.properties.title;

  const response = (
    await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      auth: jwt,
      key: apiKey,
    })
  ).data;

  const result = JSON.stringify({
    id: spreadsheetId,
    title,
    sentenses: parseValue(response.values),
  });
  res.status(200).type('application/json').end(result);
};

function parseValue(data) {
  const header = data[0].map((item) => item.trim());
  // ヘッダーが最低限のもの(NEED_HEADER)を含むかどうか確認
  if (header.map((item) => NEED_HEADER.includes(item)).includes(false)) {
    new Error('Lack header item!');
  }
  const headerIndexMap = {};
  for (const item of HEADER) {
    const index = header.findIndex((i) => i === item);
    if (index >= 0) {
      headerIndexMap[index] = item;
    }
  }

  const resultList = [];
  for (let index = 1; index < data.length; index++) {
    const item = data[index];
    const result = {};
    for (const clomnIndex in headerIndexMap) {
      result[header[clomnIndex]] = item[clomnIndex];
    }
    resultList.push(result);
  }
  return resultList;
}

function getJwt() {
  const keys = require('./../../credential.json');
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return client;
}

function getApiKey() {
  var apiKeyFile = require('./../../api_key.json');
  return apiKeyFile.key;
}
