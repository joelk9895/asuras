import { NextResponse } from "next/server";
import { getChakravyuhEvents } from "@/lib/googleSheetsService";

export const dynamic = "force-dynamic"; // Ensures the route is always dynamic

export async function GET() {
  try {
    const events = await getChakravyuhEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error in Chakravyuh API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch Chakravyuh events" },
      { status: 500 }
    );
  }
}
