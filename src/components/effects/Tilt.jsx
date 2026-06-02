import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

/**
 * Subtle 3D tilt on mouse move — premium "depth" effect (motion.page style).
 * Desktop only (driven by mousemove); touch devices never trigger it.
 * Honors prefers-reduced-motion by disabling the tilt.
 *
 * Wrap any card/element:
 *   <Tilt className="my-card-wrapper"> ...card... </Tilt>
 */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Tilt({
  children,
  className,
  max = 7,        // max tilt in degrees
  scale = 1.015,  // subtle lift on hover
  style,
  ...props
}) {
  const ref = useRef(null);

  // -0.5 .. 0.5 normalized cursor position within the element
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 150, damping: 18, mass: 0.4 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  if (prefersReducedMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
