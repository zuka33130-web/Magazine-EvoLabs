import React, { useEffect, useRef } from 'react';

interface GridNode {
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
}

export const EvoHeroInteractiveGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Mouse state
    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
      parallaxX: 0,
      parallaxY: 0,
      targetParallaxX: 0,
      targetParallaxY: 0,
    };

    // Grid configuration
    const SPACING = 24; // Smaller, finer architectural square cells
    const INFLUENCE_RADIUS = 180; // Radius of mouse deformation
    const MAX_PULL = 10; // Subtle depth displacement
    const EASING = 0.12; // Spring interpolation rate

    let nodes: GridNode[][] = [];
    let cols = 0;
    let rows = 0;

    let dpr = 1;

    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      cols = Math.ceil(width / SPACING) + 2;
      rows = Math.ceil(height / SPACING) + 2;

      nodes = [];
      for (let r = 0; r < rows; r++) {
        const rowNodes: GridNode[] = [];
        for (let c = 0; c < cols; c++) {
          const x = (c - 1) * SPACING;
          const y = (r - 1) * SPACING;
          rowNodes.push({
            baseX: x,
            baseY: y,
            currentX: x,
            currentY: y,
            targetX: x,
            targetY: y,
          });
        }
        nodes.push(rowNodes);
      }
    };

    initGrid();

    // Resize handler
    const handleResize = () => {
      initGrid();
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking over the parent section or window
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.active = true;

        // Subtle parallax target (-5px to +5px)
        const normX = (mouse.x / width) * 2 - 1;
        const normY = (mouse.y / height) * 2 - 1;
        mouse.targetParallaxX = normX * 5;
        mouse.targetParallaxY = normY * 4;
      } else {
        mouse.active = false;
        mouse.targetParallaxX = 0;
        mouse.targetParallaxY = 0;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetParallaxX = 0;
      mouse.targetParallaxY = 0;
    };

    // Touch support for mobile / tablet
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          mouse.x = touch.clientX - rect.left;
          mouse.y = touch.clientY - rect.top;
          mouse.active = true;
        }
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation render loop
    let isSleeping = false;
    let sleepFramesCount = 0;

    const render = () => {
      // Smooth parallax easing
      mouse.parallaxX += (mouse.targetParallaxX - mouse.parallaxX) * 0.08;
      mouse.parallaxY += (mouse.targetParallaxY - mouse.parallaxY) * 0.08;

      let hasActiveMotion = mouse.active;

      // Update node physics
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];
          const nodeBaseX = node.baseX + mouse.parallaxX;
          const nodeBaseY = node.baseY + mouse.parallaxY;

          if (mouse.active) {
            const dx = mouse.x - nodeBaseX;
            const dy = mouse.y - nodeBaseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < INFLUENCE_RADIUS) {
              const factor = 1 - dist / INFLUENCE_RADIUS;
              // Smooth sine easing for gravitational well / sunken pocket
              const pull = Math.sin((factor * Math.PI) / 2) * MAX_PULL;
              
              // Inward displacement + slight 3D perspective sag (+factor * 3px)
              node.targetX = nodeBaseX + (dx / dist) * pull;
              node.targetY = nodeBaseY + (dy / dist) * pull + factor * factor * 3;
            } else {
              node.targetX = nodeBaseX;
              node.targetY = nodeBaseY;
            }
          } else {
            node.targetX = nodeBaseX;
            node.targetY = nodeBaseY;
          }

          // Spring interpolation
          const diffX = node.targetX - node.currentX;
          const diffY = node.targetY - node.currentY;

          if (Math.abs(diffX) > 0.02 || Math.abs(diffY) > 0.02) {
            hasActiveMotion = true;
          }

          node.currentX += diffX * EASING;
          node.currentY += diffY * EASING;
        }
      }

      // Check if we can sleep to save battery / CPU when completely at rest
      if (!hasActiveMotion) {
        sleepFramesCount++;
      } else {
        sleepFramesCount = 0;
        isSleeping = false;
      }

      // Render canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw horizontal grid lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];
          if (c === 0) {
            ctx.moveTo(node.currentX, node.currentY);
          } else {
            ctx.lineTo(node.currentX, node.currentY);
          }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // 2. Draw vertical grid lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const node = nodes[r][c];
          if (r === 0) {
            ctx.moveTo(node.currentX, node.currentY);
          } else {
            ctx.lineTo(node.currentX, node.currentY);
          }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // 3. Highlight sunken region lines with subtle cyber-cyan / amber tint
      if (mouse.active) {
        const radius = INFLUENCE_RADIUS;
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          radius
        );
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
        grad.addColorStop(0.4, 'rgba(245, 158, 11, 0.08)');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        // Draw local highlight curves over the deformed cells
        const minC = Math.max(0, Math.floor((mouse.x - radius) / SPACING));
        const maxC = Math.min(cols - 1, Math.ceil((mouse.x + radius) / SPACING) + 1);
        const minR = Math.max(0, Math.floor((mouse.y - radius) / SPACING));
        const maxR = Math.min(rows - 1, Math.ceil((mouse.y + radius) / SPACING) + 1);

        // Deformed horizontal segments
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        for (let r = minR; r <= maxR; r++) {
          ctx.beginPath();
          let started = false;
          for (let c = minC; c <= maxC; c++) {
            const node = nodes[r][c];
            if (!started) {
              ctx.moveTo(node.currentX, node.currentY);
              started = true;
            } else {
              ctx.lineTo(node.currentX, node.currentY);
            }
          }
          ctx.stroke();
        }

        // Deformed vertical segments
        for (let c = minC; c <= maxC; c++) {
          ctx.beginPath();
          let started = false;
          for (let r = minR; r <= maxR; r++) {
            const node = nodes[r][c];
            if (!started) {
              ctx.moveTo(node.currentX, node.currentY);
              started = true;
            } else {
              ctx.lineTo(node.currentX, node.currentY);
            }
          }
          ctx.stroke();
        }
      }

      // 4. Subtle Crosshair intersections & dots
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];
          
          let distToMouse = 9999;
          if (mouse.active) {
            const dx = mouse.x - node.currentX;
            const dy = mouse.y - node.currentY;
            distToMouse = Math.sqrt(dx * dx + dy * dy);
          }

          if (distToMouse < INFLUENCE_RADIUS) {
            // Illuminated technical crosshair near cursor
            const factor = 1 - distToMouse / INFLUENCE_RADIUS;
            ctx.fillStyle = `rgba(6, 182, 212, ${0.15 + factor * 0.4})`;
            ctx.fillRect(node.currentX - 1.5, node.currentY - 1.5, 3, 3);
          } else if ((r + c) % 3 === 0) {
            // Architectural corner dots
            ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
            ctx.fillRect(node.currentX - 0.75, node.currentY - 0.75, 1.5, 1.5);
          }
        }
      }

      ctx.restore();

      // Sleep after 60 static frames (1 second without interaction or movement)
      if (sleepFramesCount > 60) {
        isSleeping = true;
      }

      if (!isSleeping) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Wakeup trigger
    const wakeUp = () => {
      if (isSleeping) {
        isSleeping = false;
        sleepFramesCount = 0;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('mousemove', wakeUp, { passive: true });
    window.addEventListener('touchmove', wakeUp, { passive: true });

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', wakeUp);
      window.removeEventListener('touchmove', wakeUp);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
      style={{
        maskImage: 'radial-gradient(ellipse 90% 85% at 50% 25%, black 45%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 50% 25%, black 45%, transparent 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-65 transition-opacity duration-700"
      />
      {/* Subtle depth lighting vignette in background */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_20%] from-cyan-950/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
