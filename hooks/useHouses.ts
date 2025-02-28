import { useState, useEffect } from "react";
import { House } from "@/types";
import { houses as fallbackHouses } from "@/data/houses";

export function useHouses() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHouses() {
      try {
        setLoading(true);
        const response = await fetch("/api/houses");

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setHouses(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching houses:", err);
        setError("Failed to load house data. Using fallback data.");
        setHouses(fallbackHouses);
      } finally {
        setLoading(false);
      }
    }

    fetchHouses();
  }, []);

  return { houses, loading, error };
}
