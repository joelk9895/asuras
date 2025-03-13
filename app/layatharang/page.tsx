"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { LayatharangData } from "@/types";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function LayatharangPage() {
  const [rawData, setRawData] = useState<LayatharangData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/layatharang");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setRawData(result);
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

  // Get unique house names from raw data for filter options
  const getUniqueHouses = () => {
    if (!rawData) return [];

    const houses = new Set<string>();

    // Process all house names in the data
    rawData.forEach((item) => {
      // Helper function to add individual houses from a potentially combined house string
      const addHouses = (houseString: string | null) => {
        if (!houseString) return;
        // Split by " & " and add each house individually
        houseString.split(" & ").forEach((house) => {
          if (house.trim()) houses.add(house.trim());
        });
      };

      // Process all position houses
      addHouses(item.firstHouse);
      addHouses(item.secondHouse);
      addHouses(item.thirdHouse);
    });

    return Array.from(houses).sort();
  };

  // Get unique event types for filter options
  const getUniqueEvents = () => {
    if (!rawData) return [];

    const events = new Set<string>();
    rawData.forEach((item) => {
      if (item.event) events.add(item.event);
    });

    return Array.from(events).sort();
  };

  // Create a new helper to get unique names
  function getUniqueNames() {
    if (!rawData) return [];
    const names = new Set<string>();
    rawData.forEach((item) => {
      splitCombinedField(item.firstName).forEach((n) => names.add(n));
      splitCombinedField(item.secondName).forEach((n) => names.add(n));
      splitCombinedField(item.thirdName).forEach((n) => names.add(n));
    });
    return Array.from(names).sort();
  }

  // Helper to split " & "-separated strings
  const splitCombinedField = (value: string | null) => {
    if (!value) return [];
    return value
      .split(" & ")
      .map((v) => v.trim())
      .filter((v) => v);
  };

  // Define a type for the processed data items
  type ProcessedItem = LayatharangData & {
    allHouses?: string[];
    allNames?: string[];
    filteredHouse?: string | null;
    filteredPositions?: string[];
    filteredNames?: Record<string, string | null>;
  };

  // Filter raw data and then process it
  const processedData = (): ProcessedItem[] => {
    if (!rawData) return [];

    // Step 1: Convert raw fields into arrays for easier filtering
    const enrichedData = rawData.map((item) => ({
      ...item,
      allHouses: [
        ...splitCombinedField(item.firstHouse),
        ...splitCombinedField(item.secondHouse),
        ...splitCombinedField(item.thirdHouse),
      ],
      allNames: [
        ...splitCombinedField(item.firstName),
        ...splitCombinedField(item.secondName),
        ...splitCombinedField(item.thirdName),
      ],
    }));

    // Step 2: Filter on raw house/name data
    let filtered = enrichedData;

    if (filter !== "all") {
      // If filter is an event
      if (getUniqueEvents().includes(filter)) {
        filtered = enrichedData.filter((item) => item.event === filter);
      }
      // If filter matches a name
      else if (getUniqueNames().includes(filter)) {
        filtered = enrichedData.filter((item) =>
          item.allNames.includes(filter)
        );
      } else {
        // If filter is a house from raw houses
        filtered = enrichedData.filter((item) =>
          item.allHouses.includes(filter)
        );

        // Capture which positions this house took
        filtered = filtered.map((item) => {
          const positions: string[] = [];
          const filteredNames: Record<string, string | null> = {};

          if (
            item.firstHouse &&
            splitCombinedField(item.firstHouse).includes(filter)
          ) {
            positions.push("first");
            filteredNames.firstName = item.firstName;
          }
          if (
            item.secondHouse &&
            splitCombinedField(item.secondHouse).includes(filter)
          ) {
            positions.push("second");
            filteredNames.secondName = item.secondName;
          }
          if (
            item.thirdHouse &&
            splitCombinedField(item.thirdHouse).includes(filter)
          ) {
            positions.push("third");
            filteredNames.thirdName = item.thirdName;
          }

          return {
            ...item,
            filteredHouse: filter,
            filteredPositions: positions,
            filteredNames,
          };
        });
      }
    }

    // Step 3: Merge tied events after filtering
    const eventMap = new Map<string, (typeof filtered)[number][]>();
    filtered.forEach((item) => {
      if (!eventMap.has(item.event)) eventMap.set(item.event, []);
      eventMap.get(item.event)?.push(item);
    });

    // Helper to safely join as string | null rather than string | undefined
    const joinNonNull = (vals: (string | null)[]): string | null => {
      const joined = Array.from(new Set(vals.filter(Boolean))).join(" & ");
      return joined ? joined : null;
    };

    return Array.from(eventMap.entries()).map(([eventName, items]) => {
      if (items.length === 1) return items[0];

      // Define a type that includes the filteredNames property
      type EnrichedItem = LayatharangData & {
        allHouses?: string[];
        allNames?: string[];
        filteredHouse?: string;
        filteredPositions?: string[];
        filteredNames?: Record<string, string | null>;
      };

      const allFilteredPositions = items
        .flatMap((i) => i.filteredPositions || [])
        .filter((pos, idx, arr) => arr.indexOf(pos) === idx);

      const mergedFilteredNames: Record<string, string | null> = {};
      items.forEach((i) => {
        const enrichedItem = i as EnrichedItem;
        if (enrichedItem.filteredNames) {
          Object.entries(enrichedItem.filteredNames).forEach(([k, v]) => {
            if (v) mergedFilteredNames[k] = v;
          });
        }
      });

      // Cast as ProcessedItem to ensure types align correctly
      return {
        event: eventName,
        firstName: joinNonNull(items.map((i) => i.firstName)),
        firstHouse: joinNonNull(items.map((i) => i.firstHouse)),
        secondName: joinNonNull(items.map((i) => i.secondName)),
        secondHouse: joinNonNull(items.map((i) => i.secondHouse)),
        thirdName: joinNonNull(items.map((i) => i.thirdName)),
        thirdHouse: joinNonNull(items.map((i) => i.thirdHouse)),
        filteredHouse: filter !== "all" ? filter : null,
        filteredPositions: allFilteredPositions.length
          ? allFilteredPositions
          : undefined,
        filteredNames: Object.keys(mergedFilteredNames).length
          ? mergedFilteredNames
          : undefined,
      } as ProcessedItem;
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
          className={`mb-8 sm:mb-12 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-r from-fuchsia-400 via-pink-500 to-rose-400 text-transparent bg-clip-text drop-shadow-sm ${instrument.className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Layatharang
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
              className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-white/20 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
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
              {/* Add filter by name */}
              <optgroup label="Filter by Name">
                {getUniqueNames().map((name) => (
                  <option key={`name-${name}`} value={name}>
                    {name}
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

        {Array.isArray(rawData) && (
          <motion.div
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {processedData().map((item, i) => {
              // Check if it's a group event
              const isGroupEvent = !(
                item.firstName &&
                item.secondName &&
                item.thirdName
              );

              // Check if we're filtering by house
              const isHouseFiltered =
                filter !== "all" && !getUniqueEvents().includes(filter);
              const filteredPositions = item.filteredPositions || [];

              return (
                <motion.div
                  key={i}
                  className="bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group hover:border-pink-500/30 transition-all duration-300"
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
                        <span className="text-pink-400 text-sm">(Group)</span>
                      )}
                      {isHouseFiltered && filteredPositions.length > 1 && (
                        <div className="text-pink-400 text-sm mt-1">
                          {filter} - Multiple Placements
                        </div>
                      )}
                      {isHouseFiltered && filteredPositions.length === 1 && (
                        <div className="text-pink-400 text-sm mt-1">
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
                                    <p className="text-white font-medium">
                                      {/* Use the saved filtered name instead of the merged name */}
                                      {item.filteredNames?.firstName ||
                                        item.firstName}
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
                                    <p className="text-white font-medium">
                                      {/* Use the saved filtered name instead of the merged name */}
                                      {item.filteredNames?.secondName ||
                                        item.secondName}
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
                                    <p className="text-white font-medium">
                                      {/* Use the saved filtered name instead of the merged name */}
                                      {item.filteredNames?.thirdName ||
                                        item.thirdName}
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
                                  <p className="text-white font-medium">
                                    {item.firstName}
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
                                  <p className="text-white font-medium">
                                    {item.secondName}
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
                                  <p className="text-white font-medium">
                                    {item.thirdName}
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

                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400/0 via-pink-500/0 to-rose-400/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {Array.isArray(rawData) && processedData().length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/70">No events match your filter</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-2 text-pink-400 hover:text-pink-300"
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
