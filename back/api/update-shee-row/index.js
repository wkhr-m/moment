const { google } = require('googleapis');
const { getJwt, getApiKey } = require('./../../utils');

const HEADER = ['ja', 'en', 'pronunciation', 'note'];

exports.main = async (req, res) => {
  const jwt = getJwt();
  const apiKey = getApiKey();
  const spreadsheetId = req.query.sheetId;
  const sheetName = req.query.sheetName;
  const sheets = google.sheets({ version: 'v4' });
  let result = '';
  try {
    const header = (
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!1:1`,
        auth: jwt,
        key: apiKey,
      })
    ).data.values[0];

    const headerMap = {};

    for (let index = 0; index < HEADER.length; index++) {
      const item = HEADER[index];
      const headerIndex = header.findIndex((i) => i === item);
      if (headerIndex >= 0) {
        headerMap[item] = headerIndex;
      }
    }

    const row = (
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!${req.body.rowIndex + 1}:${req.body.rowIndex + 1}`,
        auth: jwt,
        key: apiKey,
      })
    ).data.values[0];

    for (let index = 0; index < Object.keys(headerMap).length; index++) {
      const headerItem = Object.keys(headerMap)[index];
      row[headerMap[headerItem]] = req.body.row[headerItem];
    }

    const params = {
      spreadsheetId,
      range: `${sheetName}!${req.body.rowIndex + 1}:${req.body.rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      auth: jwt,
      key: apiKey,
      resource: {
        values: [row],
      },
    };
    result = await sheets.spreadsheets.values.update(params);
  } catch (error) {
    let msg = '読み込みに失敗しました。';
    if (!!error.message) {
      msg = msg + error.message;
    } else {
      switch (error.errors[0].reason) {
        case 'badRequest':
          msg =
            '読み込みに失敗しました。シート名が間違っている可能性があります。';
          break;
        case 'notFound':
          msg =
            '読み込みに失敗しました。スプレッドシートのURLが間違っています。';
          break;
        case 'forbidden':
          msg =
            '読み込みに失敗しました。スプレッドシートが共有されていません。';
          break;
      }
    }
    res.status(500).send(msg);
    return;
  }
  const resultString = JSON.stringify(result.config.data.values[0]);
  res.status(200).type('application/json').json(resultString);
};
