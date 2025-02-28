import { google } from "googleapis";
import { House } from "@/types";
import { houses as fallbackHouses } from "@/data/houses";

export async function getHouseData(): Promise<House[]> {
  try {
    // Set up Google Sheets API
    const auth = new google.auth.GoogleAuth({
      keyFile: "./credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Get spreadsheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${process.env.GOOGLE_SHEET_NAME || "Houses"}!A2:C`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("No data found in spreadsheet");
      return fallbackHouses;
    }

    // Map rows to house objects
    const houses: House[] = rows.map((row) => ({
      name: String(row[0] || ""),
      color: String(row[2] || "#000000"),
      points: parseInt(String(row[1] || "0"), 10),
    }));

    return houses;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return fallbackHouses;
  }
}
