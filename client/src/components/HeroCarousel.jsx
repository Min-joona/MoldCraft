import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const INTERVAL = 5000;

export default function HeroCarousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const len = slides.length;

  const next = useCallback(() => setCurrent(i => (i + 1) % len), [len]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + len) % len), [len]);

  useEffect(() => {
    if (len < 2) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [len, next]);

  if (!len) return null;

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title || 'Hero slide'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/60" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="page-wrapper relative z-10 py-24">
        <div className="max-w-4xl">
          {slide.subtitle && (
            <motion.div
              key={`tag-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="section-tag">{slide.subtitle}</span>
            </motion.div>
          )}

          {slide.title && (
            <motion.h1
              key={`title-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-display text-6xl md:text-8xl lg:text-[7rem] font-extrabold uppercase leading-[0.9] tracking-tight text-white mb-8"
            >
              {slide.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <span className="block text-brand-500"> </span>}
                  {line}
                </span>
              ))}
            </motion.h1>
          )}

          {slide.link && (
            <motion.div
              key={`link-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Link to={slide.link} className="btn-primary flex items-center gap-2 text-base w-fit">
                {slide.linkText || 'Learn More'} <HiArrowRight />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dots */}
      {len > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-brand-500 w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrow hints */}
      {len > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </>
      )}
    </section>
  );
}
