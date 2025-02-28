"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import dynamic from "next/dynamic";

// Dynamically import the Confetti component to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

interface EasterEggModalProps {
  onClose: () => void;
}

export default function EasterEggModal({ onClose }: EasterEggModalProps) {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Update window dimensions
    const updateWindowDimensions = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initialize window size
    updateWindowDimensions();

    // Add event listener
    window.addEventListener("resize", updateWindowDimensions);

    // Clean up
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={200}
        gravity={0.2}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-violet-600/90 to-purple-900/90 p-8 rounded-2xl max-w-md mx-4 shadow-xl border border-white/20 backdrop-blur-md"
      >
        <h2 className={`text-3xl text-white mb-4 ${instrument.className}`}>
          You found an Easter egg! 🎉
        </h2>
        <p className="text-white text-xl mb-6">
          Rithvika asks you to register for TEDx!
        </p>
        <button
          onClick={onClose}
          className="bg-white hover:bg-gray-100 text-purple-700 font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-lg"
        >
          Got it!
        </button>
      </motion.div>
    </div>
  );
}
