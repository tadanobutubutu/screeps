const { OAuth2Client } = require('google-auth-library');
const http = require('http');

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

function generateAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile']
  });
}

// TODO: Address accessibility issues from insight report

module.exports = {
  oAuth2Client,
  generateAuthUrl
};