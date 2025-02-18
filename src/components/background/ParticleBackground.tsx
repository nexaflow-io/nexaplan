import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  opacity: number;
  scale: number;
  life: number;
  maxLife: number;
  twinkleSpeed: number;
  isShootingStar: boolean;
}

const colors = [
  'rgba(255, 255, 255, 0.8)', // 明るい星
  'rgba(199, 210, 254, 0.8)', // indigo-200
  'rgba(221, 214, 254, 0.8)', // violet-200
  'rgba(196, 181, 253, 0.8)', // violet-300
];

const MAX_PARTICLES = 50;
const PARTICLE_LIFETIME = 400;

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const isFirstRender = useRef(true);
  const time = useRef(0);

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1 + 0.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.1;
    const isShootingStar = Math.random() < 0.01; // 1%の確率で流れ星に

    return {
      x,
      y,
      radius,
      color,
      vx: isShootingStar ? -2 - Math.random() * 4 : Math.cos(angle) * speed,
      vy: isShootingStar ? 1 + Math.random() * 2 : Math.sin(angle) * speed,
      angle,
      opacity: Math.random() * 0.4 + 0.3,
      scale: 1,
      life: PARTICLE_LIFETIME,
      maxLife: PARTICLE_LIFETIME,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      isShootingStar,
    };
  };

  const drawParticle = (
    ctx: CanvasRenderingContext2D,
    particle: Particle
  ) => {
    const lifeProgress = particle.life / particle.maxLife;
    let currentOpacity = particle.opacity;

    if (!particle.isShootingStar) {
      // 通常の星のきらめき効果
      const twinkle = Math.sin(time.current * particle.twinkleSpeed);
      currentOpacity = particle.opacity * (0.6 + twinkle * 0.4);
    } else {
      // 流れ星のフェードアウト
      currentOpacity = particle.opacity * (lifeProgress * 0.8);
    }

    ctx.beginPath();

    if (particle.isShootingStar) {
      // 流れ星の尾を描画
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x + 8, particle.y - 1);
      ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.5})`;
      ctx.lineWidth = particle.radius;
      ctx.stroke();
    }

    // 星を描画
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 2
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
    gradient.addColorStop(0.4, particle.color.replace(/[\d.]+\)$/g, `${currentOpacity})`));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;

    ctx.shadowColor = particle.color;
    ctx.shadowBlur = particle.radius * (particle.isShootingStar ? 2 : 1.5);
    ctx.globalAlpha = 1;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  const updateParticle = (particle: Particle, canvas: HTMLCanvasElement) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= particle.isShootingStar ? 2 : 0.2;

    // 画面外に出たら反対側から再登場
    if (!particle.isShootingStar) {
      if (particle.x < -10) particle.x = canvas.width + 10;
      if (particle.x > canvas.width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = canvas.height + 10;
      if (particle.y > canvas.height + 10) particle.y = -10;
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    // 完全にクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 暗い背景を描画
    ctx.fillStyle = 'rgb(15, 23, 42)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // パーティクルの生成と削除
    particles.current = particles.current.filter(p => p.life > 0);

    // 生成頻度を下げる
    if (particles.current.length < MAX_PARTICLES && Math.random() < 0.05) {
      particles.current.push(createParticle(canvas));
    }

    time.current += 1;

    particles.current.forEach(particle => {
      updateParticle(particle, canvas);
      drawParticle(ctx, particle);
    });

    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!isFirstRender.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      isFirstRender.current = false;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.current.push(createParticle(canvas));
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-[#0F172A]"
      style={{ background: '#0F172A' }}
    />
  );
};
