import React, { useRef, useEffect, useMemo } from 'react';

const CanvasEffects = ({ mood, isPlaying, weatherData }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const ctxRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  const initialize = useMemo(() => {
    return () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctxRef.current = ctx;
      const resize = () => {
        widthRef.current = canvas.width = window.innerWidth;
        heightRef.current = canvas.height = window.innerHeight;
        initParticles();
      };
      window.addEventListener('resize', resize);
      resize();
      return () => window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  // HELPER: Which moods should listen to the live weather?
  const isWeatherSynced = mood === 'weather' || mood === 'chill' || mood === 'night-drive';

  const initParticles = () => {
    const { current: width } = widthRef;
    const { current: height } = heightRef;
    particlesRef.current = [];

    // 1. WEATHER-SYNCED MOODS
    if (isWeatherSynced && weatherData) {
      if (weatherData.condition === 'rain') {
        const dropCount = Math.floor((width * height) / 5000);
        for (let i = 0; i < dropCount; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: 20 + Math.random() * 40,
            speed: 15 + Math.random() * 15,
            opacity: 0.4 + Math.random() * 0.4,
            width: 1 + Math.random() * 2,
          });
        }
      } else if (weatherData.condition === 'snow') {
        const snowCount = Math.floor((width * height) / 8000);
        for (let i = 0; i < snowCount; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speed: 1 + Math.random() * 2,
            wind: (Math.random() - 0.5) * 1,
            opacity: 0.5 + Math.random() * 0.5,
          });
        }
      } else if (weatherData.condition === 'clear') {
        
        // SUNRISE / SUNSET DYNAMIC COLORS
        let orbHue = 220; // Default Night (Blue)
        if (weatherData.timeOfDay === 'day') orbHue = 50; // Yellow
        if (weatherData.timeOfDay === 'sunrise') orbHue = 30; // Orange/Pink
        if (weatherData.timeOfDay === 'sunset') orbHue = 15; // Deep Red/Orange

        const orbCount = Math.floor((width * height) / 12000);
        for (let i = 0; i < orbCount; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 20 + 5,
            hue: orbHue, 
            phase: Math.random() * Math.PI * 2
          });
        }
      } else if (weatherData.condition === 'clouds') {
        const cloudCount = Math.floor((width * height) / 20000);
        for (let i = 0; i < cloudCount; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * (height / 2),
            size: Math.random() * 60 + 40,
            speed: 0.1 + Math.random() * 0.3,
            opacity: 0.05 + Math.random() * 0.1,
          });
        }
      }
    } 
    // 2. FIXED ANIMATION MOODS
    else if (mood === 'gym') {
      const particleCount = Math.floor((width * height) / 4000);
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: height + Math.random() * 200,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 8 + 4),
          size: Math.random() * 3 + 1,
          life: Math.random() * 100,
          maxLife: 100,
          color: `hsl(${Math.random() * 40 + 10}, 100%, 60%)`
        });
      }
    } else if (mood === 'study') {
      const orbCount = Math.floor((width * height) / 15000);
      for (let i = 0; i < orbCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 40 + 10,
          hue: 180 + Math.random() * 40,
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (mood === 'love') {
      const dropCount = Math.floor((width * height) / 10000);
      for (let i = 0; i < dropCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: 15 + Math.random() * 30,
          speed: 6 + Math.random() * 10,
          opacity: 0.2 + Math.random() * 0.4,
          width: 1 + Math.random() * 2,
        });
      }
    } else if (mood === 'sleep') {
      const starCount = Math.floor((width * height) / 6000);
      for (let i = 0; i < starCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.5 + Math.random() * 2,
          baseAlpha: 0.1 + Math.random() * 0.3,
          alpha: 0.1 + Math.random() * 0.3,
          targetAlpha: 0.1 + Math.random() * 0.3,
          speed: 0.0005 + Math.random() * 0.002,
          phase: Math.random() * Math.PI * 2,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.002 + Math.random() * 0.004,
          color: `hsl(220, 80%, 80%)`,
        });
      }
    } else if (mood === 'chaganti' || mood === 'garikapati') {
      const dustCount = Math.floor((width * height) / 12000);
      for (let i = 0; i < dustCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 1,
          alpha: Math.random()
        });
      }
    }
  };

  const update = (delta) => {
    if (!isPlaying) return;
    const { current: width } = widthRef;
    const { current: height } = heightRef;
    const timeScale = delta * 0.06;

    if (isWeatherSynced && weatherData) {
      if (weatherData.condition === 'rain') {
        particlesRef.current.forEach((drop) => {
          drop.y += drop.speed * timeScale;
          drop.x += 1 * timeScale; // wind
          if (drop.y > height + drop.length) {
            drop.y = -drop.length;
            drop.x = Math.random() * width;
          }
        });
      } else if (weatherData.condition === 'snow') {
        particlesRef.current.forEach((flake) => {
          flake.y += flake.speed * timeScale;
          flake.x += flake.wind * timeScale;
          if (flake.y > height + 10) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }
        });
      } else if (weatherData.condition === 'clear') {
        particlesRef.current.forEach((orb) => {
          orb.x += orb.vx * timeScale;
          orb.y += orb.vy * timeScale;
          orb.phase += 0.01 * timeScale;
          if (orb.x < -100) orb.x = width + 100;
          if (orb.x > width + 100) orb.x = -100;
          if (orb.y < -100) orb.y = height + 100;
          if (orb.y > height + 100) orb.y = -100;
        });
      } else if (weatherData.condition === 'clouds') {
        particlesRef.current.forEach((cloud) => {
          cloud.x += cloud.speed * timeScale;
          if (cloud.x > width + cloud.size) {
            cloud.x = -cloud.size;
            cloud.y = Math.random() * (height / 2);
          }
        });
      }
    } else if (mood === 'gym') {
      particlesRef.current.forEach((p) => {
        p.x += p.vx * timeScale;
        p.y += p.vy * timeScale;
        p.life -= 1 * timeScale;
        p.vx += (Math.random() - 0.5) * 0.5 * timeScale;
        if (p.life <= 0 || p.y < -50 || p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
          p.y = height + Math.random() * 50;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = -(Math.random() * 8 + 4);
          p.life = 100;
        }
      });
    } else if (mood === 'study') {
      particlesRef.current.forEach((orb) => {
        orb.x += orb.vx * timeScale;
        orb.y += orb.vy * timeScale;
        orb.phase += 0.02 * timeScale;
        if (orb.x < -100) orb.x = width + 100;
        if (orb.x > width + 100) orb.x = -100;
        if (orb.y < -100) orb.y = height + 100;
        if (orb.y > height + 100) orb.y = -100;
      });
    } else if (mood === 'love') {
      particlesRef.current.forEach((drop) => {
        drop.y += drop.speed * timeScale;
        if (drop.y > height + drop.length) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      });
    } else if (mood === 'sleep') {
      particlesRef.current.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed * timeScale;
        star.targetAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.6;
        star.alpha += (star.targetAlpha - star.alpha) * 0.05 * timeScale;
        star.x += Math.sin(star.phase) * 0.01 * timeScale;
        star.y += Math.cos(star.phase) * 0.01 * timeScale;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      });
    } else if (mood === 'chaganti' || mood === 'garikapati') {
      particlesRef.current.forEach((dust) => {
        dust.x += dust.vx * timeScale;
        dust.y += dust.vy * timeScale;
        dust.alpha += (Math.random() - 0.5) * 0.05 * timeScale;
        dust.alpha = Math.max(0.1, Math.min(0.8, dust.alpha));
        if (dust.y < -50) {
          dust.y = height + 50;
          dust.x = Math.random() * width;
        }
      });
    }
  };

  const draw = () => {
    const ctx = ctxRef.current;
    const { current: width } = widthRef;
    const { current: height } = heightRef;
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (isWeatherSynced && weatherData) {
      if (weatherData.condition === 'rain') {
        ctx.lineCap = 'round';
        particlesRef.current.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.length * 0.1, drop.y + drop.length);
          ctx.strokeStyle = `rgba(200, 220, 255, ${drop.opacity})`;
          ctx.lineWidth = drop.width;
          ctx.stroke();
        });
      } else if (weatherData.condition === 'snow') {
        particlesRef.current.forEach((flake) => {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          ctx.fill();
        });
      } else if (weatherData.condition === 'clear') {
        ctx.globalCompositeOperation = 'lighter';
        particlesRef.current.forEach((orb) => {
          const opacity = 0.1 + Math.sin(orb.phase) * 0.05;
          const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
          grad.addColorStop(0, `hsla(${orb.hue}, 100%, 80%, ${opacity})`);
          grad.addColorStop(1, `hsla(${orb.hue}, 100%, 50%, 0)`);
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';
      } else if (weatherData.condition === 'clouds') {
        particlesRef.current.forEach((cloud) => {
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
          ctx.fill();
        });
      }
    } else if (mood === 'gym') {
      particlesRef.current.forEach((p) => {
        const opacity = Math.max(0, p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
    } else if (mood === 'study') {
      ctx.globalCompositeOperation = 'lighter';
      particlesRef.current.forEach((orb) => {
        const opacity = 0.1 + Math.sin(orb.phase) * 0.05;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        grad.addColorStop(0, `hsla(${orb.hue}, 100%, 80%, ${opacity})`);
        grad.addColorStop(1, `hsla(${orb.hue}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
    } else if (mood === 'love') {
      ctx.lineCap = 'round';
      particlesRef.current.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(173, 216, 230, ${drop.opacity})`;
        ctx.lineWidth = drop.width;
        ctx.stroke();
      });
    } else if (mood === 'sleep') {
      particlesRef.current.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        const alpha = Math.max(0, Math.min(1, star.alpha));
        ctx.fillStyle = star.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
        ctx.fill();
        if (alpha > 0.4) {
          ctx.shadowBlur = star.radius * 4;
          ctx.shadowColor = 'white';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    } else if (mood === 'chaganti' || mood === 'garikapati') {
      particlesRef.current.forEach((dust) => {
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${dust.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'gold';
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
  };

  const animate = (time) => {
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    update(delta);
    draw();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [mood, isPlaying, weatherData]);

  useEffect(() => {
    initParticles();
  }, [mood, weatherData]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, left: 0, 
        width: '100vw', height: '100vh', 
        pointerEvents: 'none', 
        zIndex: 5 
      }} 
    />
  );
};

export default CanvasEffects;
