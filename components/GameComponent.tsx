"use client";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";

const GAME_HEIGHT = 200;
const GRAVITY = 0.6;
// Changed to base values that will be scaled
const BASE_JUMP_FORCE = 15;
const BASE_OBSTACLE_SPEED = 6;
const OBSTACLE_FREQUENCY = 1500; // ms
const GIRL_WIDTH = 40;
const GIRL_HEIGHT = 60;
const CUP_WIDTH = 30;
const CUP_HEIGHT = 40;
const SPEED_INCREMENT = 0.5;
const SPEED_MILESTONE = 5;
const BG_TOGGLE_INTERVAL = 10000;

interface Obstacle {
  id: number;
  x: number;
  width: number;
  height: number;
}

// Add props interface to accept custom avatar image
interface GameComponentProps {
  customAvatarImage?: string;
}

// Export game methods that can be called from parent
export interface GameMethods {
  jump: () => void;
}

export default forwardRef<GameMethods, GameComponentProps>(function GameComponent(
  {
    customAvatarImage = "/images/avatar.png",
  }: GameComponentProps,
  ref
) {
  // Add state for container width
  const [containerWidth, setContainerWidth] = useState(800);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(BASE_OBSTACLE_SPEED); // Track current speed
  const [isDarkMode, setIsDarkMode] = useState(true); // Track background mode
  const [useCustomAvatar, setUseCustomAvatar] = useState(false); // Track if custom avatar is active
  // Add counter for secret button clicks
  const [secretButtonClicks, setSecretButtonClicks] = useState(0);

  const [girlPos, setGirlPos] = useState({
    y: GAME_HEIGHT - GIRL_HEIGHT,
    yVelocity: 0,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const requestRef = useRef<number | null>(null);
  const lastObstacleTimeRef = useRef<number>(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const bgToggleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Update container width when the component mounts or window resizes
  useEffect(() => {
    if (gameContainerRef.current) {
      setContainerWidth(gameContainerRef.current.clientWidth);

      // Set up resize observer to track container width changes
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });

      resizeObserverRef.current.observe(gameContainerRef.current);
    }

    return () => {
      if (resizeObserverRef.current && gameContainerRef.current) {
        resizeObserverRef.current.unobserve(gameContainerRef.current);
      }
    };
  }, []);

  // Calculate speed based on container width
  const getScaledSpeed = () => {
    // Scale speed based on container width relative to a reference width of 800px
    const widthRatio = containerWidth / 800;
    return currentSpeed * widthRatio;
  };

  // Calculate jump force based on container width
  const getScaledJumpForce = () => {
    // For small screens, provide a higher relative jump force
    // This ensures the character can clear obstacles on small screens
    const baseRatio = containerWidth / 800;
    const minRatio = 0.7; // Ensure a minimum jump height even on very small screens
    // Enhanced jump force for mobile (smaller screens)
    return BASE_JUMP_FORCE * Math.max(minRatio, baseRatio);
  };

  // Calculate gravity based on container width
  const getScaledGravity = () => {
    // Scale gravity slightly based on screen size to make jumps feel more natural
    const widthRatio = containerWidth / 800;
    return GRAVITY * Math.min(1, widthRatio * 0.9);
  };

  // Enhanced startGame function for better mobile support
  const handleStartGame = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent event bubbling
    e.stopPropagation();

    // Call the actual game start logic
    startGame();
  };

  // Original game initialization logic
  const startGame = () => {
    if (gameOver) {
      setObstacles([]);
      setScore(0);
      setCurrentSpeed(BASE_OBSTACLE_SPEED); // Reset speed on game restart
    }
    setGameStarted(true);
    setGameOver(false);
    setGirlPos({ y: GAME_HEIGHT - GIRL_HEIGHT, yVelocity: 0 });
    lastObstacleTimeRef.current = Date.now();

    // Set up background toggle timer
    if (bgToggleTimerRef.current) {
      clearInterval(bgToggleTimerRef.current);
    }
    bgToggleTimerRef.current = setInterval(() => {
      setIsDarkMode((prev) => !prev);
    }, BG_TOGGLE_INTERVAL);
  };

  // Jump function
  const jump = () => {
    if (!gameStarted) {
      startGame();
      return;
    }

    if (girlPos.y >= GAME_HEIGHT - GIRL_HEIGHT) {
      // Only jump when on ground
      const scaledJumpForce = getScaledJumpForce();
      setGirlPos((prev) => ({ ...prev, yVelocity: -scaledJumpForce }));
    }
  };

  // Expose jump method to parent components
  useImperativeHandle(ref, () => ({
    jump,
  }));

  // Handle avatar toggle with click counting
  const handleSecretButtonClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Ensure event doesn't trigger jump
    e.stopPropagation();
    if ("preventDefault" in e) e.preventDefault();
    if (secretButtonClicks >= 4) {
      toggleAvatar();
    }

    // Increment counter
    setSecretButtonClicks((prev) => {
      const newCount = prev + 1;
      console.log(`Secret button clicked! Count: ${newCount}`); // Debug output

      // Toggle avatar after 5 clicks
      if (newCount >= 5) {
        return 0; // Reset counter
      }
      return newCount;
    });
  };

  // Keep the keyboard toggle for desktop
  const toggleAvatar = () => {
    setUseCustomAvatar((prev) => !prev);
  };

  // Game loop
  const gameLoop = (time: number) => {
    if (!gameStarted || gameOver) return;

    // Update girl position with scaled gravity
    const scaledGravity = getScaledGravity();

    setGirlPos((prev) => {
      let newY = prev.y + prev.yVelocity;
      let newVelocity = prev.yVelocity + scaledGravity;

      // Handle landing
      if (newY > GAME_HEIGHT - GIRL_HEIGHT) {
        newY = GAME_HEIGHT - GIRL_HEIGHT;
        newVelocity = 0;
      }

      // Prevent going below the viewable area
      if (newY < 0) {
        newY = 0;
        newVelocity = 0;
      }

      return { y: newY, yVelocity: newVelocity };
    });

    // Generate new obstacles
    const now = Date.now();
    if (now - lastObstacleTimeRef.current > OBSTACLE_FREQUENCY) {
      const newObstacle = {
        id: now,
        x: containerWidth,
        // Scale obstacle dimensions a bit on very small screens
        width: Math.min(CUP_WIDTH, containerWidth * 0.08),
        height: Math.min(CUP_HEIGHT, containerWidth * 0.1),
      };
      setObstacles((prev) => [...prev, newObstacle]);
      lastObstacleTimeRef.current = now;
    }

    // Get speed scaled to width
    const scaledSpeed = getScaledSpeed();

    // Move obstacles and check for collisions
    setObstacles((prev) => {
      // Calculate horizontal position of girl based on container width
      const girlX = Math.min(50, containerWidth * 0.15);

      // Track which obstacles pass the character in this frame for score updating
      const obstaclesBeforeFront = prev.filter(
        (obstacle) => obstacle.x > girlX + GIRL_WIDTH / 2
      );

      // Move obstacles
      const updatedObstacles = prev
        .map((obstacle) => ({ ...obstacle, x: obstacle.x - scaledSpeed }))
        .filter((obstacle) => obstacle.x > -obstacle.width);

      // Check which obstacles have now passed the character
      const newlyPassedObstacles = obstaclesBeforeFront.filter(
        (oldObstacle) => {
          // Find the updated position of this obstacle
          const updatedObstacle = updatedObstacles.find(
            (o) => o.id === oldObstacle.id
          );
          // Check if it's now passed the character's position
          return updatedObstacle && updatedObstacle.x <= girlX + GIRL_WIDTH / 2;
        }
      );

      // Update score for obstacles that have been passed
      if (newlyPassedObstacles.length > 0) {
        setScore((s) => {
          const newScore = s + newlyPassedObstacles.length;
          // Increase speed every SPEED_MILESTONE points
          if (
            Math.floor(newScore / SPEED_MILESTONE) >
            Math.floor(s / SPEED_MILESTONE)
          ) {
            setCurrentSpeed((prev) => prev + SPEED_INCREMENT);
          }
          return newScore;
        });
      }

      // Check for collisions
      const girlHitbox = {
        x: girlX,
        y: girlPos.y,
        width: GIRL_WIDTH,
        height: GIRL_HEIGHT,
      };

      const collision = updatedObstacles.some(
        (obstacle) =>
          girlHitbox.x < obstacle.x + obstacle.width &&
          girlHitbox.x + girlHitbox.width > obstacle.x &&
          girlHitbox.y < GAME_HEIGHT - obstacle.height &&
          girlHitbox.y + girlHitbox.height > GAME_HEIGHT - obstacle.height
      );

      if (collision) {
        setGameOver(true);
        setHighScore((prev) => Math.max(prev, score));
      }

      return updatedObstacles;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // Set up game loop and event listeners
  useEffect(() => {
    if (gameStarted && !gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }

      // Toggle avatar on 'R' key press - still works on keyboard
      if (e.code === "KeyR") {
        e.preventDefault();
        toggleAvatar();
      }
    };

    // Touch event handler for the entire game container
    const handleTouchStart = (e: TouchEvent) => {
      // Handle touch events outside of the secret button
      if (gameContainerRef.current) {
        // Get touch coordinates
        const touch = e.touches[0];
        const rect = gameContainerRef.current.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        // Check if touch is outside the secret button area
        if (x > 40 || y > 40) {
          // Safe margin for secret button
          e.preventDefault(); // Prevent default only if we're handling the jump
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (gameContainerRef.current) {
      gameContainerRef.current.addEventListener(
        "touchstart",
        handleTouchStart,
        { passive: false }
      );
      gameContainerRef.current.style.touchAction = "manipulation";
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener("keydown", handleKeyDown);

      if (gameContainerRef.current) {
        gameContainerRef.current.removeEventListener(
          "touchstart",
          handleTouchStart
        );
      }
    };
  }, [gameStarted, gameOver, girlPos.y, containerWidth]);

  // Fixed secret button click handling for mobile
  const secretButtonRef = useRef<HTMLDivElement>(null);

  // Clean up background toggle timer and resize observer
  useEffect(() => {
    return () => {
      if (bgToggleTimerRef.current) {
        clearInterval(bgToggleTimerRef.current);
      }
      if (resizeObserverRef.current && gameContainerRef.current) {
        resizeObserverRef.current.unobserve(gameContainerRef.current);
      }
    };
  }, []);

  // Calculate dynamic girl position based on container width
  const girlXPosition = Math.min(50, containerWidth * 0.15);

  // Adjust obstacle frequency based on container width
  // to avoid too many obstacles on small screens
  useEffect(() => {
    if (containerWidth < 400) {
      lastObstacleTimeRef.current = Date.now() + 500; // Add a delay for small screens
    }
  }, [containerWidth]);

  return (
    <div
      ref={gameContainerRef}
      className={`relative w-full h-[200px] ${
        isDarkMode ? "bg-gray-900" : "bg-gray-200"
      } border-b-4 ${
        isDarkMode ? "border-gray-700" : "border-gray-400"
      } overflow-hidden cursor-pointer transition-colors duration-1000`}
      onClick={jump}
      style={{ touchAction: "manipulation" }}
    >
      {/* Secret button - completely revised for better mobile support */}
      <div
        ref={secretButtonRef}
        className={`absolute top-2 left-2 w-12 h-12 rounded-full z-20 flex items-center justify-center 
                 `}
        onClick={handleSecretButtonClick}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleSecretButtonClick(e);
        }}
        style={{ touchAction: "none" }}
      >
        {secretButtonClicks > 0 && (
          <span
            className={`text-sm font-bold ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {secretButtonClicks}
          </span>
        )}
      </div>

      {/* Debug Avatar State - Only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 left-16 text-xs text-white/50 z-10">
          Avatar: {useCustomAvatar ? "Custom" : "Default"}
        </div>
      )}

      {/* Score display */}
      <div
        className={`absolute top-2 right-2 ${
          isDarkMode ? "text-white" : "text-gray-800"
        } font-bold z-10 text-xs sm:text-base`}
      >
        Score: {score} | High: {highScore}
      </div>

      {/* Game floor */}
      <div
        className={`absolute bottom-0 w-full h-[2px] ${
          isDarkMode ? "bg-gray-600" : "bg-gray-500"
        }`}
      ></div>

      {/* Character - Dynamic positioning */}
      <motion.div
        className="absolute w-[40px] h-[60px]"
        style={{
          bottom: `${GAME_HEIGHT - girlPos.y - GIRL_HEIGHT}px`,
          left: `${girlXPosition}px`,
        }}
        transition={{ type: "tween", duration: 0 }}
      >
        {useCustomAvatar ? (
          // Custom image avatar
          <img
            src={customAvatarImage}
            alt="Custom avatar"
            className="w-full h-full object-contain"
          />
        ) : (
          // CSS-based human-like character
          <div className="relative w-full h-full">
            {/* Head */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[22px] h-[22px] rounded-full bg-[#f8d5c2] border border-[#e0b69b]">
              {/* Face */}
              <div className="absolute top-[6px] w-full flex justify-center space-x-2">
                <div className="w-1.5 h-1 bg-[#594a42] rounded-full"></div>{" "}
                {/* Left eye */}
                <div className="w-1.5 h-1 bg-[#594a42] rounded-full"></div>{" "}
                {/* Right eye */}
              </div>
              <div className="absolute top-[11px] left-1/2 transform -translate-x-1/2 w-2.5 h-1 bg-[#e06c75] rounded-full"></div>{" "}
              {/* Mouth */}
              {/* Hair */}
              <div className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-[26px] h-[14px] rounded-t-full bg-[#5c3c10]"></div>
            </div>
            {/* Body */}
            <div className="absolute top-[22px] left-1/2 transform -translate-x-1/2 w-[24px] h-[20px] bg-[#ff7eb9] rounded-t-lg"></div>
            {/* Skirt/Dress */}
            <div className="absolute top-[38px] left-1/2 transform -translate-x-1/2 w-[26px] h-[12px] bg-[#ff7eb9] rounded-b-lg"></div>
            {/* Arms */}
            <div className="absolute top-[24px] left-[3px] w-[6px] h-[16px] bg-[#f8d5c2] rounded-full"></div>{" "}
            {/* Left arm */}
            <div className="absolute top-[24px] right-[3px] w-[6px] h-[16px] bg-[#f8d5c2] rounded-full"></div>{" "}
            {/* Right arm */}
            {/* Legs */}
            <div className="absolute bottom-0 left-[8px] w-[6px] h-[14px] bg-[#f8d5c2] rounded-b-md"></div>{" "}
            {/* Left leg */}
            <div className="absolute bottom-0 right-[8px] w-[6px] h-[14px] bg-[#f8d5c2] rounded-b-md"></div>{" "}
            {/* Right leg */}
          </div>
        )}
      </motion.div>

      {/* Mobile instructions (only shown on small screens) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs sm:hidden">
        <p
          className={`${
            isDarkMode ? "text-white" : "text-gray-800"
          } opacity-70`}
        >
          Tap to jump
        </p>
      </div>

      {/* Cups/Obstacles */}
      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className="absolute bottom-0"
          style={{
            left: `${obstacle.x}px`,
            width: `${obstacle.width}px`,
            height: `${obstacle.height}px`,
          }}
        >
          <div
            className={`w-full h-full ${
              isDarkMode ? "bg-white" : "bg-gray-700"
            } rounded-t-md relative transition-colors duration-1000`}
          >
            {/* Cup handle */}
            <div
              className={`absolute right-[-5px] top-1/4 w-2 h-[20px] ${
                isDarkMode ? "bg-white" : "bg-gray-700"
              } rounded-r-md transition-colors duration-1000`}
            ></div>
          </div>
        </div>
      ))}

      {/* Game over or start overlay */}
      {(!gameStarted || gameOver) && (
        <div
          className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling to game area
        >
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 text-center px-2">
            {gameOver ? "Game Over!" : "Cup Jump Challenge"}
          </h2>
          <button
            onClick={handleStartGame}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startGame();
            }}
            className="bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-900 px-8 py-3 rounded-full font-bold transition-colors -outline-offset-2 touch-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {gameOver ? "Play Again" : "Start Game"}
          </button>
        </div>
      )}

      {/* Show a small debug panel during development (optional) */}
      <div
        className={`absolute bottom-8 right-2 ${
          isDarkMode ? "text-white" : "text-gray-800"
        } text-xs opacity-50 z-10 hidden sm:block`}
      >
        Width: {Math.round(containerWidth)}px | Score: {score}
      </div>
    </div>
  );
});
