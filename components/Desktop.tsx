"use client";

import { Wifi, BatteryFull } from 'lucide-react';
import { useState, useEffect, FC, useRef, MouseEvent } from 'react';

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

const Window = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => {
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
    <img src={icon} alt={name} className="w-12 h-12" draggable="false" />
  </div>
);

const DesktopIcon = ({ name, icon, onDoubleClick }: { name: string; icon: string; onDoubleClick: () => void }) => (
  <div 
    className="flex flex-col items-center space-y-1 p-2 rounded hover:bg-white hover:bg-opacity-20"
    onDoubleClick={onDoubleClick}
  >
    <img src={icon} alt={name} className="w-14 h-14" draggable="false" />
    <span className="text-white text-xs shadow-black [text-shadow:0_1px_2px_var(--tw-shadow-color)]">{name}</span>
  </div>
);

export default function Desktop() {
  const [time, setTime] = useState('');
  const [windows, setWindows] = useState<{ [key: string]: boolean }>({
    'Projects': false,
    'Contact': false,
    'Junk Ideas': false,
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
    { name: 'Junk Ideas', icon: '/icons/bin.png' },
  ];

  const desktopItems = [
    { name: 'Projects', icon: '/icons/folder.png', action: () => openWindow('Projects') },
    { name: 'Contact Me', icon: '/icons/contact.png', action: () => openWindow('Contact') },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/wallpaper.jpg')" }}>

      {/* Desktop Icons */}
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-4">
        {desktopItems.map(item => (
          <DesktopIcon key={item.name} name={item.name} icon={item.icon} onDoubleClick={item.action} />
        ))}
      </div>

      {/* Windows */}
      {windows['Projects'] && (
        <Window title="Projects" onClose={() => closeWindow('Projects')}>
          <p>Here are some of my projects...</p>
        </Window>
      )}
      {windows['Contact'] && (
        <Window title="Contact Me" onClose={() => closeWindow('Contact')}>
          <p>You can reach me at...</p>
        </Window>
      )}
      {windows['Junk Ideas'] && (
        <Window title="Junk Ideas" onClose={() => closeWindow('Junk Ideas')}>
          <p>Here are some of my junk ideas...</p>
        </Window>
      )}

      {/* Dock */}
      <footer ref={dockRef} className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center">
        <div className="flex items-end space-x-2 p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
          {dockItems.map((item) => (
            <DockIcon key={item.name} name={item.name} icon={item.icon} onClick={() => openWindow(item.name)} />
          ))}
        </div>
      </footer>
    </div>
  );
}