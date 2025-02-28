import { House } from "@/types";
import { getHouseData } from "@/lib/googleSheetsService";
import { houses as fallbackHouses } from "@/data/houses";

export async function getHouses(): Promise<{
  houses: House[];
  error: string | null;
}> {
  try {
    // Add timeout to prevent long-running requests
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout fetching data")), 5000)
    );

    // Race between fetching data and timeout
    const houses = (await Promise.race([
      getHouseData(),
      timeoutPromise,
    ])) as House[];

    return { houses, error: null };
  } catch (error) {
    console.error("Error fetching houses:", error);
    return {
      houses: fallbackHouses,
      error: "Failed to load house data. Using fallback data.",
    };
  }
}
