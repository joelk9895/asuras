"use client";
import ModelViewer from "@/components/ModelViewer";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import { useHouses } from "@/hooks/useHouses";
import { useState } from "react";
import Link from "next/link";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const { houses, loading, error } = useHouses();
  const [activeTab, setActiveTab] = useState<
    "overall" | "layatharang" | "chakravyuh"
  >("overall");

  // Sort houses by points and add rank
  // const updatedHouses = houses.map((house) => {
  //   if (house.name === "Adharvas") {
  //     return { ...house, points: house.points + 80 };
  //   }
  //   return house;
  // });
  const sortedHouses = [...houses]
    .sort((a, b) => b.points - a.points)
    .map((house, index) => ({ ...house, rank: index + 1 }));

  const topThree = sortedHouses.slice(0, 3);
  const maxPoints =
    houses.length > 0 ? Math.max(...houses.map((house) => house.points)) : 1;

  const maxLayaPoints =
    houses.length > 0
      ? Math.max(...houses.map((house) => house.layatharang))
      : 1;

  const maxChakPoints =
    houses.length > 0
      ? Math.max(...houses.map((house) => house.chakravyuh))
      : 1;

  const layatharangSortedHouses = [...houses].sort(
    (a, b) => b.layatharang - a.layatharang
  );
  const chakravyuhSortedHouses = [...houses].sort(
    (a, b) => b.chakravyuh - a.chakravyuh
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">
          <span className="inline-block animate-spin mr-3">⏳</span>
          Loading house data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black px-3 py-4 sm:px-4 sm:py-6 md:p-8">
      <img
        src="/logo.png"
        className="w-screen h-screen object-cover opacity-20 fixed top-0 left-0 z-0"
        alt="Background logo"
      />

      <main className="mx-auto max-w-5xl relative z-10">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <motion.h1
          className={`mb-6 sm:mb-8 md:mb-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 text-transparent bg-clip-text drop-shadow-sm ${instrument.className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Leaderboard
        </motion.h1>

        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-6 sm:gap-8 my-4 sm:my-8 md:my-16">
          {topThree.map((house, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col items-center mb-2 sm:mb-0 w-[60%] sm:w-[30%] md:w-auto"
            >
              <ModelViewer position={house.rank} house={house.name} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                className="mt-2 sm:mt-4 px-3 sm:px-6 md:px-8 py-1 sm:py-2 rounded-full font-medium text-white shadow-lg backdrop-blur-md text-sm sm:text-base"
                style={{
                  background: `linear-gradient(135deg, ${house.color}40, ${house.color}90)`,
                  boxShadow: `0 4px 15px ${house.color}30`,
                }}
              >
                {house.points}{" "}
                <span
                  className={`${instrument.className} italic uppercase text-xs sm:text-sm`}
                >
                  points
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-4 justify-center my-4 sm:my-6 flex-wrap">
          <button
            onClick={() => setActiveTab("overall")}
            className={
              activeTab === "overall"
                ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-black px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold shadow transition-all duration-300 text-sm sm:text-base mb-2 sm:mb-0"
                : "text-white/70 px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base mb-2 sm:mb-0"
            }
          >
            Overall
          </button>
          <button
            onClick={() => setActiveTab("layatharang")}
            className={
              activeTab === "layatharang"
                ? "bg-gradient-to-r from-fuchsia-400 via-pink-500 to-rose-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold shadow transition-all duration-300 text-sm sm:text-base mb-2 sm:mb-0"
                : "text-white/70 px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base mb-2 sm:mb-0"
            }
          >
            Layatharang
          </button>
          <button
            onClick={() => setActiveTab("chakravyuh")}
            className={
              activeTab === "chakravyuh"
                ? "bg-gradient-to-r from-emerald-300 to-green-500 text-black px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold shadow transition-all duration-300 text-sm sm:text-base mb-2 sm:mb-0"
                : "text-white/70 px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base mb-2 sm:mb-0"
            }
          >
            Chakravyuh
          </button>
        </div>

        {activeTab === "overall" && (
          <>
            <motion.div
              className="bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/10 divide-y divide-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="overflow-hidden col-span-full">
                {sortedHouses.map((house, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                    key={house.name}
                    className={`relative flex items-center p-3 sm:p-4 md:p-6 ${
                      index !== sortedHouses.length - 1
                        ? "border-b border-white/5"
                        : ""
                    } hover:bg-white/5 transition-all duration-300 group`}
                  >
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br
                      ${
                        house.rank === 1
                          ? "from-amber-200 to-yellow-500 text-amber-900"
                          : house.rank === 2
                          ? "from-slate-200 to-slate-400 text-slate-800"
                          : house.rank === 3
                          ? "from-amber-500 to-amber-700 text-amber-100"
                          : "from-slate-600 to-slate-700 text-slate-300"
                      }
                      flex items-center justify-center mr-2 sm:mr-3 md:mr-6 shadow-md`}
                    >
                      <span
                        className={`text-sm sm:text-base md:text-xl font-bold ${instrument.className}`}
                      >
                        {house.rank}
                      </span>
                    </div>
                    <div className="flex-grow z-10 min-w-0">
                      <div className="text-sm sm:text-base md:text-xl font-bold text-white mb-1 sm:mb-2 flex items-baseline flex-wrap">
                        <span className="truncate">{house.name}</span>
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ml-1 sm:ml-2 md:ml-3 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          style={{ backgroundColor: house.color }}
                        />
                      </div>

                      <div className="w-full bg-white/5 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden backdrop-blur-sm">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${house.color}60, ${house.color})`,
                            boxShadow: `0 0 8px ${house.color}50`,
                          }}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(house.points / maxPoints) * 100}%`,
                          }}
                          transition={{
                            duration: 1.2,
                            delay: index * 0.1 + 0.8,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-2 sm:ml-3 md:ml-4">
                      <div className="text-base sm:text-xl md:text-2xl font-bold text-white flex items-end shrink-0">
                        <span>{house.points}</span>
                        <span
                          className={`${instrument.className} text-xs sm:text-sm md:text-base ml-1`}
                        >
                          pts
                        </span>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to right, transparent, ${house.color})`,
                      }}
                    ></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === "layatharang" && (
          <motion.div
            className="bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold p-3 sm:p-4 md:p-6">
              Layatharang Leaderboard
            </h2>
            <hr className="border-white/10 mx-3 sm:mx-4 md:mx-6" />
            <div className="flex justify-center my-3 sm:my-4">
              <Link href="/layatharang">
                <button className="bg-gradient-to-r from-fuchsia-400 via-pink-500 to-rose-400 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium shadow transition-all duration-300 hover:opacity-90 transform hover:-translate-y-1 active:translate-y-0">
                  View Event Winners
                </button>
              </Link>
            </div>
            {layatharangSortedHouses.map((house, index) => (
              <motion.div
                key={house.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="relative flex items-center p-3 sm:p-4 md:p-6 border-t border-white/5 hover:bg-white/5 transition-all duration-300 group"
              >
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br
                    ${
                      index === 0
                        ? "from-amber-200 to-yellow-500 text-amber-900"
                        : index === 1
                        ? "from-slate-200 to-slate-400 text-slate-800"
                        : index === 2
                        ? "from-amber-500 to-amber-700 text-amber-100"
                        : "from-slate-600 to-slate-700 text-slate-300"
                    }
                    flex items-center justify-center mr-2 sm:mr-3 md:mr-6 shadow-md`}
                >
                  <span
                    className={`text-sm sm:text-base md:text-xl font-bold ${instrument.className}`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex-grow z-10 min-w-0">
                  <div className="text-sm sm:text-base md:text-xl font-bold text-white mb-1 sm:mb-2 flex items-baseline flex-wrap">
                    <span className="truncate">{house.name}</span>
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ml-1 sm:ml-2 md:ml-3 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      style={{ backgroundColor: house.color }}
                    />
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${house.color}60, ${house.color})`,
                        boxShadow: `0 0 8px ${house.color}50`,
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(house.layatharang / maxLayaPoints) * 100}%`,
                      }}
                      transition={{
                        duration: 1.2,
                        delay: index * 0.1 + 0.8,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end ml-2 sm:ml-3 md:ml-4">
                  <div className="text-base sm:text-xl md:text-2xl font-bold text-white flex items-end shrink-0">
                    <span>{house.layatharang}</span>
                    <span
                      className={`${instrument.className} text-xs sm:text-sm md:text-base ml-1`}
                    >
                      pts
                    </span>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${house.color})`,
                  }}
                ></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "chakravyuh" && (
          <motion.div
            className="bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold p-3 sm:p-4 md:p-6">
              Chakravyuh Leaderboard
            </h2>
            <hr className="border-white/10 mx-3 sm:mx-4 md:mx-6" />
            <div className="flex justify-center my-3 sm:my-4">
              <Link href="/chakravyuh">
                <button className="bg-gradient-to-r from-emerald-300 to-green-500 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium shadow transition-all duration-300 hover:opacity-90 transform hover:-translate-y-1 active:translate-y-0">
                  View Event Winners
                </button>
              </Link>
            </div>
            {chakravyuhSortedHouses.map((house, index) => (
              <motion.div
                key={house.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="relative flex items-center p-3 sm:p-4 md:p-6 border-t border-white/5 hover:bg-white/5 transition-all duration-300 group"
              >
                {/* Rest of the chakravyuh item code remains unchanged but with the same sizing adjustments */}
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br
                    ${
                      index === 0
                        ? "from-amber-200 to-yellow-500 text-amber-900"
                        : index === 1
                        ? "from-slate-200 to-slate-400 text-slate-800"
                        : index === 2
                        ? "from-amber-500 to-amber-700 text-amber-100"
                        : "from-slate-600 to-slate-700 text-slate-300"
                    }
                    flex items-center justify-center mr-2 sm:mr-3 md:mr-6 shadow-md`}
                >
                  <span
                    className={`text-sm sm:text-base md:text-xl font-bold ${instrument.className}`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex-grow z-10 min-w-0">
                  <div className="text-sm sm:text-base md:text-xl font-bold text-white mb-1 sm:mb-2 flex items-baseline flex-wrap">
                    <span className="truncate">{house.name}</span>
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ml-1 sm:ml-2 md:ml-3 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      style={{ backgroundColor: house.color }}
                    />
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${house.color}60, ${house.color})`,
                        boxShadow: `0 0 8px ${house.color}50`,
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(house.chakravyuh / maxChakPoints) * 100}%`,
                      }}
                      transition={{
                        duration: 1.2,
                        delay: index * 0.1 + 0.8,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end ml-2 sm:ml-3 md:ml-4">
                  <div className="text-base sm:text-xl md:text-2xl font-bold text-white flex items-end shrink-0">
                    <span>{house.chakravyuh}</span>
                    <span
                      className={`${instrument.className} text-xs sm:text-sm md:text-base ml-1`}
                    >
                      pts
                    </span>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${house.color})`,
                  }}
                ></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <motion.div
        className="relative z-50 w-full max-w-xs mx-auto mt-6 sm:mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Link href="/game" className="block">
          <div className="group bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 hover:from-amber-300 hover:via-yellow-500 hover:to-amber-400 text-amber-900 font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base">
            <span className="block">Play a Game</span>
            <span className="text-xs opacity-75">
              while waiting for scores to update?
            </span>
          </div>
        </Link>
      </motion.div>

      <p className="mx-auto text-center mt-6 sm:mt-10 text-white/70 text-xs sm:text-sm">
        Crafted by <span className={instrument.className}>pixellab</span>
      </p>
    </div>
  );
}
