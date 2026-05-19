import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Wrench, Search, Activity, ShieldCheck, Star } from 'lucide-react';

const FRAME_COUNT = 113;
const framePath = (i) =>
  `/hero-frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

export default function HeroScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === FRAME_COUNT) setLoaded(true);
        // First-frame is the most important — render as soon as it's ready
        if (i === 1) drawFrame(0);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    // Fallback: even if some frames stall, show the section after 3s
    const timer = setTimeout(() => setLoaded(true), 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // cover-fit
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), scrollable);
      const prog = scrollable > 0 ? passed / scrollable : 0;
      setProgress(prog);

      const frame = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(prog * (FRAME_COUNT - 1)))
      );

      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame;
        // animate via rAF for smoother updates
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frame));
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(currentFrameRef.current));
      update();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Stage-based fades for the overlaid copy
  const headlineOpacity = progress < 0.55 ? 1 - progress * 0.9 : 0;
  const headlineY = progress * -40;
  const subFadeIn = Math.min(1, Math.max(0, (progress - 0.5) * 2.5));

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: '320vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink-950">
        {/* Frame canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
        />

        {/* Vignette + grain overlays */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,12,17,0.55) 0%, rgba(10,12,17,0) 25%, rgba(10,12,17,0) 60%, rgba(10,12,17,0.85) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(10,12,17,0.55) 100%)',
          }}
        />

        {/* Loading splash */}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-ink-950 z-[5]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-brand animate-spin" />
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Loading experience</p>
            </div>
          </div>
        )}

        {/* Foreground copy */}
        <div className="relative z-10 h-full container-page flex flex-col">
          <div className="flex-1 flex flex-col justify-center pt-24">
            <motion.div
              style={{ opacity: headlineOpacity, transform: `translateY(${headlineY}px)` }}
              className="max-w-3xl"
            >
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/90 text-xs font-medium mb-6"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open today · Most repairs in 30 min
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-display-xl font-bold text-white tracking-tight leading-[1.02] text-balance"
              >
                Fast. Trusted.
                <span className="block bg-gradient-to-r from-brand-light via-white to-brand-light bg-clip-text text-transparent">
                  Repairs.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="mt-6 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed"
              >
                Derby&rsquo;s most-trusted mobile repair specialists. Same-day fixes, premium
                refurbished phones and the accessories you actually need — all warranty-backed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <Link to="/repairs" className="btn-accent">
                  <Wrench size={16} /> Book Repair
                </Link>
                <Link to="/repairs#quote" className="btn-ghost text-ink-950">
                  <Search size={16} /> Instant Quote
                </Link>
                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-white/90 hover:text-white text-sm font-medium border border-white/20 hover:bg-white/10 transition"
                >
                  <Activity size={16} /> Track Repair
                  <ChevronRight size={15} />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom info strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7 }}
            className="pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div className="flex items-center gap-6 sm:gap-8 text-white/80">
              <Stat number="12K+" label="Repairs done" />
              <Stat number="4.9★" label="Google rating" />
              <Stat number="12mo" label="Warranty" />
            </div>
            <div
              style={{ opacity: subFadeIn }}
              className="hidden md:flex items-center gap-3 text-white/60 text-xs uppercase tracking-[0.18em]"
            >
              <span>Scroll to begin</span>
              <span className="relative w-10 h-px bg-white/30 overflow-hidden">
                <span className="absolute inset-y-0 left-0 w-1/3 bg-brand-light animate-shimmer"></span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Frame progress meter */}
        <div className="absolute top-20 right-4 sm:right-8 z-10 hidden md:flex flex-col items-end gap-2">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            Frame {String(Math.round(progress * (FRAME_COUNT - 1)) + 1).padStart(3, '0')} / {FRAME_COUNT}
          </div>
          <div className="w-32 h-px bg-white/15 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-brand"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Trust row floating bottom */}
        <div className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-bold leading-none text-white">{number}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/55">{label}</div>
    </div>
  );
}
