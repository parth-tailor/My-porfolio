"use client";

import Image from 'next/image';
import React, { useState, useEffect, useRef, ReactNode } from 'react';

const Window = ({ title, children, onClose }: { title: string, children: ReactNode, onClose: () => void }) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white bg-opacity-80 backdrop-blur-xl rounded-lg shadow-2xl flex flex-col text-black">
      <div className="flex items-center justify-between px-2 py-1 bg-gray-200 bg-opacity-60 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <span className="text-sm font-medium">{title}</span>
        <div className="w-14"></div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DockIcon = ({ name, icon, onClick }: { name:string, icon: string, onClick: () => void }) => (
  <div className="group relative flex flex-col items-center transform-gpu" onClick={onClick} style={{ transformOrigin: 'bottom' }}>
    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 bg-opacity-80 text-white text-[9px] whitespace-nowrap rounded py-1 px-2">
      {name}
    </div>
    <Image src={icon} alt={name} width={48} height={48} className="w-12 h-12" draggable={false} />
  </div>
);

const DesktopIcon = ({ name, icon, onDoubleClick }: { name: string; icon: string; onDoubleClick: () => void }) => {
  return (
    <div
      className="flex flex-col items-center space-y-1 p-2 rounded hover:bg-white hover:bg-opacity-20 cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      <Image src={icon} alt={name} width={56} height={56} className="w-14 h-14 desktop-icon-handle" draggable={false} />
      <span className="text-white text-xs shadow-black [text-shadow:0_1px_2px_var(--tw-shadow-color)]">{name}</span>
    </div>
  );
};

const DraggableDesktopIcon = ({ item }: { item: { name: string; icon: string; action: () => void; position: { x: number; y: number } } }) => {
  if (!item.position) return null; // Don't render on the server or before the position is calculated

  return (
    <div className="absolute" style={{ left: item.position.x, top: item.position.y }}>
      <DesktopIcon name={item.name} icon={item.icon} onDoubleClick={item.action} />
    </div>
  );
};

export default function Desktop() {
  const [windows, setWindows] = useState<{ [key: string]: boolean }>({
    'CV': false,
    'Junk Ideas': false,
    'Mail': false,
    'Spidy Bot': false,
    'Dance': false,
    'Stagnomage': false,
    'CARS lab at IITK': false,
    'Bionic Arm': false,
    'Team Vibhav': false,
    'Park Robotics': false,
    'CriChess': false,
    'Drone': false,
  });

  const openWindow = (name: string) => {
    setWindows(prev => ({ ...prev, [name]: true }));
  };

  const closeWindow = (name: string) => {
    setWindows(prev => ({ ...prev, [name]: false }));
  };

  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const iconsContainer = dock.firstElementChild;
      if (!iconsContainer) return;
      const icons = Array.from(iconsContainer.children) as HTMLElement[];

      icons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(e.clientX - iconCenterX);

        const maxDistance = 120; // Radius of the magnification effect
        const maxScale = 1.75;   // Max scale of the icon at the center
        const baseScale = 1;

        let scale = baseScale;
        if (distance < maxDistance) {
          const distanceFactor = distance / maxDistance;
          // Use a cosine function for a smooth curve
          scale = baseScale + (maxScale - baseScale) * (Math.cos(distanceFactor * Math.PI / 2));
        }

        icon.style.transform = `scale(${scale})`;
        icon.style.transition = 'transform 0.1s ease-out';
      });
    };

    const handleMouseLeave = () => {
      const iconsContainer = dock.firstElementChild;
      if (!iconsContainer) return;
      const icons = Array.from(iconsContainer.children) as HTMLElement[];
      icons.forEach(icon => {
        icon.style.transform = 'scale(1)';
        icon.style.transition = 'transform 0.2s ease-in-out';
      });
    };

    dock.addEventListener('mousemove', handleMouseMove);
    dock.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (dock) {
        dock.removeEventListener('mouseleave', handleMouseLeave);
        dock.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const dockItems: { name: string; icon: string; action?: () => void }[] = [
    { name: 'Media', icon: '/icons/media.png', action: () => {} }, // Placeholder action
    { name: 'CV', icon: '/icons/cv.png', action: () => openWindow('CV') },
    { name: 'Mail', icon: '/icons/mail.png', action: () => openWindow('Mail') },
    { name: 'LinkedIn', icon: '/icons/linkedin.png', action: () => window.open('https://www.linkedin.com/in/parth-tailor-89a4351b8/', '_blank') },
    { name: 'Preview', icon: '/icons/preview.png', action: () => {} }, // Placeholder action
    { name: 'Junk Ideas', icon: '/icons/bin.png', action: () => openWindow('Junk Ideas') },
  ];  

  const [desktopItems, setDesktopItems] = useState<{ name: string; icon: string; action: () => void; position: { x: number; y: number } }[]>([]);

  useEffect(() => {
    setDesktopItems([
      { name: 'Spidy Bot', icon: '/icons/spidybot.png', action: () => openWindow('Spidy Bot'), position: { x: window.innerWidth - 540, y: 40 } },
      { name: 'Dance', icon: '/icons/dance.png', action: () => openWindow('Dance'), position: { x: window.innerWidth - 420, y: 140 } },
      { name: 'Stagnomage', icon: '/icons/stagnomage.png', action: () => openWindow('Stagnomage'), position: { x: window.innerWidth - 520, y: 240 } },
      { name: 'CARS-Lab@IITK', icon: '/icons/iitk.png', action: () => openWindow('CARS lab at IITK'), position: { x: window.innerWidth - 720, y: 340 } },
      { name: 'Bionic Arm', icon: '/icons/bionic.png', action: () => openWindow('Bionic Arm'), position: { x: window.innerWidth - 670, y: 440 } },
      { name: 'Team Vibhav', icon: '/icons/vibhav.png', action: () => openWindow('Team Vibhav'), position: { x: 650, y: 40 } },
      { name: 'Park Robotics', icon: '/icons/park-robotics.png', action: () => openWindow('Park Robotics'), position: { x: 520, y: 140 } },
      { name: 'CriChess', icon: '/icons/crichess.png', action: () => openWindow('CriChess'), position: { x: 430, y: 240 } },
      { name: 'Drone', icon: '/icons/drone.png', action: () => openWindow('Drone'), position: { x: 560, y: 340 } },
    ]);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/wallpaper.jpg')" }}>

      {/* Desktop Icons - Each in its own container for initial positioning */}
      <div className="absolute inset-0">
        {desktopItems.map((item) => (
          <DraggableDesktopIcon key={item.name} item={item} />
        ))}
      </div>

      {/* Windows */}
      {Object.entries(windows).map(([name, isOpen]) => {
        if (!isOpen) return null;

        let content = <p>This is the {name} folder.</p>;
        if (name === 'CV') {
          content = <p>Here is my CV...</p>;
        } else if (name === 'Mail') {
          content = <p>You can reach me at parth.tailor@example.com</p>;
        } else if (name === 'Junk Ideas') {
          content = <p>Here are some of my junk ideas...</p>;
        }

        return (
          <Window key={name} title={name} onClose={() => closeWindow(name)}>
            {content}
          </Window>
        );
      })}

      {/* Dock */}
      <footer ref={dockRef} className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center">
        <div className="flex items-end space-x-4 p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
          {dockItems.map((item) => (
            <DockIcon key={item.name} name={item.name} icon={item.icon} onClick={item.action || (() => {})} />
          ))}
        </div>
      </footer>
    </div>
  );
}