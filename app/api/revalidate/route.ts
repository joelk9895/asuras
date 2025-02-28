import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Check the token (use an environment variable in production)
    if (token !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Get the path to revalidate from the request body
    const body = await request.json();
    const path = body.path || "/";

    // Revalidate the path
    revalidatePath(path);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: err },
      { status: 500 }
    );
  }
}
