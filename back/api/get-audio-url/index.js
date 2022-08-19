const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

const EXPORT_URL = `https://docs.google.com/uc?export=download&id=`;
// type RequestType = {
//   folderId: string,
//   fileName: string;
// }
exports.main = async (req, res) => {
  var jwt = getJwt();
  const fileName = req.query.fileName;
  const folderId = req.query.folderId;

  const drive = google.drive({ version: 'v3', auth: jwt });
  let nextPageToken = '';
  let url = '';

  while (!url) {
    const params = {
      q: `'${folderId}' in parents and trashed = false`,
    };
    if (!!nextPageToken) {
      params.pageToken = nextPageToken;
    }
    const list = await drive.files.list(params);

    const index = list.data.files.findIndex((item) => item.name === fileName);
    if (index >= 0) {
      url = EXPORT_URL + list.data.files[index].id;
      continue;
    }
    nextPageToken = list.data.nextPageToken;
  }

  const result = JSON.stringify({ url });
  res.status(200).type('application/json').end(result);
};

function getJwt() {
  const keys = require('../../credential.json');
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  return client;
}
