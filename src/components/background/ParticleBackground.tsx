import { useEffect, useRef, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  density: number;
  opacity: number;
  connections: number;
}

interface MousePosition {
  x: number | null;
  y: number | null;
}

const COLORS = {
  primary: '#6366f1', // indigo-500
  secondary: '#a855f7', // purple-500
  accent: '#ec4899', // pink-500
  light: '#f1f5f9', // slate-100
  dark: '#0f172a', // slate-900
};

const PARTICLE_COUNT = 100;
const CONNECTION_DISTANCE = 150;
const MOUSE_RADIUS = 150;

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const mousePosition = useRef<MousePosition>({ x: null, y: null });
  const time = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  // パーティクルの作成
  const createParticles = useCallback((canvas: HTMLCanvasElement) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2 + 1;
      const density = Math.random() * 30 + 10;
      
      newParticles.push({
        x,
        y,
        radius,
        color: COLORS.light,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        baseX: x,
        baseY: y,
        density,
        opacity: Math.random() * 0.5 + 0.2,
        connections: 0,
      });
    }
    return newParticles;
  }, []);

  // パーティクルの描画
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    // グラデーションの作成
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius * 2
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
    gradient.addColorStop(0.5, `rgba(99, 102, 241, ${particle.opacity * 0.5})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.shadowColor = COLORS.primary;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
  }, []);

  // パーティクル間の接続線を描画
  const connectParticles = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    for (let i = 0; i < particles.length; i++) {
      particles[i].connections = 0;
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONNECTION_DISTANCE) {
          particles[i].connections++;
          particles[j].connections++;
          
          // 距離に応じて透明度を変更
          const opacity = 1 - (distance / CONNECTION_DISTANCE);
          
          // グラデーションラインの作成
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          
          gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity * 0.5})`);
          gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity * 0.3})`);
          gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity * 0.5})`);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }, []);

  // 波紋エフェクトの描画
  const drawRipples = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const rippleCount = 3;
    const maxRadius = Math.max(canvas.width, canvas.height) * 0.4;
    
    for (let i = 0; i < rippleCount; i++) {
      const progress = ((time.current / 100) + (i / rippleCount)) % 1;
      const radius = progress * maxRadius;
      const opacity = 0.2 * (1 - progress);
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, radius
      );
      
      gradient.addColorStop(0, `rgba(99, 102, 241, 0)`);
      gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity * 0.1})`);
      gradient.addColorStop(1, `rgba(236, 72, 153, 0)`);
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
    }
  }, []);

  // グラデーションバックグラウンドの描画
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f172a'); // slate-900
    gradient.addColorStop(1, '#1e293b'); // slate-800
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 背景のグロー効果
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const glowRadius = Math.min(canvas.width, canvas.height) * 0.6;
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, glowRadius
    );
    
    glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
    glowGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.03)');
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // アニメーションループ
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !isVisible) return;
    
    // キャンバスのクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景の描画
    drawBackground(ctx, canvas);
    
    // 波紋エフェクトの描画
    drawRipples(ctx, canvas);
    
    // パーティクルの更新と描画
    for (let i = 0; i < particles.current.length; i++) {
      const particle = particles.current[i];
      
      // 自然な動き
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 画面端での反射
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -1;
      }
      
      // マウスとの相互作用
      if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
        const dx = particle.x - mousePosition.current.x;
        const dy = particle.y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 0.5;
          const pushY = Math.sin(angle) * force * 0.5;
          
          particle.x += pushX;
          particle.y += pushY;
        }
      }
      
      // 元の位置に戻る傾向
      const dx = particle.baseX - particle.x;
      const dy = particle.baseY - particle.y;
      particle.vx += dx * 0.01;
      particle.vy += dy * 0.01;
      
      // 摩擦
      particle.vx *= 0.95;
      particle.vy *= 0.95;
      
      // パーティクルの描画
      drawParticle(ctx, particle);
    }
    
    // パーティクル間の接続
    connectParticles(ctx, particles.current);
    
    time.current++;
    animationFrameId.current = requestAnimationFrame(animate);
  }, [drawBackground, drawRipples, drawParticle, connectParticles, isVisible]);

  // マウス位置の追跡
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePosition.current = {
      x: e.clientX,
      y: e.clientY
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosition.current = {
      x: null,
      y: null
    };
  }, []);

  // タッチデバイス対応
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      mousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mousePosition.current = {
      x: null,
      y: null
    };
  }, []);

  // Intersection Observer を使用して可視性を検出
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  // キャンバスの初期化とイベントリスナーの設定
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // リサイズ時にパーティクルを再生成
      particles.current = createParticles(canvas);
    };

    // キャンバスのサイズ設定
    resizeCanvas();
    
    // パーティクルの生成
    particles.current = createParticles(canvas);
    
    // イベントリスナーの設定
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove as EventListener);
    window.addEventListener('touchend', handleTouchEnd);
    
    // アニメーションの開始
    animate();
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove as EventListener);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate, createParticles, handleMouseMove, handleMouseLeave, handleTouchMove, handleTouchEnd]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#0F172A' }}
    />
  );
};
