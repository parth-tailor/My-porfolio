"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import ParticleBackground from "./ParticleBackground";
import UnlockPrompt from "./SwipeToUnlock";

export default function LockScreen() {
  const words = ["Engineer", "Dancer", "Roboticist", "Editor", "Creator", "Learner"];
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1); // Ensure lock screen is visible initially
  const [unlocked, setUnlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Word changing interval
    const wordInterval = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 2000);
    return () => clearInterval(wordInterval);
  }, [words.length]); // Dependency on words.length for clarity

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleUnlock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array ensures this runs only once

  const handleUnlock = () => {
    console.log("Unlocking...");
    setOpacity(0); // Start fade out
    setUnlocked(true);
    setTimeout(() => {
      router.push('/desktop');
    }, 1000); // Wait for fade-out animation to complete
  };

  const currentWord = words[index];
  const article = /^[AEIOU]/.test(currentWord) ? "an" : "a";

  return (
    <div
      className="relative h-screen w-full bg-black text-white transition-opacity duration-1000 ease-out"
      style={{ opacity }}
    >
      <ParticleBackground />
      {/* Overlay to darken the background, but allow pointer events to pass through */}
      <div className="absolute inset-0 bg-black opacity-50 pointer-events-none" />
      {/* Centered content */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {/* Changing Word Animation */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-wide transition-all duration-700 ease-in-out opacity-100 z-10 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient pb-4">
          I am {article} {currentWord}
        </h1>
      </div>
      <UnlockPrompt />
    </div>
  );
}