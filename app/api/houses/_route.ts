import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getHouses } from "@/lib/getHouses";

export async function GET(request: Request) {
  try {
    const { houses } = await getHouses();
    return NextResponse.json(houses);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch house data" },
      { status: 500 }
    );
  }
}

// Add a POST method for on-demand revalidation with a secret token
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Check for valid token (use an environment variable in production)
  if (token !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    // Revalidate the home page
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
