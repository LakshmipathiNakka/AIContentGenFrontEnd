import { google } from 'googleapis';

// Initialize the Google Sheets API
const sheets = google.sheets('v4');

// Function to format questions data for Google Sheets
export const formatQuestionsForSheets = (questions) => {
  // Create headers
  const headers = ['Question', 'Type', 'Difficulty', 'Options', 'Correct Answer', 'Explanation'];
  
  // Format questions data
  const rows = questions.map(q => [
    q.question,
    q.type,
    q.difficulty,
    q.options ? q.options.join(' | ') : '',
    q.correctAnswer,
    q.explanation || ''
  ]);

  return [headers, ...rows];
};

// Function to update an existing Google Sheet
export const updateGoogleSheet = async (questions, sheetId) => {
  try {
    // Initialize the Google API client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();

    // Format the data
    const values = formatQuestionsForSheets(questions);

    // Update the spreadsheet with the questions data
    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId: sheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    // Format the spreadsheet (e.g., bold the header row and auto-resize columns)
    await sheets.spreadsheets.batchUpdate({
      auth: client,
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.8,
                    green: 0.8,
                    blue: 0.8,
                  },
                  textFormat: {
                    bold: true,
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 6,
              },
            },
          },
        ],
      },
    });

    // Return the URL for the Google Sheet
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=0`;
    return spreadsheetUrl;
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
};
