"use client";

import { Wifi, BatteryFull } from 'lucide-react';
import { useState, useEffect, FC } from 'react';

const Icon: FC<{ src: string; className: string; alt: string }> = ({ src, className, alt }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        if (text.startsWith('<svg')) {
          setSvgContent(text);
        }
      })
      .catch(console.error);
  }, [src]);

  if (!svgContent) {
    return <div className={className} aria-label={alt} role="img" />;
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: svgContent }} aria-label={alt} role="img" />;
};

const DockIcon = ({ name, icon }: { name: string; icon: string }) => (
  <div className="group relative flex flex-col items-center">
    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 bg-opacity-80 text-white text-xs rounded py-1 px-2">
      {name}
    </div>
    <img src={icon} alt={name} className="w-12 h-12 transition-transform duration-200 group-hover:scale-125" draggable="false" />
  </div>
);

export default function Desktop() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000);
    return () => clearInterval(timerId);
  }, []);

  const dockItems = [
    { name: 'Finder', icon: '/icons/finder.png' },
    { name: 'Projects', icon: '/icons/folder.png' },
    { name: 'Contact', icon: '/icons/contact.png' },
    { name: 'Settings', icon: '/icons/settings.png' },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/wallpaper.jpg')" }}>
      {/* Top Menu Bar */}
      <header className="absolute top-0 left-0 right-0 h-6 bg-white bg-opacity-20 backdrop-blur-md text-white flex items-center justify-between px-4 text-sm z-50">
        <div className="flex items-center space-x-4">
          <Icon src="/apple-logo.svg" alt="Apple Logo" className="w-4 h-4" />
          <span className="font-bold">Parth OS</span>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        <div className="flex items-center space-x-4">
          <Wifi size={16} />
          <BatteryFull size={18} />
          <span>{time}</span>
        </div>
      </header>

      {/* Desktop Icons would go here */}

      {/* Dock */}
      <footer className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="flex items-end space-x-2 p-2 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl border border-white border-opacity-30 shadow-lg">
          {dockItems.map((item) => (
            <DockIcon key={item.name} name={item.name} icon={item.icon} />
          ))}
        </div>
      </footer>
    </div>
  );
}