"use client";
import { Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";
import GameComponent, { GameMethods } from "@/components/GameComponent";
import Link from "next/link";
import { useRef } from "react";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function GamePage() {
  // Create reference to access game methods
  const gameRef = useRef<GameMethods>(null);

  // Handle clicks anywhere on the page
  const handlePageClick = () => {
    if (gameRef.current) {
      gameRef.current.jump();
    }
  };

  return (
    <div
      className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black px-4 py-6 sm:p-8"
      onClick={handlePageClick}
    >
      <img
        src="/logo.png"
        className="w-screen h-screen object-cover opacity-20 fixed top-0 left-0"
        alt="Background logo"
      />

      <main className="mx-auto max-w-5xl relative z-10">
        <motion.h1
          className={`mb-8 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 text-transparent bg-clip-text drop-shadow-sm ${instrument.className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Cup Jump Challenge
        </motion.h1>

        <div className="flex items-center justify-center mb-6">
          <Link
            href="/"
            className="text-amber-300 hover:text-amber-200 transition-colors"
          >
            &larr; Back to Leaderboard
          </Link>
        </div>

        <motion.div
          className="bg-black/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/10 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          // Remove click handler to prevent double jumps
          onClick={(e) => e.stopPropagation()}
        >
          <GameComponent ref={gameRef} />
        </motion.div>
        <p className="text-center text-white/70 mt-6">
          Press <span className="bg-white/20 rounded px-2 py-0.5">Space</span>{" "}
          or{" "}
          <span className="bg-white/20 rounded px-2 py-0.5">
            Click Anywhere
          </span>{" "}
          to jump
        </p>
      </main>
    </div>
  );
}
