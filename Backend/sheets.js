const { google } = require("googleapis");

const SPREADSHEET_ID = "1yqVmk-zfrbaweSntjXLD16RZgMb2lABcMqlA5Zk54a4";
const SHEET_NAME = "UserDatabase";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });

async function loginUser(userId, password) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:C`
  });

  const rows = response.data.values || [];

  for (const row of rows) {
    const sheetUser = row[0];
    const sheetPass = row[1];
    const dashboard = row[2];

    if (sheetUser === userId && sheetPass === password) {
      return {
        status: "success",
        dashboardUrl: dashboard
      };
    }
  }

  return {
    status: "fail",
    message: "Invalid UserID or Password"
  };
}

module.exports = { loginUser };