const { JWT } = require('google-auth-library');

exports.getJwt = () => {
  const keys = require('./../credential.json');
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return client;
};

exports.getApiKey = () => {
  var apiKeyFile = require('./../api_key.json');
  return apiKeyFile.key;
};
