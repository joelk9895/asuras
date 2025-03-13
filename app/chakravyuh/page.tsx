"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { ChakravyuhData } from "@/types";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function ChakravyuhPage() {
  const [data, setData] = useState<ChakravyuhData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chakravyuh");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        // Process the data to merge items with the same event name
        const eventMap = new Map<string, ChakravyuhData[]>();

        // Group by event name
        result.forEach((item: ChakravyuhData) => {
          if (!eventMap.has(item.event)) {
            eventMap.set(item.event, []);
          }
          eventMap.get(item.event)?.push(item);
        });

        // Use the processed data
        const processedData = Array.from(eventMap.entries()).map(
          ([eventName, items]) => {
            // If there's only one item for this event, return it as is
            if (items.length === 1) {
              return items[0];
            }

            // Helper function to safely join non-null values
            const joinNonNull = (values: (string | null)[]) => {
              const filteredValues = values.filter(
                (v) => v !== null && v !== undefined && v !== ""
              );
              return filteredValues.length > 0
                ? Array.from(new Set(filteredValues)).join(" & ")
                : null;
            };

            // For multiple items with the same event name (ties)
            return {
              event: eventName,
              // Check for ties in first place
              firstName: joinNonNull(items.map((i) => i.firstName)),
              firstHouse: joinNonNull(items.map((i) => i.firstHouse)),
              // Check for ties in second place as well
              secondName: joinNonNull(items.map((i) => i.secondName)),
              secondHouse: joinNonNull(items.map((i) => i.secondHouse)),
              // Check for ties in third place as well
              thirdName: joinNonNull(items.map((i) => i.thirdName)),
              thirdHouse: joinNonNull(items.map((i) => i.thirdHouse)),
              // Add optional properties required by ChakravyuhData type
              filteredHouse: null,
              filteredPositions: [],
            } as ChakravyuhData;
          }
        );

        setData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  // Get unique house names from data for filter options
  const getUniqueHouses = () => {
    if (!data) return [];

    const houses = new Set<string>();
    data.forEach((item) => {
      if (item.firstHouse) houses.add(item.firstHouse);
      if (item.secondHouse) houses.add(item.secondHouse);
      if (item.thirdHouse) houses.add(item.thirdHouse);
    });

    return Array.from(houses).sort();
  };

  // Get unique event types for filter options
  const getUniqueEvents = () => {
    if (!data) return [];

    const events = new Set<string>();
    data.forEach((item) => {
      if (item.event) events.add(item.event);
    });

    return Array.from(events).sort();
  };

  // Filter the data based on selected filter
  const filteredData = () => {
    if (!data) return [];
    if (filter === "all") return data;

    // Check if we're filtering by an event
    if (getUniqueEvents().includes(filter)) {
      return data.filter((item) => item.event === filter);
    }

    // If we're filtering by house, show only events where that house placed
    const houseEvents = data.filter(
      (item) =>
        item.firstHouse === filter ||
        item.secondHouse === filter ||
        item.thirdHouse === filter
    );

    // Transform the data to highlight the filtered house's placements
    return houseEvents.map((item) => {
      const eventCopy = { ...item };

      // Get all positions where the filtered house appears
      const positions = [];
      if (item.firstHouse === filter) positions.push("first");
      if (item.secondHouse === filter) positions.push("second");
      if (item.thirdHouse === filter) positions.push("third");

      // Set the house filter indicators
      eventCopy.filteredHouse = filter;
      eventCopy.filteredPositions = positions;

      return eventCopy;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">
          <span className="inline-block animate-spin mr-3">⏳</span>
          Loading event data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg mb-4 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black px-4 py-6 sm:p-8">
      <img
        src="/logo.png"
        className="w-screen h-screen object-cover opacity-20 fixed top-0 left-0"
        alt="Background logo"
      />

      <main className="mx-auto max-w-5xl relative z-10">
        <motion.h1
          className={`mb-8 sm:mb-12 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-r from-emerald-300 to-green-500 text-transparent bg-clip-text drop-shadow-sm ${instrument.className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Chakravyuh
        </motion.h1>

        <Link href="/" className="block w-full text-center mb-4">
          <button className="text-white/70 px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300">
            ← Back to Leaderboard
          </button>
        </Link>

        {/* Filter dropdown */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-xs">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-white/20 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
            >
              <option value="all">All Events</option>
              <optgroup label="Filter by House">
                {getUniqueHouses().map((house) => (
                  <option key={`house-${house}`} value={house}>
                    {house}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Filter by Event">
                {getUniqueEvents().map((event) => (
                  <option key={`event-${event}`} value={event}>
                    {event}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {Array.isArray(data) && (
          <motion.div
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredData().map((item, i) => {
              // Check if it's a group event
              const isGroupEvent = !(
                item.firstName &&
                item.secondName &&
                item.thirdName
              );

              // Check if we're filtering by house
              const isHouseFiltered = getUniqueHouses().includes(filter);
              const filteredPositions = item.filteredPositions || [];

              return (
                <motion.div
                  key={i}
                  className="bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group hover:border-green-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="p-5 relative overflow-hidden">
                    <h2
                      className={`text-xl font-bold text-white mb-4 ${instrument.className}`}
                    >
                      {item.event}{" "}
                      {isGroupEvent && (
                        <span className="text-green-400 text-sm">(Group)</span>
                      )}
                      {isHouseFiltered && filteredPositions.length > 1 && (
                        <div className="text-green-400 text-sm mt-1">
                          {filter} - Multiple Placements
                        </div>
                      )}
                      {isHouseFiltered && filteredPositions.length === 1 && (
                        <div className="text-green-400 text-sm mt-1">
                          {filter} -{" "}
                          {filteredPositions[0] === "first"
                            ? "1st Place"
                            : filteredPositions[0] === "second"
                            ? "2nd Place"
                            : "3rd Place"}
                        </div>
                      )}
                    </h2>

                    <div className="space-y-3">
                      {/* If house is filtered, show all positions where that house placed */}
                      {isHouseFiltered ? (
                        <>
                          {filteredPositions.includes("first") && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 to-yellow-500 text-amber-900 flex items-center justify-center mr-2 shadow-md">
                                <span
                                  className={`text-sm font-bold ${instrument.className}`}
                                >
                                  1
                                </span>
                              </div>
                              <div className="flex-grow">
                                {isGroupEvent ? (
                                  <p className="text-white font-medium text-base">
                                    {filter}
                                  </p>
                                ) : (
                                  <>
                                    <p className="text-white font-medium capitalize">
                                      {item.firstName?.toLowerCase()}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                      {filter}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {filteredPositions.includes("second") && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 flex items-center justify-center mr-2 shadow-md">
                                <span
                                  className={`text-sm font-bold ${instrument.className}`}
                                >
                                  2
                                </span>
                              </div>
                              <div className="flex-grow">
                                {isGroupEvent ? (
                                  <p className="text-white font-medium text-base">
                                    {filter}
                                  </p>
                                ) : (
                                  <>
                                    <p className="text-white font-medium capitalize">
                                      {item.secondName?.toLowerCase()}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                      {filter}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {filteredPositions.includes("third") && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-amber-100 flex items-center justify-center mr-2 shadow-md">
                                <span
                                  className={`text-sm font-bold ${instrument.className}`}
                                >
                                  3
                                </span>
                              </div>
                              <div className="flex-grow">
                                {isGroupEvent ? (
                                  <p className="text-white font-medium text-base">
                                    {filter}
                                  </p>
                                ) : (
                                  <>
                                    <p className="text-white font-medium capitalize">
                                      {item.thirdName?.toLowerCase()}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                      {filter}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // Show all three placements when not filtering by house
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 to-yellow-500 text-amber-900 flex items-center justify-center mr-2 shadow-md">
                              <span
                                className={`text-sm font-bold ${instrument.className}`}
                              >
                                1
                              </span>
                            </div>
                            <div className="flex-grow">
                              {isGroupEvent ? (
                                <p className="text-white font-medium text-base">
                                  {item.firstHouse}
                                </p>
                              ) : (
                                <>
                                  <p className="text-white font-medium capitalize">
                                    {item.firstName?.toLowerCase()}
                                  </p>
                                  <p className="text-white/60 text-sm">
                                    {item.firstHouse}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 flex items-center justify-center mr-2 shadow-md">
                              <span
                                className={`text-sm font-bold ${instrument.className}`}
                              >
                                2
                              </span>
                            </div>
                            <div>
                              {isGroupEvent ? (
                                <p className="text-white font-medium text-base">
                                  {item.secondHouse}
                                </p>
                              ) : (
                                <>
                                  <p className="text-white font-medium capitalize">
                                    {item.secondName?.toLowerCase()}
                                  </p>
                                  <p className="text-white/60 text-sm">
                                    {item.secondHouse}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-amber-100 flex items-center justify-center mr-2 shadow-md">
                              <span
                                className={`text-sm font-bold ${instrument.className}`}
                              >
                                3
                              </span>
                            </div>
                            <div>
                              {isGroupEvent ? (
                                <p className="text-white font-medium text-base">
                                  {item.thirdHouse}
                                </p>
                              ) : (
                                <>
                                  <p className="text-white font-medium capitalize">
                                    {item.thirdName?.toLowerCase()}
                                  </p>
                                  <p className="text-white/60 text-sm">
                                    {item.thirdHouse}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/0 to-emerald-400/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {Array.isArray(data) && filteredData().length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/70">No events match your filter</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-2 text-green-400 hover:text-green-300"
            >
              Clear filter
            </button>
          </div>
        )}
      </main>

      <p className="mx-auto text-center mt-10 text-white/70 text-sm">
        Crafted by <span className={instrument.className}>pixellab</span>
      </p>
    </div>
  );
}
