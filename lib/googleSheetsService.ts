import { google } from "googleapis";
import { ChakravyuhData, House, LayatharangData } from "@/types";
import { houses as fallbackHouses } from "@/data/houses";

export const getGCPCredentials = () => {
  // for Vercel, use environment variables
  return process.env.GCP_PRIVATE_KEY
    ? {
        credentials: {
          client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        projectId: process.env.GCP_PROJECT_ID,
      }
    : // for local development, use gcloud CLI or fallback to local env vars
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    ? {
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
      }
    : {};
};

export async function getHouseData(): Promise<House[]> {
  try {
    // Set up Google Sheets API with GCP credentials
    const auth = new google.auth.GoogleAuth({
      ...getGCPCredentials(),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Get spreadsheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${process.env.GOOGLE_SHEET_NAME || "Houses"}!A2:E`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("No data found in spreadsheet");
      return fallbackHouses;
    }

    // Map rows to house objects
    const houses: House[] = rows.map((row) => ({
      name: String(row[0] || ""),
      color: String(row[4] || "#000000"),
      layatharang: parseInt(String(row[1] || "0"), 10),
      chakravyuh: parseInt(String(row[2] || "0"), 10),
      points: parseInt(String(row[3] || "0"), 10),
    }));
    console.log("Fetched houses from Google Sheets:", houses);

    return houses;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return fallbackHouses;
  }
}

export async function getLayatharangEvents(): Promise<LayatharangData[]> {
  try {
    // Set up Google Sheets API with GCP credentials
    const auth = new google.auth.GoogleAuth({
      ...getGCPCredentials(),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Get spreadsheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Layatharang!A2:G`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("No data found in spreadsheet");
      return [];
    }

    // Map rows to event objects
    const events: LayatharangData[] = rows.map((row) => ({
      event: String(row[0] || ""),
      firstName: String(row[1] || ""),
      firstHouse: String(row[2] || ""),
      secondName: String(row[3] || ""),
      secondHouse: String(row[4] || ""),
      thirdName: String(row[5] || ""),
      thirdHouse: String(row[6] || ""),
    }));
    console.log("Fetched Layatharang events from Google Sheets:", events);

    return events;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return [];
  }
}

export async function getChakravyuhEvents(): Promise<ChakravyuhData[]> {
  try {
    // Set up Google Sheets API with GCP credentials
    const auth = new google.auth.GoogleAuth({
      ...getGCPCredentials(),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Get spreadsheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Chakravyuh!A2:G`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("No data found in spreadsheet");
      return [];
    }

    // Map rows to event objects
    const events: ChakravyuhData[] = rows.map((row) => ({
      event: String(row[0] || ""),
      firstName: String(row[1] || ""),
      firstHouse: String(row[2] || ""),
      secondName: String(row[3] || ""),
      secondHouse: String(row[4] || ""),
      thirdName: String(row[5] || ""),
      thirdHouse: String(row[6] || ""),
    }));
    console.log("Fetched Chakravyuh events from Google Sheets:", events);

    return events;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return [];
  }
}
