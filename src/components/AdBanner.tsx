import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, X } from 'lucide-react';

interface Ad {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  placement: string;
}

interface AdBannerProps {
  placement: 'marketplace' | 'community' | 'grimoire' | 'oracle';
  className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch(`/api/ads?placement=${placement}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAds(data);
        }
      })
      .catch(console.error);
  }, [placement]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 10000); // Roda a cada 10s se houver mais de um anúncio pro mesmo lugar
    return () => clearInterval(interval);
  }, [ads.length]);

  if (!isVisible || ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`relative group overflow-hidden rounded-xl border border-white/10 bg-black/40 ${className}`}
        >
          <a
            href={currentAd.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full h-full"
          >
            <img
              src={currentAd.image_url}
              alt={currentAd.title}
              className="w-full h-full object-cover max-h-[150px] transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded border border-white/10 text-[8px] font-black text-white/70 uppercase tracking-widest pointer-events-none">
              Patrocinado
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="text-white text-xs font-bold drop-shadow-md">
                {currentAd.title}
              </span>
              <ExternalLink className="w-4 h-4 text-white drop-shadow-md" />
            </div>
          </a>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsVisible(false);
            }}
            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-rose-500/80 rounded-full text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            title="Fechar propaganda"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
