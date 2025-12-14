"use client";

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-80" />
    </div>
  );
}
