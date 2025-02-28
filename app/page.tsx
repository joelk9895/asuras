"use client";
import { houses } from "../data/houses";
import ModelViewer from "@/components/ModelViewer";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const sortedHouses = [...houses]
    .sort((a, b) => b.points - a.points)
    .map((house, index) => ({ ...house, rank: index + 1 }));

  const topThree = sortedHouses.slice(0, 3);
  const maxPoints = Math.max(...sortedHouses.map((house) => house.points));

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black px-4 py-6 sm:p-8">
      <img
        src="/logo.png"
        className="w-screen h-screen object-cover opacity-20 fixed top-0 left-0"
        alt="Background logo"
      />
      <main className="mx-auto max-w-5xl relative z-10">
        <motion.h1
          className={`mb-8 sm:mb-16 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 text-transparent bg-clip-text drop-shadow-sm ${instrument.className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          House Senate Leaderboard
        </motion.h1>

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-8 sm:gap-4 md:gap-8 my-8 sm:my-16">
          {topThree.map((house, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col items-center mb-8 sm:mb-0"
            >
              <ModelViewer position={house.rank} house={house.name} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                className="mt-4 sm:mt-5 px-6 sm:px-8 py-2 rounded-full font-medium text-white shadow-lg backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${house.color}40, ${house.color}90)`,
                  boxShadow: `0 4px 15px ${house.color}30`,
                }}
              >
                {house.points}{" "}
                <span
                  className={`${instrument.className} italic uppercase text-sm sm:text-base`}
                >
                  points
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-black/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="overflow-hidden">
            {sortedHouses.map((house, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
                key={house.name}
                className={`relative flex items-center p-4 sm:p-6 ${
                  index !== sortedHouses.length - 1
                    ? "border-b border-white/5"
                    : ""
                } hover:bg-white/5 transition-all duration-300 group`}
              >
                <div
                  className={`
                  flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br
                  ${
                    house.rank === 1
                      ? "from-amber-200 to-yellow-500 text-amber-900"
                      : house.rank === 2
                      ? "from-slate-200 to-slate-400 text-slate-800"
                      : house.rank === 3
                      ? "from-amber-500 to-amber-700 text-amber-100"
                      : "from-slate-600 to-slate-700 text-slate-300"
                  }
                  flex items-center justify-center mr-3 sm:mr-6 shadow-md`}
                >
                  <span
                    className={`text-base sm:text-xl font-bold ${instrument.className}`}
                  >
                    {house.rank}
                  </span>
                </div>
                <div className="flex-grow z-10 min-w-0">
                  <div className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2 flex items-baseline flex-wrap">
                    <span className="truncate">{house.name}</span>
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full ml-2 sm:ml-3 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      style={{ backgroundColor: house.color }}
                    />
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-2 sm:h-2.5 overflow-hidden backdrop-blur-sm">
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
                      transition={{ duration: 1.2, delay: index * 0.1 + 0.8 }}
                    />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 text-xl sm:text-2xl font-bold text-white flex items-end shrink-0">
                  <span>{house.points}</span>
                  <span
                    className={`${instrument.className} text-sm sm:text-base ml-1`}
                  >
                    pts
                  </span>
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
      </main>
      <p className="mx-auto text-center mt-10">
        Crafted by <span className={instrument.className}>pixellab</span>
      </p>
    </div>
  );
}
