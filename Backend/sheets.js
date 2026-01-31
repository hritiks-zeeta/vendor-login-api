const { google } = require("googleapis");

const SPREADSHEET_ID = "1yqVmk-zfrbaweSntjXLD16RZgMb2lABcMqlA5Zk54a4";
const SHEET_NAME = "UserDatabase";

// 🚨 Hard fail early if env var is missing (prevents silent 500)
if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("GOOGLE_CREDENTIALS environment variable is missing");
}

let credentials;
try {
  credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} catch (err) {
  throw new Error("GOOGLE_CREDENTIALS is not valid JSON");
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({
  version: "v4",
  auth
});

async function loginUser(userId, password) {
  if (!userId || !password) {
    return {
      status: "fail",
      message: "UserID and Password are required"
    };
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:C`
  });

  const rows = response.data.values || [];

  for (const row of rows) {
    const sheetUser = row[0];
    const sheetPass = row[1];
    const dashboardUrl = row[2];

    if (sheetUser === userId && sheetPass === password) {
      return {
        status: "success",
        dashboardUrl
      };
    }
  }

  return {
    status: "fail",
    message: "Invalid UserID or Password"
  };
}

module.exports = { loginUser };