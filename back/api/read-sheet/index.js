const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

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
  const header = data[0];
  const resultList = [];
  for (let index = 1; index < data.length; index++) {
    const item = data[index];
    const result = {};
    for (const clomnIndex in header) {
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
