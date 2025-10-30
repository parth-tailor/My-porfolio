"use client";
import React from 'react';

export default function UnlockPrompt() {

  return (
    <div
      className="absolute bottom-0 w-full h-24 flex items-center justify-center z-30"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
      >
        <p className="text-sm text-gray-400 animate-bounce">
          Press Enter to unlock
        </p>
      </div>
    </div>
  );
}
